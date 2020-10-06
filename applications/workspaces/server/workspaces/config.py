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
    #SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
    #                          'sqlite:///' + os.path.join(basedir, DATABASE_NAME+'.db')
    SQLALCHEMY_DATABASE_URI = 'postgresql://workspace:secret@workspaces-postgres-host:5432/workspaces'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    BASE_DIR = os.path.dirname(__file__)
    STATIC_DIR = os.path.join(BASE_DIR, "static")
    TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")
    WORKSPACES_DIR = "workspaces"
    OPENAPI_DIR = os.path.join(BASE_DIR, "openapi")
    OPENAPI_FILE = "openapi.yaml"
    LOG_LEVEL = logging.INFO
    APP_NAME = "workspaces"
    WSMGR_HOSTNAME = socket.gethostname()
    WSMGR_IPADDRESS = socket.gethostbyname(WSMGR_HOSTNAME)

    CH_NAMESPACE = conf.get_configuration()['namespace']

    DEBUG = False

    # Keycloak
    SECURITY_CONFIG_FILE_NAME = 'client_secrets.json'
