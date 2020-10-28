import logging
import os

from ..config import Config
from ..repository.model_repository import WorkspaceRepository

logger = logging.getLogger(Config.APP_NAME)

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

    download_task = tasks.CustomTask(name='osb-download-file',
                                     image_name='workflows-extract-download',
                                     url=workspace_resource.location,
                                     shared_directory=shared_directory,
                                     folder=workspace_resource.folder)

    op = operations.PipelineOperation(basename=f'osb-download-file-job',
                                      tasks=(download_task,),
                                      shared_directory=shared_directory,
                                      folder=workspace_resource.folder,
                                      shared_volume_size=100,
                                      on_exit_notify={'queue':'osb-download-file-queue','payload':str(workspace_resource.id)}
                                     )
    workflow = op.execute()
