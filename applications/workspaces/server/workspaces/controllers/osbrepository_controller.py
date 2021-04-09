import workspaces.service.osbrepository.osbrepository as repository_service
from workspaces.repository.model_repository import OSBRepositoryRepository
from workspaces.models.osb_repository import OSBRepository


def get_contexts(uri=None, repository_type=None, **kwargs):
    # get the branches of the repository
    contexts = repository_service.get_contexts(uri, repository_type)
    return contexts, 200


def get(id_=None, context=None, **kwargs):
    # get the repository
    rr = OSBRepositoryRepository()
    osb_repository = rr.get(id=id_)
    if osb_repository is None:
        return f"OSBRepository with id {id_} not found.", 404

    repo_dict = osb_repository.to_dict()
    r = OSBRepository.from_dict(repo_dict)
    r.context_resources = repository_service.get_resources(
        osb_repository,
        context)  # use context to get the files
    r.all_contexts = repository_service.get_contexts(
        repository_type=osb_repository.repository_type,
        uri=osb_repository.uri)
    return r, 200
