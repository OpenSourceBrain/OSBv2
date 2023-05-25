import json

from workspaces.models import WorkspaceResource as WorkspaceResourceDTO
from workspaces.persistence.model_persistence import WorkspaceRepository, WorkspaceResourceRepository
from workspaces.views.api.rest_api_views import WorkspaceresourceView


def open(id_=None, **kwargs):
    # upate last open timestamp
    wsrr = WorkspaceResourceRepository()
    workspace_resource = wsrr.get(id=id_)
    if workspace_resource is None:
        return f"WorkspaceResource with id {id_} not found.", 404

    return wsrr.open(workspace_resource)
