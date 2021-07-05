import json
from cloudharness import log as logger

from cloudharness.events.decorators import send_event

import cloudharness.workflows.argo as argo

from workspaces.models import OSBRepository, OSBRepositoryEntity
from workspaces.repository import (
    OSBRepositoryRepository,
    VolumeStorageRepository,
    WorkspaceRepository,
    WorkspaceResourceRepository,
)



def rm_null_values(dikt):
    tmp = {}
    for k, v in dikt.items():  # remove null fields from dict
        if v:
            tmp.update({k: v})
    return tmp


class BaseModelService():
    """
    Generic base model service class
    """

    repository = None

    def search(self, page=1, per_page=20, *args, **kwargs):
        """
        Query the model and return all records

        Args:
            page: The page number
            per_page: The number of records per page to limit

        Returns:
            dict with all records from the model
            current page
            number of pages
        """
        logger.debug("Search args %s", args)
        logger.debug("Search kwargs %s", kwargs)
        return self.repository.search(page=page, per_page=per_page, *args, **kwargs)

    def post(self, body):
        """Save an object to the repository."""
        body = rm_null_values(body)
        return self.repository.post(body)

    def get(self, id_):
        """Get an object from the repository."""
        obj = self.repository.get(id=id_)
        if obj is None:
            return f"{self.repository.model.__name__} with id {id_} not found.", 404
        return obj

    def put(self, body, id_):
        """Update an object in the repository."""
        return self.repository.put(body, id_)

    def delete(self, id_):
        """Delete an object from the repository."""
        return self.repository.delete(id_)


class WorkspaceService(BaseModelService):
    repository = WorkspaceRepository()

    @send_event(message_type="workspace", operation="create")
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
        # check if there are running import tasks
        logger.debug("Post get, check workflows for workspace %....", workspace.get("id"))
        workflows = argo.get_workflows(status="Running", limit=9999)
        if workflows and workflows.items:
            for workflow in workflows.items:
                try:
                    if workflow.status == "Running" and workflow.raw.spec.templates[0].metadata.labels.get(
                        "workspace"
                    ).strip() == str(workspace["id"]):
                        fake_path = f"Importing resources, progress {workflow.raw.status.progress}".replace("/", " of ")
                        workspace["resources"].append(
                            {
                                "id": -1,
                                "name": "Importing resources into workspace",
                                "origin": {"path": fake_path},
                                "resource_type": "e",
                                "workspace_id": workspace["id"],
                            }
                        )
                    break
                except Exception as e:
                    # probably not a workspace import workflow job --> skip it
                    pass
        return workspace


class OsbrepositoryService(BaseModelService):
    repository = OSBRepositoryRepository()

    @send_event(message_type="osbrepository", operation="create")
    def post(self, body):
        content_types = ""
        # convert the content types list to a content type comma separated string
        for ct in body["content_types_list"]:
            content_types += f",{ct}"
        body.update({"content_types": content_types.strip(",")})
        body = OSBRepositoryEntity().from_dict(OSBRepository.from_dict(body).to_dict()).to_dict()
        return super().post(body)


class VolumestorageService(BaseModelService):
    repository = VolumeStorageRepository()


class WorkspaceresourceService(BaseModelService):
    repository = WorkspaceResourceRepository()

    def post(self, body):
        body.update({"origin": json.dumps(body.get("origin"))})
        return super().post(body)

    def get(self, id_):
        workspace_resource = super().get(id_)
        if len(workspace_resource) > 2:
            workspace_resource.update({"origin": json.loads(workspace_resource.get("origin"))})
        return workspace_resource
