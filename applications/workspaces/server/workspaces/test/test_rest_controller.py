# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from workspaces.models.inline_object import InlineObject  # noqa: E501
from workspaces.models.inline_response200 import InlineResponse200  # noqa: E501
from workspaces.models.inline_response2001 import InlineResponse2001  # noqa: E501
from workspaces.models.inline_response2002 import InlineResponse2002  # noqa: E501
from workspaces.models.inline_response2003 import InlineResponse2003  # noqa: E501
from workspaces.models.osb_repository import OSBRepository  # noqa: E501
from workspaces.models.repository_type import RepositoryType  # noqa: E501
from workspaces.models.tag import Tag  # noqa: E501
from workspaces.models.volume_storage import VolumeStorage  # noqa: E501
from workspaces.models.workspace import Workspace  # noqa: E501
from workspaces.models.workspace_resource import WorkspaceResource  # noqa: E501
from workspaces.test import BaseTestCase


class TestRestController(BaseTestCase):
    """RestController integration test stubs"""

    def test_delimage(self):
        """Test case for delimage

        Delete a Workspace Image from the workspace.
        """
        headers = { 
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/workspace/{id}/gallery/{image_id}'.format(id=56, image_id=56),
            method='DELETE',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_contexts(self):
        """Test case for get_contexts

        Used to retrieve a list of contexts of a repository.
        """
        query_string = [('uri', 'uri_example'),
                        ('repository_type', workspaces.RepositoryType())]
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/osbrepository/context',
            method='GET',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_osbrepository_get(self):
        """Test case for osbrepository_get

        Used to list all available repositories.
        """
        query_string = [('page', 1),
                        ('per_page', 20),
                        ('q', 'name=myrepo+summary__like=%reposi%'),
                        ('tags', 'tag1+tag2'),
                        ('types', 'experimental+modeling')]
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/osbrepository',
            method='GET',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_osbrepository_id_delete(self):
        """Test case for osbrepository_id_delete

        Delete a OSBRepository.
        """
        query_string = [('context', 'context_example')]
        headers = { 
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/osbrepository/{id}'.format(id=56),
            method='DELETE',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_osbrepository_id_get(self):
        """Test case for osbrepository_id_get

        Used to retrieve a repository.
        """
        query_string = [('context', 'context_example')]
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/osbrepository/{id}'.format(id=56),
            method='GET',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_osbrepository_id_put(self):
        """Test case for osbrepository_id_put

        Update a OSB repository.
        """
        osb_repository = null
        query_string = [('context', 'context_example')]
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/osbrepository/{id}'.format(id=56),
            method='PUT',
            headers=headers,
            data=json.dumps(osb_repository),
            content_type='application/json',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_osbrepository_post(self):
        """Test case for osbrepository_post

        Used to save a OSB Repository. The user_id (keycloak user id) will be automatically filled with the current user
        """
        osb_repository = null
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/osbrepository',
            method='POST',
            headers=headers,
            data=json.dumps(osb_repository),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_tag_get(self):
        """Test case for tag_get

        Used to list all available tags.
        """
        query_string = [('page', 1),
                        ('per_page', 20),
                        ('q', 'name__like=%Tag 1%')]
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/tag',
            method='GET',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_tag_id_delete(self):
        """Test case for tag_id_delete

        Delete an tag from the repository.
        """
        headers = { 
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/tag/{id}'.format(id=56),
            method='DELETE',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_tag_id_get(self):
        """Test case for tag_id_get

        Used to retrieve an tag from the repository.
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/tag/{id}'.format(id=56),
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_tag_id_put(self):
        """Test case for tag_id_put

        Update an tag in the repository.
        """
        tag = {
  "id" : 0,
  "tag" : "tag"
}
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/tag/{id}'.format(id=56),
            method='PUT',
            headers=headers,
            data=json.dumps(tag),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_tag_post(self):
        """Test case for tag_post

        Used to save a Tag to the repository. The user_id (keycloak user id) will be automatically filled with the current user
        """
        tag = {
  "id" : 0,
  "tag" : "tag"
}
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/tag',
            method='POST',
            headers=headers,
            data=json.dumps(tag),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_volumestorage_get(self):
        """Test case for volumestorage_get

        Used to list all available volumestorages.
        """
        query_string = [('page', 1),
                        ('per_page', 20),
                        ('q', 'name__like=%storage%')]
        headers = { 
            'Accept': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/volumestorage',
            method='GET',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_volumestorage_id_delete(self):
        """Test case for volumestorage_id_delete

        Delete an volumestorage from the repository.
        """
        headers = { 
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/volumestorage/{id}'.format(id=56),
            method='DELETE',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_volumestorage_id_get(self):
        """Test case for volumestorage_id_get

        Used to retrieve an volumestorage from the repository.
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/volumestorage/{id}'.format(id=56),
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_volumestorage_id_put(self):
        """Test case for volumestorage_id_put

        Update an volumestorage in the repository.
        """
        volume_storage = {
  "name" : "Storage Volume One",
  "id" : 0
}
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/volumestorage/{id}'.format(id=56),
            method='PUT',
            headers=headers,
            data=json.dumps(volume_storage),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_volumestorage_post(self):
        """Test case for volumestorage_post

        Used to save a VolumeStorage to the repository. The user_id (keycloak user id) will be automatically filled with the current user
        """
        volume_storage = {
  "name" : "Storage Volume One",
  "id" : 0
}
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/volumestorage',
            method='POST',
            headers=headers,
            data=json.dumps(volume_storage),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_workspace_get(self):
        """Test case for workspace_get

        Used to list all available workspaces.
        """
        query_string = [('page', 1),
                        ('per_page', 20),
                        ('q', 'name__like=Work%+id__=1+tags[tag]=Tag'),
                        ('tags', 'tag1+tag2')]
        headers = { 
            'Accept': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/workspace',
            method='GET',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_workspace_id_delete(self):
        """Test case for workspace_id_delete

        Delete a workspace from the repository.
        """
        headers = { 
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/workspace/{id}'.format(id=56),
            method='DELETE',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_workspace_id_get(self):
        """Test case for workspace_id_get

        Used to retrieve a workspace from the repository.
        """
        headers = { 
            'Accept': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/workspace/{id}'.format(id=56),
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_workspace_id_put(self):
        """Test case for workspace_id_put

        Update a workspace in the repository.
        """
        workspace = null
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/workspace/{id}'.format(id=56),
            method='PUT',
            headers=headers,
            data=json.dumps(workspace),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_workspace_post(self):
        """Test case for workspace_post

        Used to save a Workspace to the repository. The user_id (keycloak user id) will be automatically filled with the current user
        """
        workspace = null
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/workspace',
            method='POST',
            headers=headers,
            data=json.dumps(workspace),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_workspaceresource_id_delete(self):
        """Test case for workspaceresource_id_delete

        Delete a WorkspaceResource.
        """
        headers = { 
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/workspaceresource/{id}'.format(id=56),
            method='DELETE',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_workspaceresource_id_get(self):
        """Test case for workspaceresource_id_get

        Used to retrieve a WorkspaceResource.
        """
        headers = { 
            'Accept': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/workspaceresource/{id}'.format(id=56),
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_workspaceresource_id_put(self):
        """Test case for workspaceresource_id_put

        Update the WorkspaceResource.
        """
        workspace_resource = null
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/workspaceresource/{id}'.format(id=56),
            method='PUT',
            headers=headers,
            data=json.dumps(workspace_resource),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_workspaceresource_post(self):
        """Test case for workspaceresource_post

        Used to save a WorkspaceResource to the repository.
        """
        workspace_resource = null
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/workspaceresource',
            method='POST',
            headers=headers,
            data=json.dumps(workspace_resource),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    @unittest.skip("multipart/form-data not supported by Connexion")
    def test_workspaces_controllers_workspace_controller_addimage(self):
        """Test case for workspaces_controllers_workspace_controller_addimage

        Adds and image to the workspace.
        """
        headers = { 
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer special-key',
        }
        data = dict(image='/path/to/file')
        response = self.client.open(
            '/api/workspace/{id}/gallery'.format(id=56),
            method='POST',
            headers=headers,
            data=data,
            content_type='multipart/form-data')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_workspaces_controllers_workspace_controller_import_resources(self):
        """Test case for workspaces_controllers_workspace_controller_import_resources

        Imports the ResourceOrigins into the Workspace and creates/updates the workspace resources
        """
        inline_object = workspaces.InlineObject()
        headers = { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/workspace/{id}/import'.format(id=56),
            method='POST',
            headers=headers,
            data=json.dumps(inline_object),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    @unittest.skip("multipart/form-data not supported by Connexion")
    def test_workspaces_controllers_workspace_controller_setthumbnail(self):
        """Test case for workspaces_controllers_workspace_controller_setthumbnail

        Sets the thumbnail of the workspace.
        """
        headers = { 
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer special-key',
        }
        data = dict(thumb_nail='/path/to/file')
        response = self.client.open(
            '/api/workspace/{id}/thumbnail'.format(id=56),
            method='POST',
            headers=headers,
            data=data,
            content_type='multipart/form-data')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_workspaces_controllers_workspace_resource_controller_open(self):
        """Test case for workspaces_controllers_workspace_resource_controller_open

        Used to register a WorkspaceResource open action. The WorkspaceResource timestamp last open will be updated
        """
        headers = { 
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/workspaceresource/{id}/open'.format(id=56),
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
