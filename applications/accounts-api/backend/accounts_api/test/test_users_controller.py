# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from accounts_api.models.user import User  # noqa: E501
from accounts_api.test import BaseTestCase


class TestUsersController(BaseTestCase):
    """UsersController integration test stubs"""

    def test_create_user(self):
        """Test case for create_user

        
        """
        user = {
  "firstName" : "firstName",
  "lastName" : "lastName",
  "image" : "image",
  "profiles" : [ null, null ],
  "registrationDate" : "2000-01-23",
  "groups" : [ "groups", "groups" ],
  "id" : "id",
  "email" : "email",
  "username" : "username"
}
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/users',
            method='POST',
            headers=headers,
            data=json.dumps(user),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_user(self):
        """Test case for get_user

        
        """
        headers = { 
            'Accept': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/users/{id}'.format(UNKNOWN_PARAMETER_NAME={}),
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_user(self):
        """Test case for update_user

        
        """
        user = {
  "firstName" : "firstName",
  "lastName" : "lastName",
  "image" : "image",
  "profiles" : [ null, null ],
  "registrationDate" : "2000-01-23",
  "groups" : [ "groups", "groups" ],
  "id" : "id",
  "email" : "email",
  "username" : "username"
}
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            '/api/users/{id}'.format(UNKNOWN_PARAMETER_NAME={}),
            method='PUT',
            headers=headers,
            data=json.dumps(user),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
