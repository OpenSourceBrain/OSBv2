# flake8: noqa

# import all models into this package
# if you have many models here with many references from one model to another this may
# raise a RecursionError
# to avoid this, import only the models that you directly need like:
# from from osbv2_api.workspaces.model.pet import Pet
# or import this package, but before doing it, use:
# import sys
# sys.setrecursionlimit(n)

from osbv2_api.workspaces.model.biomodels_repository_resource import BiomodelsRepositoryResource
from osbv2_api.workspaces.model.dandi_repository_resource import DandiRepositoryResource
from osbv2_api.workspaces.model.dandi_upload_part import DandiUploadPart
from osbv2_api.workspaces.model.dandi_upload_urls_request import DandiUploadUrlsRequest
from osbv2_api.workspaces.model.dandi_upload_urls_response import DandiUploadUrlsResponse
from osbv2_api.workspaces.model.dandi_uploaded_part import DandiUploadedPart
from osbv2_api.workspaces.model.dandi_validate_upload_request import DandiValidateUploadRequest
from osbv2_api.workspaces.model.dandi_validate_upload_response import DandiValidateUploadResponse
from osbv2_api.workspaces.model.download_resource import DownloadResource
from osbv2_api.workspaces.model.figshare_repository_resource import FigshareRepositoryResource
from osbv2_api.workspaces.model.git_repository_resource import GITRepositoryResource
from osbv2_api.workspaces.model.git_repository_resource_all_of import GITRepositoryResourceAllOf
from osbv2_api.workspaces.model.inline_object import InlineObject
from osbv2_api.workspaces.model.inline_response200 import InlineResponse200
from osbv2_api.workspaces.model.inline_response2001 import InlineResponse2001
from osbv2_api.workspaces.model.inline_response2002 import InlineResponse2002
from osbv2_api.workspaces.model.inline_response2003 import InlineResponse2003
from osbv2_api.workspaces.model.inline_response2004 import InlineResponse2004
from osbv2_api.workspaces.model.osb_repository import OSBRepository
from osbv2_api.workspaces.model.osb_repository_all_of import OSBRepositoryAllOf
from osbv2_api.workspaces.model.osb_repository_base import OSBRepositoryBase
from osbv2_api.workspaces.model.osb_repository_entity import OSBRepositoryEntity
from osbv2_api.workspaces.model.pagination import Pagination
from osbv2_api.workspaces.model.repository_content_type import RepositoryContentType
from osbv2_api.workspaces.model.repository_info import RepositoryInfo
from osbv2_api.workspaces.model.repository_resource import RepositoryResource
from osbv2_api.workspaces.model.repository_resource_base import RepositoryResourceBase
from osbv2_api.workspaces.model.repository_resource_base_all_of import RepositoryResourceBaseAllOf
from osbv2_api.workspaces.model.repository_resource_node import RepositoryResourceNode
from osbv2_api.workspaces.model.repository_type import RepositoryType
from osbv2_api.workspaces.model.resource_base import ResourceBase
from osbv2_api.workspaces.model.resource_origin import ResourceOrigin
from osbv2_api.workspaces.model.resource_status import ResourceStatus
from osbv2_api.workspaces.model.resource_type import ResourceType
from osbv2_api.workspaces.model.tag import Tag
from osbv2_api.workspaces.model.user import User
from osbv2_api.workspaces.model.valid import Valid
from osbv2_api.workspaces.model.volume_storage import VolumeStorage
from osbv2_api.workspaces.model.workspace import Workspace
from osbv2_api.workspaces.model.workspace_all_of import WorkspaceAllOf
from osbv2_api.workspaces.model.workspace_base import WorkspaceBase
from osbv2_api.workspaces.model.workspace_collaborator import WorkspaceCollaborator
from osbv2_api.workspaces.model.workspace_entity import WorkspaceEntity
from osbv2_api.workspaces.model.workspace_entity_all_of import WorkspaceEntityAllOf
from osbv2_api.workspaces.model.workspace_image import WorkspaceImage
from osbv2_api.workspaces.model.workspace_resource import WorkspaceResource
from osbv2_api.workspaces.model.workspace_resource_all_of import WorkspaceResourceAllOf
from osbv2_api.workspaces.model.workspace_resource_base import WorkspaceResourceBase
from osbv2_api.workspaces.model.workspace_resource_entity import WorkspaceResourceEntity
from osbv2_api.workspaces.model.workspace_resource_entity_all_of import WorkspaceResourceEntityAllOf
from osbv2_api.workspaces.model.workspace_run_repo import WorkspaceRunRepo
from osbv2_api.workspaces.model.workspace_run_request import WorkspaceRunRequest
from osbv2_api.workspaces.model.workspace_run_response import WorkspaceRunResponse
from osbv2_api.workspaces.model.workspace_run_results import WorkspaceRunResults
from osbv2_api.workspaces.model.workspace_run_setup import WorkspaceRunSetup
