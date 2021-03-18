import logging
import os

from ..config import Config
from ..repository.model_repository import WorkspaceRepository
from ..repository.models import TWorkspace
logger = logging.getLogger(Config.APP_NAME)

try:
    from cloudharness.workflows import operations, tasks
    from cloudharness.workflows.argo import get_workflows
except Exception as e:
    logger.error("Cannot start workflows module. Probably this is related some problem with the kubectl configuration",
                 e)


def delete_resource(workspace_id, resource_path: str):
    resources = {'requests': {'memory': '25Mi', 'cpu': '10m'},
                 'limits': {'memory': '512Mi', 'cpu': '100m'}}

    workspace_pvc_name = WorkspaceRepository().get_pvc_name(workspace_id)
    shared_directory = f'{workspace_pvc_name}:/project_download'

    delete_task = tasks.CommandBasedTask(name='osb-delete-resource',
                                         command=['rm', '-Rf', "project_download/" + resource_path])

    op = operations.PipelineOperation(basename='osb-delete-resource-job',
                                      tasks=(delete_task,),
                                      shared_directory=shared_directory,
                                      pod_context=operations.PodExecutionContext(
                                          'workspace', workspace_id),
                                      )
    workflow = op.execute()


def add_resource(workspace: TWorkspace, workspace_resource):
    resources = {'requests': {'memory': '256Mi', 'cpu': '10m'},
                 'limits': {'memory': '512Mi', 'cpu': '100m'}}

    workspace_pvc_name = WorkspaceRepository().get_pvc_name(workspace.id)
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
                                      pod_context=operations.PodExecutionContext(
                                          'workspace', workspace.id),
                                      on_exit_notify={'queue': 'osb-download-file-queue',
                                                      'payload': str(workspace_resource.id)}
                                      )
    workflow = op.execute()
