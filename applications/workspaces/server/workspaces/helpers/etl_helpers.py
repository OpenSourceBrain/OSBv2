import json
import posixpath
from typing import List

from cloudharness import log as logger
from workspaces.models.resource_origin import ResourceOrigin
from workspaces.models.workspace_resource import WorkspaceResource

from workspaces.service.crud_service import WorkspaceService
import workspaces.service.osbrepository as osbrepository_service
import workspaces.service.workflow as workflow
from workspaces.models.resource_status import ResourceStatus


def copy_origins(workspace_id, origins: List[ResourceOrigin], folder: str = ""):
    """Copies the origins onto the workspace volume. Download origins go into `folder` (relative to
    the volume root; the volume root when empty), where a zip is also unpacked."""
    tasks = []
    
    osbrepository_id = origins[0].osbrepository_id if origins else None
    
        
    if osbrepository_id:
            # osb repository origin
            
        task = osbrepository_service.create_copy_task(
                workspace_id=workspace_id,
                osbrepository_id=osbrepository_id,
                origins=origins,
        )
        if type(task) is list:
            tasks.extend(task)
        else:
            tasks.append(task)
    else:
        for origin in origins:
            # download origin
            tasks.append(
                workflow.create_copy_task(
                    workspace_id=workspace_id,
                    folder=folder,
                    path=origin.path,
                )
            )
    workflow.run_copy_tasks(workspace_id, tasks)


def copy_workspace_resource(workspace_resource: WorkspaceResource):
    if workspace_resource.status == ResourceStatus.P and workspace_resource.origin:
        
        workspace_resource.origin.name = workspace_resource.origin.name or workspace_resource.name,
        copy_origins(workspace_resource.workspace_id, (workspace_resource.origin,),
                     folder=resource_folder(workspace_resource.path))


def resource_folder(path) -> str:
    """Get the folder of the resource's `path` on the volume"""
    folder = posixpath.dirname(path or "")
    if not folder or folder.startswith("/") or ".." in folder.split("/"):
        return ""
    return posixpath.normpath(folder)


def delete_workspace_resource(workspace_resource: WorkspaceResource):
    try:
        pvc_name = WorkspaceService.get_pvc_name(
            workspace_resource.workspace_id)
 
        workflow.delete_resource(
            workspace_resource=workspace_resource, pvc_name=pvc_name, resource_path=workspace_resource.path
        )
    except Exception as e:
        logger.error(
            "An error occurred while deleting resource from the workspace", exc_info=True)
        return None
    return True
