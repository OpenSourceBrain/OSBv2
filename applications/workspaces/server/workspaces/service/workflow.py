import uuid

from cloudharness import log as logger

import workspaces.persistence as repos
import workspaces.controllers.events as events
from workspaces.service.crud_service import WorkspaceService

try:
    from cloudharness.workflows import operations, tasks
    from cloudharness.workflows.argo import get_workflows
except Exception as e:
    logger.error(
        "Cannot start workflows module. Probably this is related some problem with the kubectl configuration", e
    )

ttl_strategy: dict = {
    'secondsAfterCompletion': 60 * 60,
    'secondsAfterSuccess': 60 * 20,
    'secondsAfterFailure': 60 * 60 * 24 * 7  # one week
}


def delete_resource(workspace_resource, pvc_name, resource_path: str):
    logger.info(
        f"Delete workspace resource with id: {workspace_resource.id}, path: {resource_path}")
    shared_directory = f"{pvc_name}:/project_download"

    delete_task = tasks.CommandBasedTask(
        name="osb-delete-resource", command=["rm", "-Rf", "project_download/" + resource_path]
    )
    scan_task = create_scan_task(workspace_resource.workspace_id)

    op = operations.PipelineOperation(
        basename="osb-delete-resource-job",
        tasks=(
            delete_task,
            scan_task,
        ),
        shared_directory=shared_directory,
        ttl_strategy=ttl_strategy,
        pod_context=operations.PodExecutionContext(
            "workspace", workspace_resource.workspace_id, True),
    )
    workflow = op.execute()


def run_copy_tasks(workspace_id, tasks):
    pvc_name = WorkspaceService.get_pvc_name(workspace_id)
    shared_directory = f"{pvc_name}:/project_download:rwx"
    op = operations.SimpleDagOperation(
        f"osb-copy-tasks-job",
        tasks,
        (create_scan_task(workspace_id),),
        shared_directory=shared_directory,
        ttl_strategy=ttl_strategy,
        pod_context=operations.PodExecutionContext(
            "workspace", workspace_id, required=True),
    )
    workflow = op.execute()


def create_task(image_name, workspace_id, **kwargs):
    pvc_name = WorkspaceService.get_pvc_name(workspace_id)
    shared_directory = f"{pvc_name}:/project_download:rwx"
    return tasks.CustomTask(
        name=f"{image_name}-{str(uuid.uuid4())[:8]}",
        image_name=image_name,
        shared_directory=shared_directory,
        workspace_id=workspace_id,
        **kwargs,
    )


def create_copy_task(workspace_id, folder, image_name="workflows-extract-download", **kwargs):
    if not kwargs.get("url", None):
        kwargs["url"] = kwargs["path"]
    return create_task(
        image_name=image_name, 
        workspace_id=workspace_id, 
        folder=folder or '',
        **kwargs)


def create_scan_task(workspace_id, **kwargs):
    return create_task(
        image_name="workspaces-scan-workspace",
        workspace_id=workspace_id,
        queue=events.UPDATE_WORKSPACES_RESOURCE_QUEUE,
        **kwargs,
    )

def clone_workspaces_content(source_ws_id, dest_ws_id):
    source_pvc_name = WorkspaceService.get_pvc_name(source_ws_id)
    dest_pvc_name = WorkspaceService.get_pvc_name(dest_ws_id)
    source_volume = f"{source_pvc_name}:/source"
    dest_volume = f"{dest_pvc_name}:/project_download:rwx"

    copy_task = tasks.BashTask(
        name=f"clone-workspace-data",
        source="sleep 1 && cp -R /source/* /project_download && chown -R 1000:1000 /project_download"
    )

    scan_task = create_scan_task(dest_ws_id)

    op = operations.PipelineOperation(
        basename="osb-clone-workspace-job",
        tasks=(
            copy_task,
            scan_task,
        ),
        ttl_strategy=ttl_strategy,
        pod_context=operations.PodExecutionContext(
            "workspace", dest_ws_id, True),
    )
    op.volumes=(source_volume, dest_volume)
    workflow = op.execute()