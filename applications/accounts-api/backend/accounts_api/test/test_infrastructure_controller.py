# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from accounts_api.test import BaseTestCase


class TestInfrastructureController(BaseTestCase):
    """InfrastructureController integration test stubs"""

    def test_live(self):
        """Test case for live

        Test if application is healthy
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/live',
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_ready(self):
        """Test case for ready

        Test if application is ready to take requests
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/ready',
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
