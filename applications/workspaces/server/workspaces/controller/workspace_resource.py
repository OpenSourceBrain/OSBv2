from flask import current_app
from sqlalchemy.sql import func
from ..repository.model_repository import WorkspaceRepository, WorkspaceResourceRepository
from ..repository.database import db
from ..repository.models import WorkspaceResource

def open(id=None, **kwargs):
    # upate last open timestamp
    wsrr = WorkspaceResourceRepository()
    workspace_resource, found = wsrr.get(id=id)
    if not found:
        return f"WorkspaceResource with id {id} not found.", 404

    return wsrr.open(workspace_resource)
