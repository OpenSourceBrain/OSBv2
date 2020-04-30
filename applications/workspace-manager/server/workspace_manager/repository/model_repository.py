from flask import request

from .base_model_repository import BaseModelRepository
from .database import db
from .models import Workspace, User, OSBRepository, GITRepository, FigshareRepository, VolumeStorage

class WorkspaceRepository(BaseModelRepository):
    model = Workspace
    defaults = {}
    search_qs = "self.model.query.order_by(desc(Workspace.id))"

    def pre_commit(self, workspace):
        if not workspace.id:
            # in case of a new workspace assign the logged in user as owner
            usr_id = request.headers.get('X-Auth-Userid', -1)
            usr_firstname = request.headers.get('X-Auth-FirstName', '')
            usr_lastname = request.headers.get('X-Auth-LastName', '')
            usr_email = request.headers.get('X-Auth-Email', '')

            owner = User.query.filter_by(keycloak_id=usr_id).first()
            if not owner:
                owner = User(firstname=usr_firstname,
                             lastname=usr_lastname,
                             keycloak_id=usr_id,
                             email=usr_email
                             )
            workspace.owner = owner

class OSBRepositoryRepository(BaseModelRepository):
    model = OSBRepository

class GITRepositoryRepository(BaseModelRepository):
    model = GITRepository

class FigshareRepositoryRepository(BaseModelRepository):
    model = FigshareRepository

class VolumeStorageRepository(BaseModelRepository):
    model = VolumeStorage
