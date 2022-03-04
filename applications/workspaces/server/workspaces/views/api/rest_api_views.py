import workspaces.service.osbrepository as repository_service
from workspaces.service.model_service import (
    NotAuthorized,
    OsbrepositoryService,
    VolumestorageService,
    WorkspaceService,
    WorkspaceresourceService,
    TagService,
)
from workspaces.repository.model_repository import OSBRepositoryRepository
from workspaces.utils import dao_entity2dict
from workspaces.views.base_model_view import BaseModelView


class WorkspaceView(BaseModelView):
    service = WorkspaceService()


class OsbrepositoryView(BaseModelView):
    service = OsbrepositoryService()

    def get(self, id_, *args, **kwargs):
        context = kwargs.get("context")

        try:
            osbrepository_ext = self.service.get(id_)
        except NotAuthorized:
            return "Access to the requested resources not authorized", 401
        if osbrepository_ext is None:
            return f"{self.service.repository} with id {id_} not found.", 404

        osbrepository_ext.context_resources = repository_service.get_resources(
            osbrepository=osbrepository_ext, context=context, osbrepository_id=id_
        )  # use context to get the files
        osbrepository_ext.contexts = repository_service.get_contexts(
            repository_type=osbrepository_ext.repository_type, uri=osbrepository_ext.uri
        )
        osbrepository_ext.description = repository_service.get_description(
            osbrepository=osbrepository_ext, context=context
        )  # use context to get the files
        return dao_entity2dict(osbrepository_ext), 200


class VolumestorageView(BaseModelView):
    service = VolumestorageService()


class WorkspaceresourceView(BaseModelView):
    service = WorkspaceresourceService()


class TagView(BaseModelView):
    service = TagService()
