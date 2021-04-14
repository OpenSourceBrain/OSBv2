import json
from workspaces.repository.model_repository import WorkspaceRepository, WorkspaceResourceRepository
from workspaces.repository.models import WorkspaceResource
from workspaces.models import WorkspaceResource as WorkspaceResourceDTO
from workspaces.views.api.rest_api_views import WorkspaceresourceView


def open(id_=None, **kwargs):
    # upate last open timestamp
    wsrr = WorkspaceResourceRepository()
    workspace_resource = wsrr.get(id=id_)
    if workspace_resource is None:
        return f"WorkspaceResource with id {id_} not found.", 404

    return wsrr.open(workspace_resource)


def post(body):
    # make origin a json string
    body.update({
        "origin": json.dumps(body.get("origin", None))
    })
    return WorkspaceresourceView().post(body)
