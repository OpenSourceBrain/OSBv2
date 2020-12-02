import logging

from flask import request, current_app
from sqlalchemy import desc
from sqlalchemy.sql import func

from ..config import Config
from ..utils import get_keycloak_data

from .base_model_repository import BaseModelRepository
from .database import db
from .models import Workspace, User, OSBRepository, GITRepository, FigshareRepository, VolumeStorage, \
    WorkspaceImage, WorkspaceResource
from ..service.kubernetes import create_persistent_volume_claim

logger = logging.getLogger(Config.APP_NAME)


class WorkspaceRepository(BaseModelRepository):
    model = Workspace
    defaults = {}

    def get_pvc_name(self, workspace):
        return f'workspace-{workspace.id}'

    def search_qs(self, filter=None):

        q_base = self.model.query
        if filter is not None:
            q_base = q_base.filter(*[self._create_filter(*f) for f in filter])
        logger.info(f"searching workspaces on keycloak_id: {self.keycloak_id}")
        if filter and any(field for field, condition, value  in filter if field.key == 'publicable' and value):
            q1 = q_base
        elif self.keycloak_id != -1:
            owner = User.query.filter_by(keycloak_id=self.keycloak_id).first()
            if owner:
                owner_id = owner.id
            else:
                # logged in but not known as owner so return no workspaces
                owner_id = 0
            q1 = q_base.filter_by(keycloakuser_id=owner_id)
            q1 = q1.union(q_base.filter(Workspace.collaborators.any(keycloak_id=self.keycloak_id)))
            q1 = q1.union(q_base.filter_by(publicable=True))
        else:
            q1 = q_base.filter_by(publicable=True)
        return q1.order_by(desc(Workspace.timestamp_updated))

    def delete(self, id):
        resource_repository = WorkspaceResourceRepository()
        workspace = self.model.query.filter_by(id=id).first()

        for resource in workspace.resources:
            logger.info("deleting resource %s", resource.id)
            resource_repository.delete(resource.id)
        logger.info("deleting workspace %s", id)
        super().delete(id)

    def __getattribute__(self, name):
        if name == "keycloak_id":
            keycloak_id, keycloak_data = get_keycloak_data()
            return keycloak_id
        return object.__getattribute__(self, name)

    def pre_commit(self, workspace):
        logger.debug(f'Pre Commit for workspace id: {workspace.id}')
        if not workspace.id:
            # in case of a new workspace assign the logged in user as owner
            keycloak_id, keycloak_data = get_keycloak_data()
            usr_firstname = keycloak_data.get('given_name', '')
            usr_lastname = keycloak_data.get('family_name', '')
            usr_email = keycloak_data.get('email', '')

            owner = User.query.filter_by(keycloak_id=keycloak_id).first()
            if not owner:
                owner = User(firstname=usr_firstname,
                             lastname=usr_lastname,
                             keycloak_id=keycloak_id,
                             email=usr_email
                             )
            workspace.owner = owner
        return workspace

    def post_commit(self, workspace):
        # Create a new Persistent Volume Claim for this workspace
        logger.debug(f'Post Commit for workspace id: {workspace.id}')
        create_persistent_volume_claim(name=self.get_pvc_name(workspace), size='2Gi', logger=logger)
        wsrr = WorkspaceResourceRepository()
        for workspace_resource in workspace.resources:
            wsrr.post_commit(workspace_resource)
        return workspace


class OSBRepositoryRepository(BaseModelRepository):
    model = OSBRepository


class GITRepositoryRepository(BaseModelRepository):
    model = GITRepository


class FigshareRepositoryRepository(BaseModelRepository):
    model = FigshareRepository


class VolumeStorageRepository(BaseModelRepository):
    model = VolumeStorage


class WorkspaceImageRepository(BaseModelRepository):
    model = WorkspaceImage


class WorkspaceResourceRepository(BaseModelRepository):
    model = WorkspaceResource

    def pre_commit(self, workspace_resource):
        # Check if we can determine the resource type
        logger.debug(f'Pre Commit for workspace resource id: {workspace_resource.id}')
        if workspace_resource.location[-3:] == "nwb":
            logger.debug(f'Pre Commit for workspace resource id: {workspace_resource.id} setting type to e')
            workspace_resource.resource_type = "e"
        if workspace_resource.folder is None or len(workspace_resource.folder) == 0:
            workspace_resource.folder = workspace_resource.name
        return workspace_resource

    def post_commit(self, workspace_resource):
        # Create a load WorkspaceResource workflow task
        logger.debug(f'Post Commit for workspace resource id: {workspace_resource.id}')
        workspace, found = WorkspaceRepository().get(id=workspace_resource.workspace_id)
        if workspace_resource.folder is None or len(workspace_resource.folder) == 0:
            workspace_resource.folder = workspace_resource.name
        if found:
            from ..service.workflow import create_operation
            create_operation(workspace, workspace_resource)
        return workspace_resource

    def post_get(self, workspace_resource):
        workspace, found = WorkspaceRepository().get(id=workspace_resource.workspace_id)
        if not found:
            # workspace not found means no access rights to the workspace so fail with resource not found
            return workspace_resource, False
        return workspace_resource, True

    def open(self, workspace_resource):
        # test if workspace resource status is "available"
        if workspace_resource.status != "a":
            return f"WorkspaceResource with id {workspace_resource.id} is not yet available for opening. Please wait until the status is a(vailable)", 422

        workspace_resource.timestamp_last_opened = func.now()
        workspace, found = WorkspaceRepository().get(id=workspace_resource.workspace_id)
        if found:
            workspace.last_opened_resource_id = workspace_resource.id
        db.session.add(workspace_resource)
        db.session.add(workspace)
        db.session.commit()

        return "Saved", 200
