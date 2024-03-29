"""
    Workspaces manager API

    Opensource Brain Platform - Reference Workspaces manager API  # noqa: E501

    The version of the OpenAPI document: 0.2.0
    Generated by: https://openapi-generator.tech
"""


import sys
import unittest

import workspaces_cli
from workspaces_cli.model.volume_storage import VolumeStorage
from workspaces_cli.model.workspace_base import WorkspaceBase
from workspaces_cli.model.workspace_collaborator import WorkspaceCollaborator
from workspaces_cli.model.workspace_entity_all_of import WorkspaceEntityAllOf
from workspaces_cli.model.workspace_resource_entity import WorkspaceResourceEntity
globals()['VolumeStorage'] = VolumeStorage
globals()['WorkspaceBase'] = WorkspaceBase
globals()['WorkspaceCollaborator'] = WorkspaceCollaborator
globals()['WorkspaceEntityAllOf'] = WorkspaceEntityAllOf
globals()['WorkspaceResourceEntity'] = WorkspaceResourceEntity
from workspaces_cli.model.workspace_entity import WorkspaceEntity


class TestWorkspaceEntity(unittest.TestCase):
    """WorkspaceEntity unit test stubs"""

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def testWorkspaceEntity(self):
        """Test WorkspaceEntity"""
        # FIXME: construct object with mandatory attributes with example values
        # model = WorkspaceEntity()  # noqa: E501
        pass


if __name__ == '__main__':
    unittest.main()
