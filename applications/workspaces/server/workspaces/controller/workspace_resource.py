from flask import current_app
from sqlalchemy.sql import func
from ..repository.model_repository import WorkspaceRepository, WorkspaceResourceRepository
from ..repository.database import db
from ..repository.models import WorkspaceResource

def open(id=None, **kwargs):
    # upate last open timestamp
    workspace_resource, found = WorkspaceResourceRepository().get(id=id)
    if not found:
        return f"WorkspaceResource with id {id} not found.", 404

    workspace_resource.timestamp_last_open = func.now()
    workspace, found = WorkspaceRepository().get(id=workspace_resource.workspace_id)
    if found:
        workspace.last_open = workspace_resource.id
    db.session.add(workspace_resource)
    db.session.add(workspace)
    db.session.commit()
    return "Saved", 200
