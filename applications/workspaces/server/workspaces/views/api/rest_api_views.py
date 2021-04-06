from ..base_model_view import BaseModelView
from workspaces.repository import WorkspaceRepository, OSBRepositoryRepository, GITRepositoryRepository, \
    FigshareRepositoryRepository, VolumeStorageRepository, WorkspaceResourceRepository, RepositoryRepository


class WorkspaceView(BaseModelView):
    repository = WorkspaceRepository()

class OsbrepositoryView(BaseModelView):
    repository = OSBRepositoryRepository()

class GitrepositoryView(BaseModelView):
    repository = GITRepositoryRepository()

class RepositoryView(BaseModelView):
    repository = RepositoryRepository()

class FigsharerepositoryView(BaseModelView):
    repository = FigshareRepositoryRepository()

class VolumestorageView(BaseModelView):
    repository = VolumeStorageRepository()

class WorkspaceresourceView(BaseModelView):
    repository = WorkspaceResourceRepository()
