import json
from multiprocessing import AuthenticationError
import os
import shutil
from cloudharness.applications import get_configuration

from cloudharness.service.pvc import create_persistent_volume_claim, delete_persistent_volume_claim

from flask_sqlalchemy import Pagination

from cloudharness import log as logger
from cloudharness.events.decorators import send_event
import cloudharness.workflows.argo as argo
from workspaces.config import Config


from workspaces.models import OSBRepository, OSBRepositoryEntity, WorkspaceEntity, Workspace, WorkspaceResource
from workspaces.models.resource_status import ResourceStatus
from workspaces.models.resource_type import ResourceType
from workspaces.models.tag import Tag
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
from workspaces.service import osbrepository as osbrepository_helper
from workspaces.service.kubernetes import create_volume
from workspaces.service.auth import get_auth_client, keycloak_user_id
from workspaces.service.user_quota_service import get_pvc_size, get_max_workspaces_for_user

from workspaces.utils import dao_entity2dict


def rm_null_values(dikt):
    tmp = {}
    for k, v in dikt.items():  # remove null fields from dict
        if v is not None:
            tmp.update({k: v})
    return tmp


class NotAuthorized(Exception):
    pass


class NotAllowed(Exception):
    pass


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
        objects = self.repository.search(
            page=page, per_page=per_page, *args, **kwargs)

        for obj in objects.items:
            self._calculated_fields_populate(obj)
        return objects

    def post(self, body):
        """Save an object to the repository."""
        body = rm_null_values(body)

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
        raise NotImplementedError(
            f"Authorization not implemented for {self.__class__.__name__}")


class WorkspaceService(BaseModelService):
    repository = WorkspaceRepository()
    resource_repository = WorkspaceResourceRepository()

    calculated_fields = {"user"}

    @staticmethod
    def get_pvc_name(workspace_id):
        return f"workspace-{workspace_id}"
    
    def check_max_num_workspaces_per_user(self, user_id=None):
        if not user_id:
            user_id = keycloak_user_id()
        if not get_auth_client().user_has_realm_role(user_id=user_id, role="administrator"):
            # for non admin users check if max number of ws per user limit is reached
            num_ws_current_user = self.repository.search(user_id=user_id).total
            max_num_ws_current_user = get_max_workspaces_for_user()
            if num_ws_current_user >= max_num_ws_current_user:
                raise NotAllowed(
                    f"Max number of {max_num_ws_current_user} workspaces " \
                    "limit exceeded"
                )

    @send_event(message_type="workspace", operation="create")
    def post(self, body):
        if 'user_id' not in body:
            body['user_id'] = keycloak_user_id()
        self.check_max_num_workspaces_per_user(body['user_id'])
        for r in body.get("resources", []):
            r.update({"origin": json.dumps(r.get("origin"))})
        workspace = Workspace.from_dict(body) # Validate
        workspace = super().post(body)

        create_volume(name=self.get_pvc_name(workspace.id),
                      size=self.get_workspace_volume_size(workspace))
        return workspace

    def put(self, body, id_):
        workspace = Workspace.from_dict(body) # Validate
        return super().put(body, id_)

    def get_workspace_volume_size(self, ws: Workspace):
        # Place to change whenever we implement user or workspace based sizing
        user_id = keycloak_user_id()
        return get_pvc_size(user_id)

    @send_event(message_type="workspace", operation="create")
    def clone(self, workspace_id):
        user_id = keycloak_user_id()
        self.check_max_num_workspaces_per_user(user_id)
        from workspaces.service.workflow import clone_workspaces_content
        workspace = self.get(workspace_id)
        if workspace is None:
            raise Exception(
                f"Cannot clone workspace with id {workspace_id}: not found.")

        cloned = dict(
            name=f"Clone of {workspace['name']}",
            tags=workspace['tags'],
            user_id=user_id,
            
            description=workspace['description'],
            publicable=False,
            featured=False
        )
        if workspace['thumbnail']:
            cloned['thumbnail']=workspace['thumbnail']
            
        cloned = self.repository.post(cloned, do_post=False)

        create_volume(name=self.get_pvc_name(cloned.id),
                      size=self.get_workspace_volume_size(workspace))
        clone_workspaces_content(workspace_id, cloned.id)
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
                objects = self.repository.search(
                    page=page, per_page=per_page, user_id=current_user_id, *args, **kwargs)
            else:
                objects = self.repository.search(
                    page=page, per_page=per_page, user_id=current_user_id, show_all=True, *args, **kwargs)
        else:
            objects = self.repository.search(
                page=page, per_page=per_page, *args, **kwargs)
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
                                "resource_type": ResourceType.E,
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

    def delete(self, id):
        resource_repository = WorkspaceResourceRepository()
        workspace = super().get(id)

        for resource in workspace.resources:
            logger.debug("deleting resource %s", resource.id)
            resource_repository.delete(resource.id)
        logger.info("deleting workspace %s", id)
        super().delete(id)
        logger.info("deleted workspace %s", id)
        logger.info("deleting volume %s", id)
        delete_persistent_volume_claim(f"workspace-{id}")
        logger.info("deleted volume %s", id)

        folder = os.path.join(Config.WORKSPACES_DIR, f"{id}")
        if os.path.exists(os.path.join(Config.STATIC_DIR, folder)):
            logger.info("deleting workspace files")
            shutil.rmtree(os.path.join(Config.STATIC_DIR, folder))
            logger.info("deleted workspace files")

class OsbrepositoryService(BaseModelService):
    repository = OSBRepositoryRepository()
    calculated_fields = {"user", "content_types_list"}
    

    @send_event(message_type="osbrepository", operation="create")
    def post(self, body):
        osbrepository = OSBRepository.from_dict(body) # Validate
        if 'user_id' not in body:
            body['user_id'] = keycloak_user_id()

        self.map_entity(body)
        return super().post(body)

    def put(self, body, id_):
        osbrepository = OSBRepository.from_dict(body) # Validate

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
        return (get_auth_client().user_has_realm_role(user_id=current_user_id, role="administrator"))


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
        workspace_resource: WorkspaceResourceEntity = super().get(id_)
        workspace_resource = workspace_resource.to_dict()
        if len(workspace_resource) > 2:
            workspace_resource.update(
                {"origin": json.loads(workspace_resource.get("origin"))})
        return WorkspaceResource.from_dict(workspace_resource)

    def delete(self, id_):
        workspace_resource = self.get(id_)
        super().delete(id_)
        from workspaces.helpers.etl_helpers import delete_workspace_resource
        delete_workspace_resource(workspace_resource)

class TagService(BaseModelService):
    repository = TagRepository()

    def is_authorized(self, tag):
        # All tags are public
        return True
