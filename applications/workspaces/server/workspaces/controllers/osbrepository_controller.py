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
    osbrepository = rr.get(id=id_)
    if osbrepository is None:
        return f"OSBRepository with id {id_} not found.", 404

    repository = osbrepository.to_dict()
    repository.update({"context_resources": repository_service.get_resources(
        osbrepository=osbrepository,
        context=context)  # use context to get the files
    })
    repository.update({"contexts": repository_service.get_contexts(
        repository_type=osbrepository.repository_type,
        uri=osbrepository.uri)
    })
    repository.update({"description": repository_service.get_description(
        osbrepository=osbrepository,
        context=context)  # use context to get the files
    })
    return repository, 200
