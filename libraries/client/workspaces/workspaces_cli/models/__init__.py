# flake8: noqa

# import all models into this package
# if you have many models here with many references from one model to another this may
# raise a RecursionError
# to avoid this, import only the models that you directly need like:
# from from workspaces_cli.model.pet import Pet
# or import this package, but before doing it, use:
# import sys
# sys.setrecursionlimit(n)

from workspaces_cli.model.dandi_repository_resource import DandiRepositoryResource
from workspaces_cli.model.download_resource import DownloadResource
from workspaces_cli.model.figshare_repository_resource import FigshareRepositoryResource
from workspaces_cli.model.git_repository_resource import GITRepositoryResource
from workspaces_cli.model.biomodels_repository_resource import BiomodelsRepositoryResource
from workspaces_cli.model.git_repository_resource_all_of import GITRepositoryResourceAllOf
from workspaces_cli.model.inline_object import InlineObject
from workspaces_cli.model.inline_response200 import InlineResponse200
from workspaces_cli.model.inline_response2001 import InlineResponse2001
from workspaces_cli.model.inline_response2002 import InlineResponse2002
from workspaces_cli.model.inline_response2003 import InlineResponse2003
from workspaces_cli.model.osb_repository import OSBRepository
from workspaces_cli.model.osb_repository_all_of import OSBRepositoryAllOf
from workspaces_cli.model.osb_repository_base import OSBRepositoryBase
from workspaces_cli.model.osb_repository_entity import OSBRepositoryEntity
from workspaces_cli.model.pagination import Pagination
from workspaces_cli.model.repository_content_type import RepositoryContentType
from workspaces_cli.model.repository_info import RepositoryInfo
from workspaces_cli.model.repository_resource import RepositoryResource
from workspaces_cli.model.repository_resource_base import RepositoryResourceBase
from workspaces_cli.model.repository_resource_base_all_of import RepositoryResourceBaseAllOf
from workspaces_cli.model.repository_resource_node import RepositoryResourceNode
from workspaces_cli.model.repository_type import RepositoryType
from workspaces_cli.model.resource_base import ResourceBase
from workspaces_cli.model.resource_origin import ResourceOrigin
from workspaces_cli.model.resource_status import ResourceStatus
from workspaces_cli.model.resource_type import ResourceType
from workspaces_cli.model.tag import Tag
from workspaces_cli.model.user import User
from workspaces_cli.model.valid import Valid
from workspaces_cli.model.volume_storage import VolumeStorage
from workspaces_cli.model.workspace import Workspace
from workspaces_cli.model.workspace_all_of import WorkspaceAllOf
from workspaces_cli.model.workspace_base import WorkspaceBase
from workspaces_cli.model.workspace_collaborator import WorkspaceCollaborator
from workspaces_cli.model.workspace_entity import WorkspaceEntity
from workspaces_cli.model.workspace_entity_all_of import WorkspaceEntityAllOf
from workspaces_cli.model.workspace_image import WorkspaceImage
from workspaces_cli.model.workspace_resource import WorkspaceResource
from workspaces_cli.model.workspace_resource_all_of import WorkspaceResourceAllOf
from workspaces_cli.model.workspace_resource_base import WorkspaceResourceBase
from workspaces_cli.model.workspace_resource_entity import WorkspaceResourceEntity
from workspaces_cli.model.workspace_resource_entity_all_of import WorkspaceResourceEntityAllOf
