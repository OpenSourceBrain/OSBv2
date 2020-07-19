from ..base_model_view import BaseModelView
from workspaces.repository import WorkspaceRepository, OSBRepositoryRepository, GITRepositoryRepository, \
    FigshareRepositoryRepository, VolumeStorageRepository, WorkspaceResourceRepository


class WorkspaceView(BaseModelView):
    repository = WorkspaceRepository()

class OsbrepositoryView(BaseModelView):
    repository = OSBRepositoryRepository()

class GitrepositoryView(BaseModelView):
    repository = GITRepositoryRepository()

class FigsharerepositoryView(BaseModelView):
    repository = FigshareRepositoryRepository()

class VolumestorageView(BaseModelView):
    repository = VolumeStorageRepository()

class WorkspacereourceView(BaseModelView):
    repository = WorkspaceResourceRepository
