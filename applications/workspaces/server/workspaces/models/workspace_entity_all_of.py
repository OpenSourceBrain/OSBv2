# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from workspaces.models.base_model_ import Model
from workspaces.models.workspace_resource_entity import WorkspaceResourceEntity
from workspaces import util

from workspaces.models.workspace_resource_entity import WorkspaceResourceEntity  # noqa: E501

class WorkspaceEntityAllOf(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, resources=None):  # noqa: E501
        """WorkspaceEntityAllOf - a model defined in OpenAPI

        :param resources: The resources of this WorkspaceEntityAllOf.  # noqa: E501
        :type resources: List[WorkspaceResourceEntity]
        """
        self.openapi_types = {
            'resources': List[WorkspaceResourceEntity]
        }

        self.attribute_map = {
            'resources': 'resources'
        }

        self._resources = resources

    @classmethod
    def from_dict(cls, dikt) -> 'WorkspaceEntityAllOf':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The WorkspaceEntity_allOf of this WorkspaceEntityAllOf.  # noqa: E501
        :rtype: WorkspaceEntityAllOf
        """
        return util.deserialize_model(dikt, cls)

    @property
    def resources(self):
        """Gets the resources of this WorkspaceEntityAllOf.

        Resources of the workspace  # noqa: E501

        :return: The resources of this WorkspaceEntityAllOf.
        :rtype: List[WorkspaceResourceEntity]
        """
        return self._resources

    @resources.setter
    def resources(self, resources):
        """Sets the resources of this WorkspaceEntityAllOf.

        Resources of the workspace  # noqa: E501

        :param resources: The resources of this WorkspaceEntityAllOf.
        :type resources: List[WorkspaceResourceEntity]
        """

        self._resources = resources
