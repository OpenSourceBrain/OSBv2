import connexion
import six

from workspaces.models.inline_object import InlineObject  # noqa: E501
from workspaces.models.inline_response200 import InlineResponse200  # noqa: E501
from workspaces.models.inline_response2001 import InlineResponse2001  # noqa: E501
from workspaces.models.inline_response2002 import InlineResponse2002  # noqa: E501
from workspaces.models.inline_response2003 import InlineResponse2003  # noqa: E501
from workspaces.models.osb_repository import OSBRepository  # noqa: E501
from workspaces.models.repository_info import RepositoryInfo  # noqa: E501
from workspaces.models.repository_type import RepositoryType  # noqa: E501
from workspaces.models.tag import Tag  # noqa: E501
from workspaces.models.volume_storage import VolumeStorage  # noqa: E501
from workspaces.models.workspace import Workspace  # noqa: E501
from workspaces.models.workspace_resource import WorkspaceResource  # noqa: E501
from workspaces import util


def delimage(id, image_id):  # noqa: E501
    """Delete a Workspace Image from the workspace.

     # noqa: E501

    :param id: Workspace ID of the workspace
    :type id: int
    :param image_id: Workspace Image Id to be deleted from the workspace
    :type image_id: int

    :rtype: None
    """
    return 'do some magic!'


def get_description(uri, repository_type, context):  # noqa: E501
    """Used to retrieve description for a repository.

     # noqa: E501

    :param uri: 
    :type uri: str
    :param repository_type: 
    :type repository_type: dict | bytes
    :param context: 
    :type context: str

    :rtype: str
    """
    if connexion.request.is_json:
        repository_type =  RepositoryType.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def get_info(uri, repository_type):  # noqa: E501
    """Used to retrieve a list of contexts of a repository.

     # noqa: E501

    :param uri: 
    :type uri: str
    :param repository_type: 
    :type repository_type: dict | bytes

    :rtype: RepositoryInfo
    """
    if connexion.request.is_json:
        repository_type =  RepositoryType.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def osbrepository_get(page=None, per_page=None, q=None, tags=None, types=None, user_id=None):  # noqa: E501
    """Used to list all available repositories.

     # noqa: E501

    :param page: The page number for starting to collect the result set.
    :type page: int
    :param per_page: The number of items to return.
    :type per_page: int
    :param q: The search string for filtering of the items to return. Format [field/relation[field]][comparator &#x3D; , __not&#x3D; , __like&#x3D; ][value]. Multiple parameters are concatenated with + (OR operator)
    :type q: str
    :param tags: The tags to filter with Multiple parameters are concatenated with + (OR operator)
    :type tags: str
    :param types: The tags to filter with Multiple parameters are concatenated with + (OR operator)
    :type types: str
    :param user_id: The id of the owner user to filter with
    :type user_id: str

    :rtype: InlineResponse2001
    """
    return 'do some magic!'


def osbrepository_id_delete(id, context=None):  # noqa: E501
    """Delete a OSBRepository.

     # noqa: E501

    :param id: 
    :type id: int
    :param context: the context for getting the resources, optional
    :type context: str

    :rtype: None
    """
    return 'do some magic!'


def osbrepository_id_get(id, context=None):  # noqa: E501
    """Used to retrieve a repository.

     # noqa: E501

    :param id: 
    :type id: int
    :param context: the context for getting the resources, optional
    :type context: str

    :rtype: OSBRepository
    """
    return 'do some magic!'


def osbrepository_id_put(id, osb_repository, context=None):  # noqa: E501
    """Update a OSB repository.

     # noqa: E501

    :param id: 
    :type id: int
    :param osb_repository: The repository to save.
    :type osb_repository: dict | bytes
    :param context: the context for getting the resources, optional
    :type context: str

    :rtype: OSBRepository
    """
    if connexion.request.is_json:
        osb_repository = OSBRepository.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def osbrepository_post(osb_repository):  # noqa: E501
    """Used to save a OSB Repository. The user_id (keycloak user id) will be automatically filled with the current user

     # noqa: E501

    :param osb_repository: The OSB repository to save.
    :type osb_repository: dict | bytes

    :rtype: OSBRepository
    """
    if connexion.request.is_json:
        osb_repository = OSBRepository.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def tag_get(page=None, per_page=None, q=None):  # noqa: E501
    """Used to list all available tags.

     # noqa: E501

    :param page: The page number for starting to collect the result set.
    :type page: int
    :param per_page: The number of items to return.
    :type per_page: int
    :param q: The search string for filtering of the items to return. Format [field/relation[field]][comparator &#x3D; , __not&#x3D; , __like&#x3D; ][value]
    :type q: str

    :rtype: InlineResponse2003
    """
    return 'do some magic!'


def tag_id_delete(id):  # noqa: E501
    """Delete an tag from the repository.

     # noqa: E501

    :param id: 
    :type id: int

    :rtype: None
    """
    return 'do some magic!'


def tag_id_get(id):  # noqa: E501
    """Used to retrieve an tag from the repository.

     # noqa: E501

    :param id: 
    :type id: int

    :rtype: Tag
    """
    return 'do some magic!'


def tag_id_put(id, tag):  # noqa: E501
    """Update an tag in the repository.

     # noqa: E501

    :param id: 
    :type id: int
    :param tag: The tag to save.
    :type tag: dict | bytes

    :rtype: Tag
    """
    if connexion.request.is_json:
        tag = Tag.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def tag_post(tag):  # noqa: E501
    """Used to save a Tag to the repository. The user_id (keycloak user id) will be automatically filled with the current user

     # noqa: E501

    :param tag: The Tag to save.
    :type tag: dict | bytes

    :rtype: Tag
    """
    if connexion.request.is_json:
        tag = Tag.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def volumestorage_get(page=None, per_page=None, q=None):  # noqa: E501
    """Used to list all available volumestorages.

     # noqa: E501

    :param page: The page number for starting to collect the result set.
    :type page: int
    :param per_page: The number of items to return.
    :type per_page: int
    :param q: The search string for filtering of the items to return. Format [field/relation[field]][comparator &#x3D; , __not&#x3D; , __like&#x3D; ][value]
    :type q: str

    :rtype: InlineResponse2002
    """
    return 'do some magic!'


def volumestorage_id_delete(id):  # noqa: E501
    """Delete an volumestorage from the repository.

     # noqa: E501

    :param id: 
    :type id: int

    :rtype: None
    """
    return 'do some magic!'


def volumestorage_id_get(id):  # noqa: E501
    """Used to retrieve an volumestorage from the repository.

     # noqa: E501

    :param id: 
    :type id: int

    :rtype: VolumeStorage
    """
    return 'do some magic!'


def volumestorage_id_put(id, volume_storage):  # noqa: E501
    """Update an volumestorage in the repository.

     # noqa: E501

    :param id: 
    :type id: int
    :param volume_storage: The volumestorage to save.
    :type volume_storage: dict | bytes

    :rtype: VolumeStorage
    """
    if connexion.request.is_json:
        volume_storage = VolumeStorage.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def volumestorage_post(volume_storage):  # noqa: E501
    """Used to save a VolumeStorage to the repository. The user_id (keycloak user id) will be automatically filled with the current user

     # noqa: E501

    :param volume_storage: The VolumeStorage to save.
    :type volume_storage: dict | bytes

    :rtype: VolumeStorage
    """
    if connexion.request.is_json:
        volume_storage = VolumeStorage.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def workspace_get(page=None, per_page=None, q=None, tags=None):  # noqa: E501
    """Used to list all available workspaces.

     # noqa: E501

    :param page: The page number for starting to collect the result set.
    :type page: int
    :param per_page: The number of items to return.
    :type per_page: int
    :param q: The search string for filtering of the items to return. Multiple criteria are seperated by &#39;+&#39; (and operator is applied). Format [field/relation[field]][comparator &#x3D; , __not&#x3D; , __like&#x3D; ][value]
    :type q: str
    :param tags: The tags to filter with Multiple parameters are concatenated with + (OR operator)
    :type tags: str

    :rtype: InlineResponse200
    """
    return 'do some magic!'


def workspace_id_delete(id):  # noqa: E501
    """Delete a workspace from the repository.

     # noqa: E501

    :param id: 
    :type id: int

    :rtype: None
    """
    return 'do some magic!'


def workspace_id_get(id):  # noqa: E501
    """Used to retrieve a workspace from the repository.

     # noqa: E501

    :param id: 
    :type id: int

    :rtype: Workspace
    """
    return 'do some magic!'


def workspace_id_put(id, workspace):  # noqa: E501
    """Update a workspace in the repository.

     # noqa: E501

    :param id: 
    :type id: int
    :param workspace: The workspace to save.
    :type workspace: dict | bytes

    :rtype: Workspace
    """
    if connexion.request.is_json:
        workspace = Workspace.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def workspace_post(workspace):  # noqa: E501
    """Used to save a Workspace to the repository. The user_id (keycloak user id) will be automatically filled with the current user

     # noqa: E501

    :param workspace: The Workspace to save.
    :type workspace: dict | bytes

    :rtype: Workspace
    """
    if connexion.request.is_json:
        workspace = Workspace.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def workspaceresource_id_delete(id):  # noqa: E501
    """Delete a WorkspaceResource.

     # noqa: E501

    :param id: 
    :type id: int

    :rtype: None
    """
    return 'do some magic!'


def workspaceresource_id_get(id):  # noqa: E501
    """Used to retrieve a WorkspaceResource.

     # noqa: E501

    :param id: 
    :type id: int

    :rtype: WorkspaceResource
    """
    return 'do some magic!'


def workspaceresource_id_put(id, workspace_resource):  # noqa: E501
    """Update the WorkspaceResource.

     # noqa: E501

    :param id: 
    :type id: int
    :param workspace_resource: The WorkspaceResource to save.
    :type workspace_resource: dict | bytes

    :rtype: WorkspaceResource
    """
    if connexion.request.is_json:
        workspace_resource = WorkspaceResource.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def workspaceresource_post(workspace_resource):  # noqa: E501
    """Used to save a WorkspaceResource to the repository.

     # noqa: E501

    :param workspace_resource: The WorkspaceResource to save.
    :type workspace_resource: dict | bytes

    :rtype: WorkspaceResource
    """
    if connexion.request.is_json:
        workspace_resource = WorkspaceResource.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def workspaces_controllers_osbrepository_controller_setthumbnail(id, thumb_nail=None):  # noqa: E501
    """Sets the thumbnail of the workspace.

     # noqa: E501

    :param id: Repository ID 
    :type id: int
    :param thumb_nail: 
    :type thumb_nail: str

    :rtype: None
    """
    return 'do some magic!'


def workspaces_controllers_workspace_controller_addimage(id, image=None):  # noqa: E501
    """Adds and image to the workspace.

     # noqa: E501

    :param id: Workspace ID of the workspace
    :type id: int
    :param image: 
    :type image: str

    :rtype: None
    """
    return 'do some magic!'


def workspaces_controllers_workspace_controller_import_resources(id, inline_object=None):  # noqa: E501
    """Imports the ResourceOrigins into the Workspace and creates/updates the workspace resources

     # noqa: E501

    :param id: Workspace ID of the workspace
    :type id: int
    :param inline_object: 
    :type inline_object: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        inline_object = InlineObject.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def workspaces_controllers_workspace_controller_setthumbnail(id, thumb_nail=None):  # noqa: E501
    """Sets the thumbnail of the workspace.

     # noqa: E501

    :param id: Workspace ID of the workspace
    :type id: int
    :param thumb_nail: 
    :type thumb_nail: str

    :rtype: None
    """
    return 'do some magic!'


def workspaces_controllers_workspace_controller_workspace_clone(id):  # noqa: E501
    """Clones a workspace

     # noqa: E501

    :param id: Workspace ID of the workspace
    :type id: int

    :rtype: Workspace
    """
    return 'do some magic!'


def workspaces_controllers_workspace_resource_controller_open(id):  # noqa: E501
    """Used to register a WorkspaceResource open action. The WorkspaceResource timestamp last open will be updated

     # noqa: E501

    :param id: WorkspaceResource ID of the WorkspaceResource
    :type id: int

    :rtype: None
    """
    return 'do some magic!'
