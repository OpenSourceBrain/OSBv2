"""
    Workspaces manager API

    Opensource Brain Platform - Reference Workspaces manager API  # noqa: E501

    The version of the OpenAPI document: 0.2.0
    Generated by: https://openapi-generator.tech
"""


import sys
import unittest

import workspaces_cli
from workspaces_cli.model.user import User
from workspaces_cli.model.volume_storage import VolumeStorage
from workspaces_cli.model.workspace_all_of import WorkspaceAllOf
from workspaces_cli.model.workspace_base import WorkspaceBase
from workspaces_cli.model.workspace_collaborator import WorkspaceCollaborator
from workspaces_cli.model.workspace_resource import WorkspaceResource
globals()['User'] = User
globals()['VolumeStorage'] = VolumeStorage
globals()['WorkspaceAllOf'] = WorkspaceAllOf
globals()['WorkspaceBase'] = WorkspaceBase
globals()['WorkspaceCollaborator'] = WorkspaceCollaborator
globals()['WorkspaceResource'] = WorkspaceResource
from workspaces_cli.model.workspace import Workspace


class TestWorkspace(unittest.TestCase):
    """Workspace unit test stubs"""

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def testWorkspace(self):
        """Test Workspace"""
        # FIXME: construct object with mandatory attributes with example values
        # model = Workspace()  # noqa: E501
        pass


if __name__ == '__main__':
    unittest.main()
