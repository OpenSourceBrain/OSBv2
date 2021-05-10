import json

from cloudharness import log as logger
import workspaces.repository as repos
from .adapters import GitHubAdapter, DandiAdapter, FigShareAdapter


def get_repository_adapter(osbrepository=None, repository_type=None, uri=None, *args, **kwargs):
    if osbrepository is not None:
        repository_type = osbrepository.repository_type
        uri = osbrepository.uri
    if repository_type == "github":
        return GitHubAdapter(*args, uri=uri, **kwargs)
    elif repository_type == "dandi":
        return DandiAdapter(*args, uri=uri, **kwargs)
    elif repository_type == "figshare":
        return FigShareAdapter(*args, uri=uri, **kwargs)
    return None


def get_contexts(uri, repository_type):
    repository_service = get_repository_adapter(repository_type=repository_type, uri=uri)
    return repository_service.get_contexts()


def get_resources(osbrepository, context=None):
    repository_service = get_repository_adapter(osbrepository=osbrepository)
    if not context:
        context = osbrepository.default_context
    return repository_service.get_resources(context)


def get_description(osbrepository, context=None):
    repository_service = get_repository_adapter(osbrepository=osbrepository)
    if not context:
        context = osbrepository.default_context
    return repository_service.get_description(context)


def copy_resource(workspace_resource):
    origin = json.loads(workspace_resource.origin)
    osbrepository = repos.OSBRepositoryRepository().get(id=origin.get("osbrepository_id"))
    repository_adapter = get_repository_adapter(osbrepository=osbrepository)
    repository_adapter.copy_resource(workspace_resource, origin)
