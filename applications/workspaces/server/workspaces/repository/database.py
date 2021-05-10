"""Setup for the repository."""

from cloudharness import log
import os

from flask_sqlalchemy import SQLAlchemy
from ..config import Config
from open_alchemy import init_yaml


# Construct models
db = SQLAlchemy()
SPEC_FILE = os.path.join(Config.OPENAPI_DIR, Config.OPENAPI_FILE)
MODELS_FILENAME = os.path.join(Config.BASE_DIR, "repository", "models.py")
init_yaml(SPEC_FILE, base=db.Model, models_filename=MODELS_FILENAME)


def setup_db(app):
    db.init_app(app)
    db.create_all()
    from .fixtures import create_fixtures

    create_fixtures(app)
