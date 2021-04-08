from cloudharness import log

from flask import current_app

from cloudharness.events.client import EventClient
from cloudharness.workflows.operations import OperationStatus
from ..config import Config

from sqlalchemy.sql import func
from ..repository.base_model_repository import BaseModelRepository
from ..repository.models import WorkspaceResource
from .. import ResourceStatus


def _create_topic(name):
    client = EventClient(name)
    try:
        client.create_topic()
    except:
        log.info(f'Queue {name} already exists!')
        pass
    return client


def set_resource_state(event_client, app, message):
    log.info(f'Got message: {message}')
    workspace_resource_id = message['payload']
    with app.app_context():
        status = message.get('status', OperationStatus.FAILED)
        workspaceResourceRepository = BaseModelRepository(WorkspaceResource)
        workspace_resource: WorkspaceResource = workspaceResourceRepository.get(
            id=workspace_resource_id)
        if status == OperationStatus.SUCCEEDED:
            workspace_resource.status = ResourceStatus.SUCCESS  # success
        else:
            log.error(
                f'WorkspaceResource {workspace_resource_id} ingestion errored.')
            workspace_resource.status = ResourceStatus.ERROR

        log.info('Updating WorkspaceResource %s', workspace_resource_id)
        workspaceResourceRepository.save(obj=workspace_resource)
        log.info(
            f'Updated WorkspaceResource status to {workspace_resource.status}')


_consumer_clients = []
_consumer_queues = (
    {'group': 'workspaces', 'name': 'osb-download-file-queue',
        'handler': set_resource_state},
)


def start_kafka_consumers():
    log.info('Starting Kafka consumer threads')
    for queue in _consumer_queues:
        client = _create_topic(queue['name'])
        client.async_consume(
            app=current_app, group_id=queue['group'], handler=queue['handler'])
        _consumer_clients.append(client)


def stop_kafka_consumers():
    log.info('Stopping Kafka consumer threads')
    for t in _consumer_clients:
        t.close()
        log.info(f'Stopped Kafka consumer thread: {t}')

def test_kafka_running():
    try:
        EventClient("mnp-workspaces-testing")._get_consumer()
    except:
        return False
    return True
