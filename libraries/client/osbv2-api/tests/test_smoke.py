"""Smoke tests for package imports."""

import osbv2_api
from osbv2_api import workspaces


def test_package_imports():
    """The top-level package and compatibility package import successfully."""
    assert osbv2_api is not None
    assert workspaces is not None
