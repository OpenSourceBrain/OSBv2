from cloudharness import log
import workspaces.service.osbrepository as repository_service
from workspaces.persistence.crud_persistence import OSBRepositoryRepository, db
from .workspace_controller import _save_image
from workspaces.config import Config

from workspaces.controllers.workspace_controller import setthumbnail

def get_contexts(uri=None, repository_type=None, **kwargs):
    # get the branches of the repository
    try:
        contexts = repository_service.get_contexts(uri, repository_type)
        return contexts, 200
    except Exception as e:
        return str(e), 500


def get_keywords(uri=None, repository_type=None, **kwargs):
    """Get keywords/topics of the repository"""
    try:
        adapter = repository_service.get_repository_adapter(
            repository_type=repository_type, uri=uri
        )
        contexts = repository_service.get_contexts(uri, repository_type)
        # get default information
        keywords = adapter.get_tags(contexts[0])
        return keywords, 200
    except Exception as e:
        return str(e), 500


def get_description(uri=None, repository_type=None, **kwargs):
    """Get description for repository"""
    try:
        adapter = repository_service.get_repository_adapter(
            repository_type=repository_type, uri=uri
        )
        contexts = repository_service.get_contexts(uri, repository_type)
        # get default information
        description = adapter.get_description(contexts[0])
        return description, 200
    except Exception as e:
        return str(e), 500

def get_info(uri=None, repository_type=None):
    """Get description for repository"""
    try:
        adapter = repository_service.get_repository_adapter(
            repository_type=repository_type, uri=uri
        )

        info = adapter.get_info()
        return info, 200
    except Exception as e:
        log.error("Error getting repo info", exc_info=True)
        return str(e), 500
    

def setthumbnail(id_=None, thumb_nail=None, body=None, **kwargs):
    repository = OSBRepositoryRepository().get(id=id_)
    if repository is None:
        return f"Repository with id {id_} not found.", 404
    if not thumb_nail:
        return f"Thumbnail is not specified.", 404
    
    saved_filename = _save_image(id_=id_, image=thumb_nail, filename_base="thumbnail", dirname=Config.REPOSITORY_DIR)
    repository.thumbnail = saved_filename
    db.session.add(repository)
    db.session.commit()
    return "Saved", 200