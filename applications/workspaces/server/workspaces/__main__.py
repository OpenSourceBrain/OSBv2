#!/usr/bin/env python3

import atexit
import os
from pathlib import Path

import cloudharness
import connexion
from cloudharness.utils.server import init_flask, main
from flask import request, send_from_directory
from flask.logging import default_handler
from flask_cors import CORS

from workspaces.config import Config
from workspaces.database import setup_db
from workspaces.controllers.events import start_kafka_consumers, stop_kafka_consumers

logger = cloudharness.log

skip_dependencies = os.getenv("WORKFLOWS_SKIP_DEPENDENCIES", False)
skip_event_dependencies = os.getenv("EVENTS_SKIP_DEPENDENCIES", False)

cloudharness.set_debug() # Remove when not needed

def mkdirs():
    Path(os.path.join(Config.STATIC_DIR, Config.WORKSPACES_DIR)).mkdir(parents=True, exist_ok=True)


def setup_static_router(app):
    # set the static folder root to the www folder
    app.static_folder = Config.STATIC_DIR
    # remove the static route (if exists)
    app.url_map._rules_by_endpoint["static"] = []
    # add / as static route
    app.add_url_rule(f"/<path:filename>", view_func=app.send_static_file)

def init_app(app):
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

    if not skip_dependencies:
        if app.config["ENV"] != "development":
            cloudharness.init(Config.APP_NAME)
        try:
            setup_db(app)
        except Exception as e:
            logger.error("Could not init database. Some application functionality won't be available.", exc_info=True)

        if not skip_event_dependencies:
            
            try:
                atexit.register(stop_kafka_consumers)
                start_kafka_consumers()
            except Exception as e:
                logger.error(
                    "Could not start kafka consumers. Some application functionality won't be available.", exc_info=True
                )
    mkdirs()
    setup_static_router(app) 
    app.template_folder = Config.TEMPLATE_DIR


app = init_flask(
    title="Workspace Manager API",
    webapp=False,
    init_app_fn=init_app,
    resolver=connexion.resolver.MethodViewResolver("workspaces.controllers.crud"),
    config=Config,
)



if __name__ == "__main__":
    cloudharness.set_debug()
    main()
