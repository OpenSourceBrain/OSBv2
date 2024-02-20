"""
Configuration settings
"""
import logging
import os
import socket

from cloudharness.utils.config import CloudharnessConfig as conf

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    # ...
    DATABASE_NAME = "wsmgr"

    SQLALCHEMY_DATABASE_URI = "postgresql://workspace:secret@workspaces-postgres-host:5432/workspaces"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    BASE_DIR = os.path.dirname(__file__)
    STATIC_DIR = os.path.join(BASE_DIR, "static")
    TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")
    WORKSPACES_DIR = "workspaces"
    REPOSITORY_DIR = "repositories"
    OPENAPI_DIR = os.path.join(BASE_DIR, "openapi")
    OPENAPI_FILE = "openapi.yaml"
    LOG_LEVEL = logging.DEBUG
    APP_NAME = "workspaces"
    WSMGR_HOSTNAME = socket.gethostname()
    WSMGR_IPADDRESS = socket.gethostbyname(WSMGR_HOSTNAME)
    # set the max number of workspaces per user
    MAX_NUMBER_WORKSPACES_PER_USER = 3

    try:
        CH_NAMESPACE = conf.get_configuration()["namespace"]
    except:
        logging.warning("Cannot get cluster deployment configuration: assuming local deployment", exc_info=True)
        SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, DATABASE_NAME + ".db")
        CH_NAMESPACE = "osb"

    DEBUG = False

    # Keycloak
    SECURITY_CONFIG_FILE_NAME = "client_secrets.json"
