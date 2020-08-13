# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from volumemanager.models.persistent_volume_claim import PersistentVolumeClaim  # noqa: E501
from volumemanager.models.persistent_volume_claim_create import PersistentVolumeClaimCreate  # noqa: E501
from volumemanager.test import BaseTestCase


class TestRestController(BaseTestCase):
    """RestController integration test stubs"""

    def test_pvc_name_get(self):
        """Test case for pvc_name_get

        Used to retrieve a Persistent Volume Claim from the Kubernetes repository.
        """
        headers = { 
            'Accept': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/pvc/{name}'.format(name='name_example'),
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_pvc_post(self):
        """Test case for pvc_post

        Used to create a Persistent Volume Claim in Kubernetes
        """
        persistent_volume_claim_create = {
  "size" : "2Gi (see also https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities)",
  "name" : "workspace-1"
}
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/pvc',
            method='POST',
            headers=headers,
            data=json.dumps(persistent_volume_claim_create),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
