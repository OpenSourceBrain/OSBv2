import json
import workspaces.repository as repos
import workspaces.service.workflow as workflow

from cloudharness import log as logger
from workspaces.service.osbrepository.osbrepository import copy_resource


def copy_workspace_resource(workspace_resource):
    if workspace_resource.status == 'p' and workspace_resource.origin and len(workspace_resource.origin)>0:
        origin = json.loads(workspace_resource.origin)

        osbrepository_id = origin.get("osbrepository_id", None)
        if osbrepository_id:
            # repository resource based workspace resource
            return copy_resource(workspace_resource)
        else:
            # download the resource
            return download_workspace_resource(workspace_resource)
    return workspace_resource


def download_workspace_resource(workspace_resource):
    try:
        origin = json.loads(workspace_resource.origin)
        path = origin.get("path", "")
        logger.debug('Starting resource ETL from %s', path)
        pvc_name = repos.WorkspaceRepository().get_pvc_name(workspace_resource.workspace_id)
        workflow.download_workspace_resource(
            workspace_resource=workspace_resource,
            pvc_name=pvc_name,
            path=path,
            folder=workspace_resource.folder)
    except Exception as e:
        logger.error(
            "An error occurred while adding the default resource to the workspace", exc_info=True)
        return workspace_resource
    return workspace_resource


def delete_workspace_resource(workspace_resource):
    try:
        pvc_name = repos.WorkspaceRepository().get_pvc_name(workspace_resource.workspace_id)
        workflow.delete_resource(
            workspace_resource=workspace_resource,
            pvc_name=pvc_name,
            resource_path=workspace_resource.folder)
    except Exception as e:
        logger.error(
            "An error occurred while deleting resource from the workspace", exc_info=True)
        return None
    return True