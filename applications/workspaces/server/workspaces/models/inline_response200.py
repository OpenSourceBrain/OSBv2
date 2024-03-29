# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from workspaces.models.base_model_ import Model
from workspaces.models.pagination import Pagination
from workspaces.models.workspace import Workspace
from workspaces import util

from workspaces.models.pagination import Pagination  # noqa: E501
from workspaces.models.workspace import Workspace  # noqa: E501

class InlineResponse200(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, pagination=None, workspaces=None):  # noqa: E501
        """InlineResponse200 - a model defined in OpenAPI

        :param pagination: The pagination of this InlineResponse200.  # noqa: E501
        :type pagination: Pagination
        :param workspaces: The workspaces of this InlineResponse200.  # noqa: E501
        :type workspaces: List[Workspace]
        """
        self.openapi_types = {
            'pagination': Pagination,
            'workspaces': List[Workspace]
        }

        self.attribute_map = {
            'pagination': 'pagination',
            'workspaces': 'workspaces'
        }

        self._pagination = pagination
        self._workspaces = workspaces

    @classmethod
    def from_dict(cls, dikt) -> 'InlineResponse200':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The inline_response_200 of this InlineResponse200.  # noqa: E501
        :rtype: InlineResponse200
        """
        return util.deserialize_model(dikt, cls)

    @property
    def pagination(self):
        """Gets the pagination of this InlineResponse200.


        :return: The pagination of this InlineResponse200.
        :rtype: Pagination
        """
        return self._pagination

    @pagination.setter
    def pagination(self, pagination):
        """Sets the pagination of this InlineResponse200.


        :param pagination: The pagination of this InlineResponse200.
        :type pagination: Pagination
        """

        self._pagination = pagination

    @property
    def workspaces(self):
        """Gets the workspaces of this InlineResponse200.


        :return: The workspaces of this InlineResponse200.
        :rtype: List[Workspace]
        """
        return self._workspaces

    @workspaces.setter
    def workspaces(self, workspaces):
        """Sets the workspaces of this InlineResponse200.


        :param workspaces: The workspaces of this InlineResponse200.
        :type workspaces: List[Workspace]
        """

        self._workspaces = workspaces
