import logging
import os

logger = logging.getLogger(__name__)

from ..repository.model_repository import WorkspaceRepository

try:
    from cloudharness.workflows import operations, tasks
    from cloudharness.workflows.argo import get_workflows
except Exception as e:
    logger.error("Cannot start workflows module. Probably this is related some problem with the kubectl configuration",
                 e)


def create_operation(workspace, workspace_resource):
    resources = {'requests': {'memory': '256Mi', 'cpu': '250m'}, 'limits': {'memory': '2048Mi', 'cpu': '2500m'}}

    workspace_pvc_name = WorkspaceRepository().get_pvc_name(workspace)
    shared_directory = f'{workspace_pvc_name}:/project_download'

    download_task = tasks.CustomTask(name='download-file',
                                     image_name='workflows-extract-download',
                                     url=workspace_resource.location,
                                     shared_directory=shared_directory)

    op = operations.PipelineOperation(basename=f'download-file-job-',
                                      tasks=(download_task,),
                                      shared_directory=shared_directory,
                                      shared_volume_size=100)
    workflow = op.execute()
