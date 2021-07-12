from workspaces.service.model_service import (
    OsbrepositoryService,
    VolumestorageService,
    WorkspaceService,
    WorkspaceresourceService,
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
