# coding: utf-8

import sys
from setuptools import setup, find_packages

NAME = "workspaces"
VERSION = "0.7.0"

# To install the library, run the following
#
# python setup.py install
#
# prerequisite: setuptools
# http://pypi.python.org/pypi/setuptools

REQUIRES = [
    "connexion[swagger-ui]==2.14.2",
    "swagger-ui-bundle>=0.0.2",
    "python_dateutil>=2.6.0",
    "Flask-SQLAlchemy>3.0.0",
    "SQLAlchemy>=2.0.0",
    "OpenAlchemy>2.0.0",
    "psycopg2-binary",
    "cloudharness",
    "flask_cors",
    "Flask>=2.2.5",
    "sentry-sdk",
    "jinja2>3.1.0"
]

setup(
    name=NAME,
    version=VERSION,
    description="Workspace Manager API",
    url="",
    keywords=["OpenAPI", "Workspace Manager API"],
    install_requires=REQUIRES,
    packages=find_packages(),
    package_data={'': ['openapi/openapi.yaml']},
    include_package_data=True,
    entry_points={
        'console_scripts': ['wsmgr_api=wsmgr_api.__main__:main']},
    long_description="""\
    Opensource Brain Platform - Reference Workspace Manager API
    """
)
