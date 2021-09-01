import workspaces.service.osbrepository.osbrepository as repository_service
from workspaces.service.model_service import (
    OsbrepositoryService,
    VolumestorageService,
    WorkspaceService,
    WorkspaceresourceService,
    TagService,
)
from workspaces.repository.model_repository import OSBRepositoryRepository
from workspaces.utils import row2dict
from workspaces.views.base_model_view import BaseModelView


class WorkspaceView(BaseModelView):
    service = WorkspaceService()


class OsbrepositoryView(BaseModelView):
    service = OsbrepositoryService()

    def get(*args, **kwargs):
        id_ = kwargs.get("id_")
        context = kwargs.get("context")

        osbrepository_ext = OSBRepositoryRepository().get(id=id_)
        if osbrepository_ext is None:
            return f"OSBRepository with id {id_} not found.", 404

        osbrepository_ext.context_resources = repository_service.get_resources(
            osbrepository=osbrepository_ext, context=context, osbrepository_id=id_
        )  # use context to get the files
        osbrepository_ext.contexts = repository_service.get_contexts(
            repository_type=osbrepository_ext.repository_type, uri=osbrepository_ext.uri
        )
        osbrepository_ext.description = repository_service.get_description(
            osbrepository=osbrepository_ext, context=context
        )  # use context to get the files
        return row2dict(osbrepository_ext), 200


class VolumestorageView(BaseModelView):
    service = VolumestorageService()


class WorkspaceresourceView(BaseModelView):
    service = WorkspaceresourceService()


class TagView(BaseModelView):
    service = TagService()
