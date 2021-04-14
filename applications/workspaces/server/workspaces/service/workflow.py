from cloudharness import log as logger

try:
    from cloudharness.workflows import operations, tasks
    from cloudharness.workflows.argo import get_workflows
except Exception as e:
    logger.error("Cannot start workflows module. Probably this is related some problem with the kubectl configuration",
                 e)


def delete_resource(workspace_resource, pvc_name, resource_path: str):
    resources = {'requests': {'memory': '25Mi', 'cpu': '10m'},
                 'limits': {'memory': '512Mi', 'cpu': '100m'}}

    shared_directory = f'{pvc_name}:/project_download'

    delete_task = tasks.CommandBasedTask(name='osb-delete-resource',
                                         command=['rm', '-Rf', "project_download/" + resource_path])

    op = operations.PipelineOperation(basename='osb-delete-resource-job',
                                      tasks=(delete_task,),
                                      shared_directory=shared_directory,
                                      pod_context=operations.PodExecutionContext(
                                          'workspace', workspace_resource.workspace_id),
                                      )
    workflow = op.execute()


def download_workspace_resource(workspace_resource, pvc_name, path, folder):
    resources = {'requests': {'memory': '256Mi', 'cpu': '10m'},
                 'limits': {'memory': '512Mi', 'cpu': '100m'}}

    shared_directory = f'{pvc_name}:/project_download'

    download_task = tasks.CustomTask(name='osb-download-file',
                                     image_name='workflows-extract-download',
                                     url=path,
                                     shared_directory=shared_directory,
                                     folder=folder)

    op = operations.PipelineOperation(basename=f'osb-download-file-job',
                                      tasks=(download_task,),
                                      shared_directory=shared_directory,
                                      folder=folder,
                                      pod_context=operations.PodExecutionContext(
                                          'workspace', workspace_resource.workspace_id),
                                      on_exit_notify={'queue': "osb-download-file-queue",
                                                      'payload': workspace_resource.id}
                                      )
    workflow = op.execute()
