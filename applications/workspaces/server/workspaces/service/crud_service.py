from functools import cache
import json
import os
import shutil
from typing import List

from cloudharness.service.pvc import create_persistent_volume_claim, delete_persistent_volume_claim
from cloudharness import log
from flask_sqlalchemy import Pagination
from workspaces.models import ResourceStatus
from workspaces.models.base_model_ import Model

from cloudharness import log as logger
from cloudharness.events.decorators import send_event
import cloudharness.workflows.argo as argo
from workspaces.config import Config


from workspaces.models import OSBRepository, Workspace, WorkspaceResource, ResourceOrigin, ResourceType, User, WorkspaceEntity

from workspaces.persistence import (
    OSBRepositoryRepository,
    VolumeStorageRepository,
    WorkspaceRepository,
    WorkspaceResourceRepository,
    TagRepository,
)
from workspaces.persistence.base_crud_persistence import BaseModelRepository
from workspaces.persistence.models import OSBRepositoryEntity, TOSBRepositoryEntity, TWorkspaceEntity, TWorkspaceResourceEntity, WorkspaceResourceEntity
from workspaces.service import osbrepository as osbrepository_helper
from workspaces.service.kubernetes import create_volume
from workspaces.service.auth import get_auth_client, keycloak_user_id
from workspaces.service.user_quota_service import get_pvc_size, get_max_workspaces_for_user

from workspaces.utils import dao_entity2dict, guess_resource_type
from ..database import db


def rm_null_values(dikt):
    tmp = {}
    for k, v in dikt.items():  # remove null fields from dict
        if v is not None:
            tmp.update({k: v})
    return tmp


class NotAuthorized(Exception):
    pass


class NotFoundException(Exception):
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
            return User(id="0")


class BaseModelService:
    """
    Generic base model service class
    """

    repository: BaseModelRepository = None
    user_service = UserService()

    model: Model = None

    calculated_fields = set()

    @classmethod
    def _calculated_fields_populate(cls, obj):
        if cls.calculated_fields:
            for fld in cls.calculated_fields:
                setattr(obj, fld, getattr(cls, fld)(obj))
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

        objects.items = [self.to_dto(obj) for obj in objects.items]
        return objects

    @classmethod
    def to_dao(cls, d: dict):
        d = rm_null_values(d)
        return cls.repository.model.from_dict(**d)

    @classmethod
    def to_dto(cls, dao) -> Model:
        return cls._calculated_fields_populate(cls.dict_to_dto(dao_entity2dict(dao)))

    @classmethod
    def dict_to_dto(cls, d) -> Model:
        if cls.model:
            return cls.model.from_dict(d)
        return d

    def post(self, body):
        """Save an object to the repository."""

        dao = self.to_dao(body)
        return self.to_dto(self.repository.post(dao))

    def get(self, id_):
        """Get an object from the repository."""
        res = self.repository.get(id_)
        if not self.is_authorized(res):
            raise NotAuthorized()
        return self.to_dto(res)

    def put(self, body, id_):
        """Update an object in the repository."""
        dao = self.to_dao(body)
        return self.to_dto(self.repository.put(dao, id_))

    def delete(self, id_):
        """Delete an object from the repository."""
        return self.repository.delete(id_)

    def __str__(self):
        return str(self.repository)

    def is_authorized(self, object):
        raise NotImplementedError(
            f"Authorization not implemented for {self.__class__.__name__}")

    @classmethod
    @cache
    def get_user_cached(cls, user_id):
        return cls.user_service.get(user_id)


class WorkspaceService(BaseModelService):
    repository = WorkspaceRepository()
    resource_repository = WorkspaceResourceRepository()

    model = Workspace

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
            max_num_ws_current_user = get_max_workspaces_for_user(user_id)
            if num_ws_current_user >= max_num_ws_current_user:
                raise NotAllowed(
                    f"Max number of {max_num_ws_current_user} workspaces "
                    "limit exceeded"
                )

    @staticmethod
    def get_workspace_workflows(ws_id) -> List[argo.Workflow]:
        try:
            return [w for w in argo.get_workflows(status="Running", limit=9999).items
                    if w.status == "Running" and w.raw.spec.templates[0].metadata.labels.get(
                "workspace"
            ).strip() == str(ws_id)]
        except AttributeError:
            return []

    @send_event(message_type="workspace", operation="create")
    def post(self, body):
        if 'user_id' not in body:
            body['user_id'] = keycloak_user_id()
        self.check_max_num_workspaces_per_user(body['user_id'])

        workspace = super().post(body)

        create_volume(name=self.get_pvc_name(workspace.id),
                      size=self.get_workspace_volume_size(workspace))

        for workspace_resource in workspace.resources:
            WorkspaceresourceService.handle_resource_data(workspace_resource)

        return workspace

    def put(self, body, id_):
        workspace = Workspace.from_dict(body)  # Validate
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
        with db.session.no_autoflush:
            workspace: TWorkspaceEntity = self.repository.clone(workspace_id)
            if workspace is None:
                raise NotFoundException(
                    f"Cannot clone workspace with id {workspace_id}: not found.")

            workspace.name = f"Clone of {workspace.name}"
            workspace.user_id = user_id
            workspace.publicable = False
            workspace.featured = False
            workspace.timestamp_created = None
            workspace.resources = []

            cloned = self.repository.post(workspace)

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
                paged_results = self.repository.search(
                    page=page, per_page=per_page, user_id=current_user_id, *args, **kwargs)
            else:
                paged_results = self.repository.search(
                    page=page, per_page=per_page, user_id=current_user_id, show_all=True, *args, **kwargs)
        else:
            paged_results = self.repository.search(
                page=page, per_page=per_page, *args, **kwargs)
        with db.session.no_autoflush:
            paged_results.items = [self.to_dto(w) for w in paged_results.items]
        return paged_results

    @classmethod
    def to_dto(cls, workspace_entity: TWorkspaceEntity) -> Workspace:

        workspace = super().to_dto(workspace_entity)
          

        workspace.resources = [WorkspaceresourceService.to_dto(
            r) for r in workspace_entity.resources] if workspace_entity.resources else []
        return workspace

    @classmethod
    def to_dao(cls, d: dict) -> TWorkspaceEntity:

        resources = d.get("resources", [])
        d["resources"] = []
        workspace: TWorkspaceEntity = super().to_dao(d)
        workspace.tags = TagRepository().get_tags_daos(workspace.tags)
        workspace.resources = [
            WorkspaceresourceService.to_dao(r) for r in resources]
        return workspace

    def get(self, id_):

        workspace: Workspace = super().get(id_)
        if not self.is_authorized(workspace):
            raise NotAuthorized()

        if any(wr.status == ResourceStatus.P for wr in workspace.resources):
            fake_path = f"Importing resources"
            workspace.resources.append(
                WorkspaceResource.from_dict(
                    {
                        "id": -1,
                        "name": "Importing resources into workspace",
                        "origin": {"path": fake_path},
                        "resource_type": ResourceType.U,
                        "workspace_id": workspace.id,
                    }
                ))
        else:
            # check if there are running import tasks
            logger.debug(
                "Post get, check workflows for workspace %s....", workspace.id)
            try:
                for workflow in self.get_workspace_workflows(workspace.id):
                    try:
                        fake_path = f"Importing resources, progress {workflow.raw.status.progress}".replace(
                                        "/", " of ")
                        workspace.resources.append(
                            WorkspaceResource.from_dict(
                                            {
                                                "id": -1,
                                                "name": "Refreshing resources",
                                                "origin": {"path": fake_path},
                                                "resource_type": ResourceType.U,
                                                "workspace_id": workspace.id,
                                            }
                                        )
                                    )

                    except Exception as e:
                            logger.exception("Error checking workflow for workspace %s: %s",
                                             workspace.id, workflow.name)
                            from pprint import pprint
                            # pprint(workflow.raw)
                            # probably not a workspace import workflow job --> skip it
                            pass
            except Exception as e:
                logger.exception("Error checking workflows for workspace %s: %s",
                                 workspace.id, e)

        return workspace

    @classmethod
    def user(cls, workspace):
        return cls.get_user_cached(workspace.user_id)

    def delete(self, id):
        resource_repository = WorkspaceResourceRepository()
        workspace = self.repository.get(id)

        if workspace.resources:
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

    model = OSBRepository

    @send_event(message_type="osbrepository", operation="create")
    def post(self, body):
        osbrepository = OSBRepository.from_dict(body)  # Validate
        if 'user_id' not in body:
            body['user_id'] = keycloak_user_id()

        return super().post(body)

    def put(self, body, id_):
        osbrepository = OSBRepository.from_dict(body)  # Validate

        return super().put(body, id_)

    @classmethod
    def to_dao(cls, body: dict) -> TOSBRepositoryEntity:
        content_types = ""
        # convert the content types list to a content type comma separated string
        for ct in body["content_types_list"]:
            content_types += f",{ct}"
        body.update({"content_types": content_types.strip(",")})
        for del_attr in body.keys() & ['description', 'content_types_list']:
            del body[del_attr]

        osbrepository: TOSBRepositoryEntity = super().to_dao(body)
        osbrepository.tags = TagRepository().get_tags_daos(osbrepository.tags)
        return osbrepository

    def is_authorized(self, repository):
        # All osbrepositories are public
        return True

    @classmethod
    def content_types_list(cls, osb_repository):
        return osb_repository.content_types.split(",")

    @classmethod
    def user(cls, osbrepo):
        return cls.get_user_cached(osbrepo.user_id)


class VolumestorageService(BaseModelService):
    repository = VolumeStorageRepository()

    def is_authorized(self, volume_storage):
        current_user_id = keycloak_user_id()
        return (get_auth_client().user_has_realm_role(user_id=current_user_id, role="administrator"))


class WorkspaceresourceService(BaseModelService):
    repository = WorkspaceResourceRepository()
    workspace_service = WorkspaceService()

    model = WorkspaceResource

    @classmethod
    def to_dao(cls, ws_dict: dict) -> TWorkspaceResourceEntity:
        if "origin" in ws_dict:
            wro_dao_dict = dict(ws_dict.get("origin"))
            ws_dict.update({"origin": json.dumps(wro_dao_dict)})
        if 'folder' in ws_dict: # path is folder in the db for legacy reasons
            ws_dict['folder'] = ws_dict['path']
            del ws_dict['path']
        workspace_resource: TWorkspaceResourceEntity = super().to_dao(ws_dict)
        if not workspace_resource.resource_type or workspace_resource.resource_type == "u":
            origin = json.loads(workspace_resource.origin)
            workspace_resource.resource_type = guess_resource_type(
                origin.get("path"))
        if workspace_resource.folder is None or len(workspace_resource.folder) == 0:
            workspace_resource.folder = workspace_resource.name
        return workspace_resource

    @classmethod
    def to_dto(cls, resource) -> Model:
        resource_dict = dao_entity2dict(resource)
        if hasattr(resource, "origin") and resource.origin:
            resource_dict['origin'] = json.loads(resource.origin)
        if 'folder' in resource_dict and resource_dict['folder']:  # Legacy folder/path handling
            
            # Legacy folder/path handling
            if resource_dict['origin'].get("folder", None) is not None:
                resource_dict['origin']["path"] = resource_dict['origin'].get("folder")
                del resource_dict['origin']["folder"]
        dto = cls._calculated_fields_populate(cls.dict_to_dto(resource_dict))
        if hasattr(resource, "folder"):
            dto.path = resource.folder
        return dto

    @classmethod
    def dict_to_dto(cls, d) -> WorkspaceResource:

        workspace_resource: WorkspaceResource = super().dict_to_dto(d)


        # Legacy folder/path handling
        if workspace_resource.path is None:
            
            logger.debug(
                f"Pre Commit for workspace resource id: {workspace_resource.id} setting folder from file name")
            workspace_resource.path = workspace_resource.name

        if guess_resource_type(workspace_resource.path) is None and workspace_resource.origin is not None:
            workspace_resource.path = os.path.join(workspace_resource.path, os.path.basename(
                workspace_resource.origin.path.split("?")[0]))
        return workspace_resource

    def post(self, body) -> WorkspaceResource:

        workspace_resource = super().post(body)
        self.handle_resource_data(workspace_resource)
        return workspace_resource

    @staticmethod
    def handle_resource_data(workspace_resource: WorkspaceResource) -> WorkspaceResource:
        if workspace_resource.status == "p" and workspace_resource.origin:
            from workspaces.helpers.etl_helpers import copy_workspace_resource
            copy_workspace_resource(workspace_resource)

    def is_authorized(self, resource: WorkspaceResourceEntity):
        # A resource is authorized if belongs to an authorized workspace
        try:
            self.workspace_service.get(resource.workspace_id)
        except NotAuthorized:
            return False
        return True

    def get(self, id_):
        workspace_resource: WorkspaceResourceEntity = super().get(id_)
        return workspace_resource

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
