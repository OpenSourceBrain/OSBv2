# coding: utf-8

import sys
from setuptools import setup, find_packages

NAME = "wsmgr_api"
VERSION = "1.0.0"

# To install the library, run the following
#
# python setup.py install
#
# prerequisite: setuptools
# http://pypi.python.org/pypi/setuptools

REQUIRES = [
    "connexion>=2.0.2",
    "swagger-ui-bundle>=0.0.2",
    "python_dateutil>=2.6.0"
]

setup(
    name=NAME,
    version=VERSION,
    description="Workspace Manager API",
    author_email="mnp@metacell.us",
    url="",
    keywords=["OpenAPI", "Workspace Manager API"],
    install_requires=REQUIRES,
    packages=find_packages(),
    package_data={'': ['openapi/openapi.yaml']},
    include_package_data=True,
    entry_points={
        'console_scripts': ['wsmgr_api=wsmgr_api.__main__:main']},
    long_description="""\
    MetaCell Cloudharness Platform - Reference Workspace Manager API
    """
)

