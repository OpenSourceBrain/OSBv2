from workspaces.repository.model_repository import OSBRepositoryRepository
from workspaces.repository.models import OSBRepository
import workspaces.service.osbrepository.osbrepository as repository_service
from workspaces.views.api.rest_api_views import OsbrepositoryView
from workspaces.models import OSBRepositoryExtended


def post(body):
    content_types = ""
    for ct in body["content_types_list"]:
        content_types += f",{ct}"
    body.update({"content_types": content_types.strip(",")})
    del body["content_types_list"]
    return OsbrepositoryView().post(body)


def get_contexts(uri=None, repository_type=None, **kwargs):
    # get the branches of the repository
    contexts = repository_service.get_contexts(uri, repository_type)
    return contexts, 200


def get(id_=None, context=None, **kwargs):
    # get the repository
    osbrepository_ext = OsbrepositoryView().get(id_=id_)
    if osbrepository_ext is None:
        return f"OSBRepository with id {id_} not found.", 404

    osbrepository_ext.update({"context_resources": repository_service.get_resources(
        osbrepository=osbrepository_ext,
        context=context)  # use context to get the files
    })
    osbrepository_ext.update({"contexts": repository_service.get_contexts(
        repository_type=osbrepository_ext.get("repository_type"),
        uri=osbrepository_ext.get("uri"))
    })
    osbrepository_ext.update({"description": repository_service.get_description(
        osbrepository=osbrepository_ext,
        context=context)  # use context to get the files
    })
    return osbrepository_ext, 200
