import re
import sys
from typing import List
import requests

from cloudharness import log as logger
from workspaces.models import RepositoryResourceNode, RepositoryInfo
from workspaces.models.resource_origin import ResourceOrigin
from workspaces.models.biomodels_repository_resource import BiomodelsRepositoryResource

from .utils import add_to_tree


class BiomodelsException(Exception):
    pass


class BiomodelsAdapter:
    """
    Adapter for Biomodels

    https://www.ebi.ac.uk/biomodels/
    """

    def __init__(self, osbrepository, uri=None):
        self.osbrepository = osbrepository
        self.uri = uri if uri else osbrepository.uri
        self.api_url = "https://www.ebi.ac.uk/biomodels"

        try:
            self.model_id = re.search(
                f"{self.api_url}/(\\w+)",
                self.uri.strip("/")).group(1)

        except AttributeError:
            raise BiomodelsException(f"{uri} is not a valid Biomodels URL")

    def get_json(self, uri):
        logger.debug(f"Getting: {uri}")
        try:
            r = requests.get(
                uri,
                params={"format": "json"}
            )
            if r.status_code == 200:
                return r.json()
            else:
                raise BiomodelsException(
                    f"Unexpected requests status code: {r.status_code}")
        except Exception as e:
            raise BiomodelsException("Unexpected error:", sys.exc_info()[0])

    def get_base_uri(self):
        return self.uri

    def get_info(self) -> RepositoryInfo:
        info = self.get_json(
            f"{self.api_url}/{self.model_id}")
        return RepositoryInfo(name=info["name"], contexts=self.get_contexts(), tags=info["format"]["name"], summary=info.get("description", ""))

    def get_contexts(self):
        result = self.get_json(self.uri)
        revisions = result["history"]["revisions"]
        return [str(v["version"]) for v in revisions]

    def get_resources(self, context):
        logger.debug(f"Getting resources; {context}")
        contents = self.get_json(f"{self.api_url}/model/files/{self.model_id}.{context}")
        files = (contents["additional"] + contents["main"])

        path = self.get_context_base_path(context)

        tree = RepositoryResourceNode(
            resource=BiomodelsRepositoryResource(
                name="/",
                path=path,
                osbrepository_id=self.osbrepository.id,
                ref=context,
            ),
            children=[],
        )

        for afile in files:
            download_url = f"{self.api_url}/model/download/{afile['name']}"
            add_to_tree(
                tree=tree,
                tree_path=[afile["name"]],
                path=download_url,
                size=afile["fileSize"],
                osbrepository_id=self.osbrepository.id,
            )

        return tree

    def get_description(self, context):
        result = self.get_json(self.uri.strip() + f".{context}")
        return result["description"]

    def get_tags(self, context):
        # using the format name for the moment, since they don't do explict
        # tags/keywords
        result = self.get_json(self.uri.strip() + f".{context}")
        return result["format"]["name"]

    def create_copy_task(self, workspace_id, origins: List[ResourceOrigin]):
        tasks = []
        import workspaces.service.workflow as workflow
        for origin in origins:
            path = origin.path
            # no file tree in Biomodels from the looks of it
            folder = self.osbrepository.name

            # download everything: the handler will fetch the complete file list
            # and download them all
            if not path or path == "/":
                path = self.model_id

            # username / password are optional and future usage,
            # e.g. for accessing non public repos
            tasks.append(workflow.create_copy_task(
                image_name="workspaces-biomodels-copy",
                workspace_id=workspace_id,
                folder=folder,
                url=path,
                username="",
                password="",
            ))
        return tasks

