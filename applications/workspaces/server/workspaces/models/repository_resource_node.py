# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from workspaces.models.base_model_ import Model
from workspaces.models.repository_resource import RepositoryResource
from workspaces import util

from workspaces.models.repository_resource import RepositoryResource  # noqa: E501

class RepositoryResourceNode(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, resource=None, children=None):  # noqa: E501
        """RepositoryResourceNode - a model defined in OpenAPI

        :param resource: The resource of this RepositoryResourceNode.  # noqa: E501
        :type resource: RepositoryResource
        :param children: The children of this RepositoryResourceNode.  # noqa: E501
        :type children: List[RepositoryResourceNode]
        """
        self.openapi_types = {
            'resource': RepositoryResource,
            'children': List[RepositoryResourceNode]
        }

        self.attribute_map = {
            'resource': 'resource',
            'children': 'children'
        }

        self._resource = resource
        self._children = children

    @classmethod
    def from_dict(cls, dikt) -> 'RepositoryResourceNode':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The RepositoryResourceNode of this RepositoryResourceNode.  # noqa: E501
        :rtype: RepositoryResourceNode
        """
        return util.deserialize_model(dikt, cls)

    @property
    def resource(self):
        """Gets the resource of this RepositoryResourceNode.


        :return: The resource of this RepositoryResourceNode.
        :rtype: RepositoryResource
        """
        return self._resource

    @resource.setter
    def resource(self, resource):
        """Sets the resource of this RepositoryResourceNode.


        :param resource: The resource of this RepositoryResourceNode.
        :type resource: RepositoryResource
        """

        self._resource = resource

    @property
    def children(self):
        """Gets the children of this RepositoryResourceNode.


        :return: The children of this RepositoryResourceNode.
        :rtype: List[RepositoryResourceNode]
        """
        return self._children

    @children.setter
    def children(self, children):
        """Sets the children of this RepositoryResourceNode.


        :param children: The children of this RepositoryResourceNode.
        :type children: List[RepositoryResourceNode]
        """

        self._children = children
