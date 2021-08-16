from workspaces.service.model_service import (
    OsbrepositoryService,
    VolumestorageService,
    WorkspaceService,
    WorkspaceresourceService,
    TagService,
)

from ..base_model_view import BaseModelView


class WorkspaceView(BaseModelView):
    service = WorkspaceService()

class OsbrepositoryView(BaseModelView):
    service = OsbrepositoryService()

class VolumestorageView(BaseModelView):
    service = VolumestorageService()

class WorkspaceresourceView(BaseModelView):
    service = WorkspaceresourceService()

class TagView(BaseModelView):
    service = TagService()
