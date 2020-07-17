import logging
import random

from ..config import Config
from .database import db

from open_alchemy.models import User, Workspace, WorkspaceResource, VolumeStorage
from sqlalchemy.sql import func

logger = logging.getLogger(Config.APP_NAME)


def insert_base_fixtures(app):
    logger.info(' * Inserting base fixtures...')


def generate_fake(app):
    logger.info(
        ' * Creating new fake test data. Please wait, this can take a while....')

    # some random fake data to fill the database
    for i in range(1, 15):
        user = User(firstname=f'User {i}',
                    lastname=f'Lastname {i}',
                    keycloak_id=f'{i}',
                    )
        db.session.add(user)
        db.session.commit()

    for i in range(1, 25):
        workspace = Workspace(name=f'Workspace {i}',
                              description=f'Workspace description {i}',
                              keycloakuser_id=random.randint(1, 10),
                              publicable=random.randint(0, 1),
                              timestamp_created=func.now(),
                              timestamp_updated=func.now()
                              )

        for j in range(random.randint(1, 5), random.randint(5, 10)):
            collab = User.query.filter_by(id=j).first()
            workspace.collaborators.append(collab)

        for j in range(1, random.randint(1, 10)):
            wsresource = WorkspaceResource(name=f'Workspace resource {j}',
                                           resource_type='e')
            workspace.resources.append(wsresource)

        wsstorage = VolumeStorage(name=f'Storage WS {i}')
        workspace.storage = wsstorage

        db.session.add(workspace)
        db.session.commit()


def create_fixtures(app):
    workspace = Workspace.query.first()
    if not workspace:
        insert_base_fixtures(app)
        if app.config['ENV'] == 'development':
            logger.info(" * " + "*"*70)
            logger.info(" * *")
            logger.info(
                f" * * for development purpose you may want to drop schema public cascade; and create schema public; in psql")
            logger.info(
                " * * and restart the application to generate a random dataset")
            logger.info(" * *")
            logger.info(" * " + "*"*70)

            generate_fake(app)
