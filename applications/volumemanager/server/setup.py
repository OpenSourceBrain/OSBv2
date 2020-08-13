# coding: utf-8

import sys
from setuptools import setup, find_packages

NAME = "volumemanager"
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
    description="Volumes manager API",
    author_email="",
    url="",
    keywords=["OpenAPI", "Volumes manager API"],
    install_requires=REQUIRES,
    packages=find_packages(),
    package_data={'': ['openapi/openapi.yaml']},
    include_package_data=True,
    entry_points={
        'console_scripts': ['volumemanager=volumemanager.__main__:main']},
    long_description="""\
    Opensource Brain Platform - Reference Volumes manager API
    """
)

