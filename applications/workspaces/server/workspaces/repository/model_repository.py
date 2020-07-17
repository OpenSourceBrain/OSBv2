import logging

from flask import request, current_app
from sqlalchemy import desc

from ..utils import get_keycloak_data

from ..config import Config

from .base_model_repository import BaseModelRepository
from .database import db
from .models import Workspace, User, OSBRepository, GITRepository, FigshareRepository, VolumeStorage,\
     WorkspaceHasType, WorkspaceImage


logger = logging.getLogger(Config.APP_NAME)

class WorkspaceRepository(BaseModelRepository):
    model = Workspace
    defaults = {}

    def search_qs(self,filter=None):
        q_base = self.model.query
        if filter is not None:
            q_base = q_base.filter(*filter)
        logger.info(f"keycloak_id: {self.keycloak_id}")
        if self.keycloak_id != -1:
            owner = User.query.filter_by(keycloak_id=self.keycloak_id).first()
            if owner:
                owner_id = owner.id
            else:
                # logged in but not known as owner so return no workspaces
                owner_id = 0
            q1 = q_base.filter_by(keycloakuser_id=owner_id)
            q1 = q1.union(q_base.filter(Workspace.collaborators.any(keycloak_id=self.keycloak_id)))
        else:
            q1 = q_base.filter_by(publicable=True)
        return q1.order_by(desc(Workspace.timestamp_updated))

    def __getattribute__(self, name):
        if name == "keycloak_id":
            keycloak_id, keycloak_data = get_keycloak_data()
            return keycloak_id
        return object.__getattribute__(self, name)

    def pre_commit(self, workspace):
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


class OSBRepositoryRepository(BaseModelRepository):
    model = OSBRepository


class GITRepositoryRepository(BaseModelRepository):
    model = GITRepository


class FigshareRepositoryRepository(BaseModelRepository):
    model = FigshareRepository


class VolumeStorageRepository(BaseModelRepository):
    model = VolumeStorage


class WorkspaceHasTypeRepository(BaseModelRepository):
    model = WorkspaceHasType

class WorkspaceImageRepository(BaseModelRepository):
    model = WorkspaceImage
