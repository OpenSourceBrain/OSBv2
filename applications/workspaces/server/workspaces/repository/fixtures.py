from cloudharness import log as logger
from sqlalchemy.sql import func

from ..database import db


def insert_base_fixtures(app):
    pass


def create_fixtures(app):
    if app.config["ENV"] == "development":
        logger.info(" * " + "*" * 70)
        logger.info(" * *")
        logger.info(
            f" * * for development purpose you may want to drop schema public cascade; and create schema public; in psql"
        )
        logger.info(" * * and restart the application to generate a random dataset")
        logger.info(" * *")
        logger.info(" * " + "*" * 70)
