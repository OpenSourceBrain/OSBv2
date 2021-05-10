import json
from sqlalchemy import asc, desc
from sqlalchemy.sql import func

from cloudharness import log as logger
from cloudharness.service import pvc
from workspaces import repository


from .base_model_repository import BaseModelRepository
from .database import db
from .models import WorkspaceEntity, VolumeStorage, WorkspaceImage, WorkspaceResourceEntity, OSBRepositoryEntity
from .utils import *

from workspaces.service.etlservice import copy_workspace_resource, delete_workspace_resource
from workspaces.auth import auth_client
from workspaces.utils import get_keycloak_data
from workspaces.service.kubernetes import create_persistent_volume_claim

from workspaces.models import RepositoryContentType, User


repository_content_type_enum = get_class_attr_val(RepositoryContentType())


class OwnerModel:
    @property
    def keycloak_user_id(self):
        try:
            return auth_client.get_current_user().get("id", None)
        except Exception as e:
            return None

    def pre_commit(self, obj):
        logger.debug(f"Pre Commit for {obj} id: {obj.id}")
        if not obj.user_id:
            obj.user_id = self.keycloak_user_id
        return obj


class WorkspaceRepository(BaseModelRepository, OwnerModel):
    model = WorkspaceEntity
    defaults = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def get_pvc_name(self, workspace_id):
        return f"workspace-{workspace_id}"

    def get(self, id):
        workspace = self.model.query.get(id)
        if workspace and (workspace.publicable or (workspace.user_id and workspace.user_id == self.keycloak_user_id)):
            return workspace
        return None

    def search_qs(self, filter=None, q=None):

        q_base = self.model.query
        logger.debug(f"filter: {filter}")

        keycloak_user_id = self.keycloak_user_id
        if filter is not None:
            q_base = q_base.filter(*[self._create_filter(*f) for f in filter])
        if filter and any(field for field, condition, value in filter if field.key == "publicable" and value):
            q1 = q_base
        elif keycloak_user_id is not None:
            if not auth_client.user_has_realm_role(user_id=keycloak_user_id, role="administrator"):
                logger.debug("searching workspaces on keycloak_user_id: %s", keycloak_user_id)
                # non admin users can see only their own workspaces
                q1 = q_base.filter_by(user_id=keycloak_user_id)
                q1 = q1.union(q_base.filter(WorkspaceEntity.collaborators.any(user_id=keycloak_user_id)))
            else:
                q1 = q_base
        else:
            q1 = q_base.filter_by(publicable=True)
        logger.debug(str(q1))
        return q1.order_by(desc(WorkspaceEntity.timestamp_updated))

    def delete(self, id):
        resource_repository = WorkspaceResourceRepository()
        workspace = self.model.query.filter_by(id=id).first()

        for resource in workspace.resources:
            logger.debug("deleting resource %s", resource.id)
            resource_repository.delete(resource.id)
        logger.info("deleting workspace %s", id)
        super().delete(id)
        logger.info("deleted workspace %s", id)
        logger.info("deleting volume %s", id)
        pvc.delete_persistent_volume_claim(f"workspace-{id}")
        logger.info("deleted volume %s", id)

    def pre_commit(self, workspace):
        return super().pre_commit(workspace)

    def post_commit(self, workspace):
        # Create a new Persistent Volume Claim for this workspace
        logger.debug(f"Post Commit for workspace id: {workspace.id}")
        create_persistent_volume_claim(name=self.get_pvc_name(workspace.id), size="2Gi", logger=logger)
        wsrr = WorkspaceResourceRepository()
        for workspace_resource in workspace.resources:
            wsr = wsrr.post_commit(workspace_resource)
            if wsr:
                db.session.add(wsr)
                db.session.commit()
        return workspace


class OSBRepositoryRepository(BaseModelRepository, OwnerModel):
    model = OSBRepositoryEntity
    calculated_fields = ["user", "content_types_list"]

    def pre_commit(self, osbrepository):
        return super().pre_commit(osbrepository)

    def user(self, repository):
        try:
            user = auth_client.get_user(repository.user_id)
            return User(
                id=user.get("id", ""),
                first_name=user.get("firstName", ""),
                last_name=user.get("lastName", ""),
                username=user.get("username", ""),
                email=user.get("email", ""),
            )
        except Exception as e:
            return User()

    def content_types_list(self, repository):
        return repository.content_types.split(",")


class VolumeStorageRepository(BaseModelRepository):
    model = VolumeStorage


class VolumeStorageRepository(BaseModelRepository):
    model = VolumeStorage


class WorkspaceImageRepository(BaseModelRepository):
    model = WorkspaceImage


class WorkspaceResourceRepository(BaseModelRepository):
    model = WorkspaceResourceEntity

    @staticmethod
    def guess_resource_type(resource_path):
        resource_path = resource_path.split("?")[0]
        if resource_path[-3:] == "nwb":
            return "e"
        elif resource_path[-3:] == "np":
            return "g"
        return "g"

    def pre_commit(self, workspace_resource):
        # Check if we can determine the resource type
        logger.debug(f"Pre Commit for workspace resource id: {workspace_resource.id}")

        if not workspace_resource.resource_type or workspace_resource.resource_type == "u":
            origin = json.loads(workspace_resource.origin)
            workspace_resource.resource_type = self.guess_resource_type(origin.get("path"))
        if workspace_resource.folder is None or len(workspace_resource.folder) == 0:
            workspace_resource.folder = workspace_resource.name
        return workspace_resource

    def post_commit(self, workspace_resource):
        # Create a load WorkspaceResource workflow task
        logger.debug(f"Post Commit for workspace resource id: {workspace_resource.id}")
        workspace = WorkspaceRepository().get(id=workspace_resource.workspace_id)
        if workspace_resource.folder is None:
            logger.debug(f"Pre Commit for workspace resource id: {workspace_resource.id} setting folder from file name")
            workspace_resource.folder = workspace_resource.name

        if (
            workspace is not None
            and workspace_resource.status == "p"
            and workspace_resource.origin
            and len(workspace_resource.origin) > 0
        ):
            copy_workspace_resource(workspace_resource)
        return workspace_resource

    def post_get(self, workspace_resource):
        workspace = WorkspaceRepository().get(id=workspace_resource.workspace_id)

        return workspace_resource

    def open(self, workspace_resource):
        # test if workspace resource status is "available"
        if workspace_resource.status != "a":
            return (
                f"WorkspaceResource with id {workspace_resource.id} is not yet available for opening. Please wait until the status is a(vailable)",
                422,
            )

        workspace_resource.timestamp_last_opened = func.now()
        workspace = WorkspaceRepository().get(id=workspace_resource.workspace_id)
        if workspace is not None:
            workspace.last_opened_resource_id = workspace_resource.id
        db.session.add(workspace_resource)
        db.session.add(workspace)
        db.session.commit()

        return "Saved", 200

    def delete(self, id):
        """Delete an object from the repository."""
        workspace_resource = self.get(id)
        super().delete(id)

        delete_workspace_resource(workspace_resource)
