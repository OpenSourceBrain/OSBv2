# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from accounts_api.models.group import Group  # noqa: E501
from accounts_api.models.user import User  # noqa: E501
from accounts_api.test import BaseTestCase


class TestGroupsController(BaseTestCase):
    """GroupsController integration test stubs"""

    def test_get_group(self):
        """Test case for get_group

        
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/groups/{groupname}'.format(groupname='groupname_example'),
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_group_users(self):
        """Test case for get_group_users

        
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/groups/{groupname}/users'.format(groupname='groupname_example'),
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_group(self):
        """Test case for update_group

        
        """
        request_body = None
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/groups/{groupname}'.format(groupname='groupname_example'),
            method='PUT',
            headers=headers,
            data=json.dumps(request_body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
