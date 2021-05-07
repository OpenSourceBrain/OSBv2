import json

from workspaces.models import OSBRepository, OSBRepositoryEntity, Workspace
from workspaces.repository import (
    OSBRepositoryRepository,
    VolumeStorageRepository,
    WorkspaceRepository,
    WorkspaceResourceRepository,
)
from workspaces.repository.models import WorkspaceEntity, WorkspaceResourceEntity

from ..base_model_view import BaseModelView


class WorkspaceView(BaseModelView):
    repository = WorkspaceRepository()

    def post(self, body):
        for r in body.get("resources", []):
            r.update({"origin": json.dumps(r.get("origin"))})
        return super().post(body)

    def get(self, id_):
        workspace = super().get(id_)
        if len(workspace) > 2:
            resources = workspace.get("resources")
            if resources:
                for r in resources:
                    r.update({"origin": json.loads(r.get("origin"))})
            else:
                workspace.update({"resources": []})
        return workspace


class OsbrepositoryView(BaseModelView):
    repository = OSBRepositoryRepository()

    def post(self, body):
        content_types = ""
        # convert the content types list to a content type comma separated string
        for ct in body["content_types_list"]:
            content_types += f",{ct}"
        body.update({"content_types": content_types.strip(",")})
        body = OSBRepositoryEntity().from_dict(OSBRepository.from_dict(body).to_dict()).to_dict()
        return super().post(body)


class VolumestorageView(BaseModelView):
    repository = VolumeStorageRepository()


class WorkspaceresourceView(BaseModelView):
    repository = WorkspaceResourceRepository()

    def post(self, body):
        body.update({"origin": json.dumps(body.get("origin"))})
        return super().post(body)

    def get(self, id_):
        workspace_resource = super().get(id_)
        if len(workspace_resource) > 2:
            workspace_resource.update({"origin": json.loads(workspace_resource.get("origin"))})
        return workspace_resource
