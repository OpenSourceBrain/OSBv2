# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from workspaces.models.base_model_ import Model
from workspaces.models.pagination import Pagination
from workspaces.models.tag import Tag
from workspaces import util

from workspaces.models.pagination import Pagination  # noqa: E501
from workspaces.models.tag import Tag  # noqa: E501

class TagGet200Response(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, pagination=None, tags=None):  # noqa: E501
        """TagGet200Response - a model defined in OpenAPI

        :param pagination: The pagination of this TagGet200Response.  # noqa: E501
        :type pagination: Pagination
        :param tags: The tags of this TagGet200Response.  # noqa: E501
        :type tags: List[Tag]
        """
        self.openapi_types = {
            'pagination': Pagination,
            'tags': List[Tag]
        }

        self.attribute_map = {
            'pagination': 'pagination',
            'tags': 'tags'
        }

        self._pagination = pagination
        self._tags = tags

    @classmethod
    def from_dict(cls, dikt) -> 'TagGet200Response':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The _tag_get_200_response of this TagGet200Response.  # noqa: E501
        :rtype: TagGet200Response
        """
        return util.deserialize_model(dikt, cls)

    @property
    def pagination(self):
        """Gets the pagination of this TagGet200Response.


        :return: The pagination of this TagGet200Response.
        :rtype: Pagination
        """
        return self._pagination

    @pagination.setter
    def pagination(self, pagination):
        """Sets the pagination of this TagGet200Response.


        :param pagination: The pagination of this TagGet200Response.
        :type pagination: Pagination
        """

        self._pagination = pagination

    @property
    def tags(self):
        """Gets the tags of this TagGet200Response.


        :return: The tags of this TagGet200Response.
        :rtype: List[Tag]
        """
        return self._tags

    @tags.setter
    def tags(self, tags):
        """Sets the tags of this TagGet200Response.


        :param tags: The tags of this TagGet200Response.
        :type tags: List[Tag]
        """

        self._tags = tags