from flask import current_app
from sqlalchemy.sql import func
from ..repository.model_repository import RepositoryRepository
from ..repository.database import db
from ..repository.models import WorkspaceResource


def context(id_=None, **kwargs):
    # get the context of the repository
    rr = RepositoryRepository()
    repository = rr.get(id=id_)
    if repository is None:
        return f"Repository with id {id_} not found.", 404

    context = repository_service.get_context(repository)

    return repository.to_dict(), 200
