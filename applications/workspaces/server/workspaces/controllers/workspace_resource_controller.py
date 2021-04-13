import json
from workspaces.repository.model_repository import WorkspaceRepository, WorkspaceResourceRepository
from workspaces.repository.models import WorkspaceResource
from workspaces.models import WorkspaceResource as WorkspaceResourceDTO


def open(id_=None, **kwargs):
    # upate last open timestamp
    wsrr = WorkspaceResourceRepository()
    workspace_resource = wsrr.get(id=id_)
    if workspace_resource is None:
        return f"WorkspaceResource with id {id_} not found.", 404

    return wsrr.open(workspace_resource)

def post(body):
    wsr = WorkspaceResourceDTO(**body)
    origin = json.dumps(body.get("origin", None))
    wsr.origin = origin
    wsr = wsr.to_dict()
    WorkspaceResourceRepository().post(wsr)
