import logging

from flask import current_app

from cloudharness.events.client import EventClient
from cloudharness.workflows.operations import OperationStatus
from ..config import Config

from sqlalchemy.sql import func
from ..repository.base_model_repository import BaseModelRepository
from ..repository.models import WorkspaceResource
from .. import ResourceStatus


logger = logging.getLogger(Config.APP_NAME)

def _create_topic(name):
    client = EventClient(name)
    try:
        client.create_topic()
    except:
        logger.info(f'Queue {name} already exists!')
        pass
    return client

def set_resource_state(app, message):
    logger.info(f'Got message: {message}')
    workspace_resource_id = message['payload']
    with app.app_context():
        status = message.get('status', OperationStatus.FAILED)
        workspaceResourceRepository = BaseModelRepository(WorkspaceResource)
        workspace_resource, found = workspaceResourceRepository.get(id=workspace_resource_id)
        if status == OperationStatus.SUCCEEDED:
            workspace_resource.status = ResourceStatus.SUCCESS  # success
        else:
            workspace_resource.status = ResourceStatus.ERROR  # error

        logger.info('Going to update Workspace Resource')
        workspaceResourceRepository.save(obj=workspace_resource)
        logger.info(f'Updated WorkspaceResource status to {workspace_resource.status}')

_consumer_clients = []
_consumer_queues = (
    {'group':'workspaces', 'name': 'osb-download-file-queue', 'handler': set_resource_state},
)

def start_kafka_consumers():
    logger.info('Starting Kafka consumer threads')
    for queue in _consumer_queues:
        client = _create_topic(queue['name'])
        client.async_consume(app=current_app, group_id=queue['group'], handler=queue['handler'])
        _consumer_clients.append(client)

def stop_kafka_consumers():
    logger.info('Stopping Kafka consumer threads')
    for t in _consumer_clients:
        t.close()
        logger.info(f'Stopped Kafka consumer thread: {t}')
