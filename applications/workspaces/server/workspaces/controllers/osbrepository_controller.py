import workspaces.service.osbrepository.osbrepository as repository_service
from workspaces.repository.model_repository import OSBRepositoryRepository
from workspaces.utils import dao_entity2dict
from workspaces.views.api.rest_api_views import OsbrepositoryView


def get_contexts(uri=None, repository_type=None, **kwargs):
    # get the branches of the repository
    try:
        contexts = repository_service.get_contexts(uri, repository_type)
        return contexts, 200
    except Exception as e:
        return str(e), 500

