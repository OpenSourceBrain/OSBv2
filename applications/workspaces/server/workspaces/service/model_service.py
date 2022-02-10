import json
from multiprocessing import AuthenticationError
import os

from flask_sqlalchemy import Pagination

from cloudharness import log as logger
from cloudharness.events.decorators import send_event
import cloudharness.workflows.argo as argo

from workspaces.models import OSBRepository, OSBRepositoryEntity, WorkspaceEntity, Workspace, WorkspaceResource
from workspaces.models.resource_status import ResourceStatus
from workspaces.models.user import User
from workspaces.repository import (
    OSBRepositoryRepository,
    VolumeStorageRepository,
    WorkspaceRepository,
    WorkspaceResourceRepository,
    TagRepository,
)
from workspaces.repository.base_model_repository import BaseModelRepository
from workspaces.repository.models import TWorkspaceEntity, WorkspaceResourceEntity
from workspaces.service.kubernetes import clone_workspace_volume
from workspaces.service.auth import get_auth_client, keycloak_user_id
from workspaces.utils import dao_entity2dict

def rm_null_values(dikt):
    tmp = {}
    for k, v in dikt.items():  # remove null fields from dict
        if v:
            tmp.update({k: v})
    return tmp

class NotAuthorized(Exception): pass

class UserService():
    def get(self, user_id):

        try:

            user = get_auth_client().get_user(user_id)
            return User(
                id=user.get("id", ""),
                first_name=user.get("firstName", ""),
                last_name=user.get("lastName", ""),
                username=user.get("username", ""),
                email=user.get("email", ""),
            )
        except Exception as e:
            return User()



class BaseModelService:
    """
    Generic base model service class
    """

    repository: BaseModelRepository = None
    user_service = UserService()

    calculated_fields = set()

    def _calculated_fields_populate(self, obj):
        if self.calculated_fields:
            for fld in self.calculated_fields:
                setattr(obj, fld, getattr(self, fld)(obj))
        return obj

    def search(self, page=1, per_page=20, *args, **kwargs) -> Pagination:
        """
        Query the model and return all records

        Args:
            page: The page number
            per_page: The number of records per page to limit

        Returns:
            dict with all records from the model
            current page
            number of pages
        """
        logger.debug("Search args %s", args)
        logger.debug("Search kwargs %s", kwargs)
        objects = self.repository.search(page=page, per_page=per_page, *args, **kwargs)
        
        for obj in objects.items:
            self._calculated_fields_populate(obj)
        return objects

    def post(self, body):
        """Save an object to the repository."""
        body = rm_null_values(body)
        if 'user_id' not in body:
            body['user_id'] = keycloak_user_id()
        return self._calculated_fields_populate(self.repository.post(body))

    def get(self, id_):
        """Get an object from the repository."""
        res = self.repository.get(id_)
        if not self.is_authorized(res):
            raise NotAuthorized()
        return self._calculated_fields_populate(res)

    def put(self, body, id_):
        """Update an object in the repository."""
        body = rm_null_values(body)
        return self._calculated_fields_populate(self.repository.put(body, id_))

    def delete(self, id_):
        """Delete an object from the repository."""
        return self.repository.delete(id_)

    def __str__(self):
        return str(self.repository)

    def is_authorized(self, object):
        raise NotImplementedError(f"Authorization not implemented for {self.__class__.__name__}")


    

class WorkspaceService(BaseModelService):
    repository = WorkspaceRepository()
    resource_repository = WorkspaceResourceRepository()
    
    calculated_fields = {"user"}

    @send_event(message_type="workspace", operation="create")
    def post(self, body):
        for r in body.get("resources", []):
            r.update({"origin": json.dumps(r.get("origin"))})
        return super().post(body)

    @send_event(message_type="workspace", operation="create")
    def clone(self, workspace_id):
        workspace = self.get(workspace_id)
        if workspace is None:
            raise Exception(f"Cannot clone workspace with id {workspace_id}: not found.")

        cloned = dict(
            name=f"Clone of {workspace['name']}",
            tags=workspace['tags'],
            user_id=keycloak_user_id(),
            thumbnail=workspace['thumbnail'],
            description=workspace['description'],
            publicable=False,
            featured=False,
        )
        cloned = self.repository.post(cloned, do_post=False)
        clone_workspace_volume(source_ws_id=workspace_id, dest_ws_id=cloned.id)
        self.resource_repository.update_workspace_resources(
            cloned.id,
            [os.path.join(r['folder'], r['name'])
             for r in workspace['resources'] if r['status'] == ResourceStatus.A]
        )
        return cloned

    def is_authorized(self, workspace):
        current_user_id = keycloak_user_id()
        return workspace and (workspace.publicable or
                          (workspace.user_id and workspace.user_id == current_user_id) or
                          (get_auth_client().user_has_realm_role(user_id=current_user_id, role="administrator")))


    def search(self, page=1, per_page=20, *args, **kwargs) -> Pagination:
        """
        Query the model and return all records

        Args:
            page: The page number
            per_page: The number of records per page to limit

        Returns:
            dict with all records from the model
            current page
            number of pages
        """
        logger.debug("Search args %s", args)
        logger.debug("Search kwargs %s", kwargs)
        
        current_user_id = keycloak_user_id()

        if current_user_id is not None:
            # Admins see all workspaces, non admin users can see only their own workspaces
            if not get_auth_client().user_has_realm_role(user_id=current_user_id, role="administrator"):
                objects = self.repository.search(page=page, per_page=per_page, user_id=current_user_id, *args, **kwargs)
            else:
                objects = self.repository.search(page=page, per_page=per_page, user_id=current_user_id, show_all=True, *args, **kwargs)
        else: 
            objects = self.repository.search(page=page, per_page=per_page, *args, **kwargs)
        for obj in objects.items:
            self._calculated_fields_populate(obj)
        return objects
            
    def get(self, id_):
        
        
        workspace_entity: TWorkspaceEntity = super().get(id_)

        workspace = dao_entity2dict(workspace_entity)
        
        if workspace:
            resources = workspace.get("resources")
            if resources:
                for r in resources:
                    r.update({"origin": json.loads(r.get("origin"))})
            else:
                workspace.update({"resources": []})
        # check if there are running import tasks
        logger.debug(
            "Post get, check workflows for workspace %....", workspace.get("id"))
        workflows = argo.get_workflows(status="Running", limit=9999)
        if workflows and workflows.items:
            for workflow in workflows.items:
                try:
                    if workflow.status == "Running" and workflow.raw.spec.templates[0].metadata.labels.get(
                            "workspace"
                    ).strip() == str(workspace["id"]):
                        fake_path = f"Importing resources, progress {workflow.raw.status.progress}".replace(
                            "/", " of ")
                        workspace["resources"].append(
                            {
                                "id": -1,
                                "name": "Importing resources into workspace",
                                "origin": {"path": fake_path},
                                "resource_type": "e",
                                "workspace_id": workspace["id"],
                            }
                        )
                    break
                except Exception as e:
                    # probably not a workspace import workflow job --> skip it
                    pass
        return workspace

    def user(self, workspace):
        return self.user_service.get(workspace.user_id)

class OsbrepositoryService(BaseModelService):
    repository = OSBRepositoryRepository() 
    calculated_fields = {"user", "content_types_list"}

    @send_event(message_type="osbrepository", operation="create")
    def post(self, body):
        self.map_entity(body)
        return super().post(body)

    def put(self, body, id_):
        self.map_entity(body)
        return super().put(body, id_)

    def map_entity(self, body):
        content_types = ""
        # convert the content types list to a content type comma separated string
        for ct in body["content_types_list"]:
            content_types += f",{ct}"
        body.update({"content_types": content_types.strip(",")})
        for del_attr in body.keys() & ['description', 'content_types_list']:
            del body[del_attr]

    def is_authorized(self, repository):
        # All osbrepositories are public
        return True

    def content_types_list(self, osb_repository):
        return osb_repository.content_types.split(",")

    
    def user(self, osbrepo):
        return self.user_service.get(osbrepo.user_id)

class VolumestorageService(BaseModelService):
    repository = VolumeStorageRepository()

    def is_authorized(self, volume_storage):
        current_user_id = keycloak_user_id()
        return  (get_auth_client().user_has_realm_role(user_id=current_user_id, role="administrator"))

class WorkspaceresourceService(BaseModelService):
    repository = WorkspaceResourceRepository()
    workspace_service = WorkspaceService()  
    def post(self, body):
        body.update({"origin": json.dumps(body.get("origin"))})
        return super().post(body)

    def is_authorized(self, resource: WorkspaceResourceEntity):
        # A resource is authorized if belongs to an authorized workspace
        try:
            self.workspace_service.get(resource.workspace_id)
        except NotAuthorized:
            return False
        return True

    def get(self, id_):
        workspace_resource = super().get(id_)

        if len(workspace_resource) > 2:
            workspace_resource.update(
                {"origin": json.loads(workspace_resource.get("origin"))})
        return workspace_resource


class TagService(BaseModelService):
    repository = TagRepository()


    def is_authorized(self, tag):
        # All tags are public
        return True

