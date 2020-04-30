"""
Configuration settings
"""
import logging
import os
import socket

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    # ...
    DATABASE_NAME = "wsmgr"
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
                              'sqlite:///' + os.path.join(basedir, DATABASE_NAME+'.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_ECHO = True
    BASE_DIR = os.path.dirname(__file__)
    WWW_DIR = os.path.join(BASE_DIR, "www")
    IMG_DIR = os.path.join(WWW_DIR, "images")
    OPENAPI_DIR = os.path.join(BASE_DIR, "openapi")
    OPENAPI_FILE = "openapi.yaml"
    LOG_LEVEL = logging.INFO
    LOG_NAME = "workspace-manager"
    WSMGR_HOSTNAME = socket.gethostname()
    WSMGR_IPADDRESS = socket.gethostbyname(WSMGR_HOSTNAME)

    DEBUG = False

    # Keycloak
    SECURITY_CONFIG_FILE_NAME = 'client_secrets.json'
