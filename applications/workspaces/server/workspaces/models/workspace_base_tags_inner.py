# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from workspaces.models.base_model_ import Model
from workspaces import util


class WorkspaceBaseTagsInner(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, id=None, tag=None):  # noqa: E501
        """WorkspaceBaseTagsInner - a model defined in OpenAPI

        :param id: The id of this WorkspaceBaseTagsInner.  # noqa: E501
        :type id: int
        :param tag: The tag of this WorkspaceBaseTagsInner.  # noqa: E501
        :type tag: str
        """
        self.openapi_types = {
            'id': int,
            'tag': str
        }

        self.attribute_map = {
            'id': 'id',
            'tag': 'tag'
        }

        self._id = id
        self._tag = tag

    @classmethod
    def from_dict(cls, dikt) -> 'WorkspaceBaseTagsInner':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The WorkspaceBase_tags_inner of this WorkspaceBaseTagsInner.  # noqa: E501
        :rtype: WorkspaceBaseTagsInner
        """
        return util.deserialize_model(dikt, cls)

    @property
    def id(self):
        """Gets the id of this WorkspaceBaseTagsInner.


        :return: The id of this WorkspaceBaseTagsInner.
        :rtype: int
        """
        return self._id

    @id.setter
    def id(self, id):
        """Sets the id of this WorkspaceBaseTagsInner.


        :param id: The id of this WorkspaceBaseTagsInner.
        :type id: int
        """

        self._id = id

    @property
    def tag(self):
        """Gets the tag of this WorkspaceBaseTagsInner.


        :return: The tag of this WorkspaceBaseTagsInner.
        :rtype: str
        """
        return self._tag

    @tag.setter
    def tag(self, tag):
        """Sets the tag of this WorkspaceBaseTagsInner.


        :param tag: The tag of this WorkspaceBaseTagsInner.
        :type tag: str
        """

        self._tag = tag