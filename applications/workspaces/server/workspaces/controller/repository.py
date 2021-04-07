from flask import current_app
from sqlalchemy.sql import func
from workspaces.repository.model_repository import RepositoryRepository
from workspaces.service.repository.repository \
    import get_context as get_context_service, \
           get_branches as get_branches_service


def get_branches(id_=None, **kwargs):
    # get the branches of the repository
    rr = RepositoryRepository()
    repository = rr.get(id=id_)
    if repository is None:
        return f"Repository with id {id_} not found.", 404

    branches = get_branches_service(repository)
    return branches, 200


def get_context(id_=None, **kwargs):
    # get the context of the repository
    rr = RepositoryRepository()
    repository = rr.get(id=id_)
    if repository is None:
        return f"Repository with id {id_} not found.", 404

    context = get_context_service(repository)
    return context.to_dict(), 200
