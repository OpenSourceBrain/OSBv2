import workspaces.service.osbrepository.osbrepository as repository_service

from workspaces.utils import row2dict
from workspaces.repository.model_repository import OSBRepositoryRepository
from workspaces.views.api.rest_api_views import OsbrepositoryView


def get_contexts(uri=None, repository_type=None, **kwargs):
    # get the branches of the repository
    try:
        contexts = repository_service.get_contexts(uri, repository_type)
        return contexts, 200
    except Exception as e:
        return str(e), 500


def get(id_=None, context=None, **kwargs):
    # get the repository
    try:
        osbrepository_ext = OSBRepositoryRepository().get(id=id_)
        if osbrepository_ext is None:
            return f"OSBRepository with id {id_} not found.", 404

        osbrepository_ext.context_resources = repository_service.get_resources(
            osbrepository=osbrepository_ext,
            context=context)  # use context to get the files
        osbrepository_ext.contexts = repository_service.get_contexts(
            repository_type=osbrepository_ext.repository_type,
            uri=osbrepository_ext.uri)
        osbrepository_ext.description = repository_service.get_description(
            osbrepository=osbrepository_ext,
            context=context)  # use context to get the files
        return row2dict(osbrepository_ext), 200
    except Exception as e:
        return str(e), 500
