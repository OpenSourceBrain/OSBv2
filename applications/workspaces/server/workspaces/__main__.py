#!/usr/bin/env python3

import connexion
import logging
import os

from pathlib import Path

from flask import send_from_directory, request
from flask_cors import CORS

import cloudharness

from .config import Config
from .repository.database import db, setup_db

logger = logging.getLogger(Config.APP_NAME)


def setup_logging():
    logger.setLevel(logging.INFO)
    ch = logging.StreamHandler()
    ch.setLevel(Config.LOG_LEVEL)
    ch.setFormatter(logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
    logger.addHandler(ch)
    logger.info("setting up logging, done.")


def mkdirs():
    Path(os.path.join(Config.STATIC_DIR,Config.WORKSPACES_DIR)).mkdir(parents=True, exist_ok=True)


def setup_static_router():
    # set the static folder root to the www folder
    app.static_folder = Config.STATIC_DIR
    # remove the static route (if exists)
    app.url_map._rules_by_endpoint['static'] = []
    # add / as static route
    app.add_url_rule(f'/<path:filename>',
                     endpoint='static',
                     view_func=app.send_static_file)


connexion_app = connexion.App(Config.APP_NAME, specification_dir=Config.OPENAPI_DIR)
app = connexion_app.app
app.config.from_object(Config)
setup_static_router()
mkdirs()
db.init_app(app)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

with app.app_context():
    if app.config['ENV'] != 'development':
        cloudharness.init(Config.APP_NAME)
    setup_logging()
    setup_db(app)
    connexion_app.add_api(Config.OPENAPI_FILE,
                          arguments={'title': 'Workspace Manager API'},
                          resolver=connexion.resolver.MethodViewResolver(__package__+'.views.api'))


@app.route('/', defaults={'file': 'index.html'})
def index(file):
    return send_from_directory(app.static_folder, file)


if __name__ == "__main__":
    connexion_app.run(port=8080)
