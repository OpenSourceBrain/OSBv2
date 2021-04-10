from ..base_model_view import BaseModelView
from workspaces.repository import WorkspaceRepository, OSBRepositoryRepository, \
    VolumeStorageRepository, WorkspaceResourceRepository


class WorkspaceView(BaseModelView):
    repository = WorkspaceRepository()

class OsbrepositoryView(BaseModelView):
    repository = OSBRepositoryRepository()

class VolumestorageView(BaseModelView):
    repository = VolumeStorageRepository()

class WorkspaceresourceView(BaseModelView):
    repository = WorkspaceResourceRepository()
