import json

from cloudharness import log as logger

from workspaces.service.model_service import WorkspaceService

import workspaces.service.osbrepository as osbrepository_service
import workspaces.service.workflow as workflow
from workspaces.models.resource_status import ResourceStatus


def copy_origins(workspace_id, origins):
    tasks = []
    for origin in origins:
        osbrepository_id = origin.get("osbrepository_id")
        if osbrepository_id:
            # osb repository origin
            
            task = osbrepository_service.create_copy_task(
                workspace_id=workspace_id,
                osbrepository_id=osbrepository_id,
                name=origin.get("name"),
                path=origin.get("path"),
            )
            if type(task) is list:
                tasks.extend(task)
            else:
                tasks.append(task)
        else:
            # download origin
            tasks.append(
                workflow.create_copy_task(
                    workspace_id=workspace_id,
                    name=origin.get("name"),
                    folder=origin.get("folder"),
                    path=origin.get("path"),
                )
            )
    workflow.run_copy_tasks(workspace_id, tasks)


def copy_workspace_resource(workspace_resource):
    if workspace_resource.status == ResourceStatus.P and workspace_resource.origin and len(workspace_resource.origin) > 0:
        origin = json.loads(workspace_resource.origin)
        origin.update({"name": workspace_resource.name,
                       "folder": workspace_resource.folder})
        copy_origins(workspace_resource.workspace_id, (origin,))


def delete_workspace_resource(workspace_resource):
    try:
        pvc_name = WorkspaceService.get_pvc_name(
            workspace_resource.workspace_id)
        workflow.delete_resource(
            workspace_resource=workspace_resource, pvc_name=pvc_name, resource_path=workspace_resource.folder
        )
    except Exception as e:
        logger.error(
            "An error occurred while deleting resource from the workspace", exc_info=True)
        return None
    return True
