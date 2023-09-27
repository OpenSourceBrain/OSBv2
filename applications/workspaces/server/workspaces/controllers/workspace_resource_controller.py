from workspaces.persistence.crud_persistence import WorkspaceResourceRepository



def open(id_=None, **kwargs):
    # upate last open timestamp
    wsrr = WorkspaceResourceRepository()
    workspace_resource = wsrr.get(id=id_)
    if workspace_resource is None:
        return f"WorkspaceResource with id {id_} not found.", 404

    return wsrr.open(workspace_resource)
