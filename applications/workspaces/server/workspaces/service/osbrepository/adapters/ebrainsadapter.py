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
        result = self.get_json(f"{self.api_url}/{self.model_id}")
        revisions = result["history"]["revisions"]
        return [str(v["version"]) for v in revisions]

    def _get_filelist(self, context):
        logger.debug(f"Getting filelist: {context}")
        contents = self.get_json(f"{self.api_url}/model/files/{self.model_id}.{context}")
        files = (contents.get("additional", []) + contents.get("main", []))
        return files

    def get_resources(self, context):
        logger.debug(f"Getting resources: {context}")
        files = self._get_filelist(context)

        tree = RepositoryResourceNode(
            resource=BiomodelsRepositoryResource(
                name="/",
                path="/",
                osbrepository_id=self.osbrepository.id,
                ref=context,
            ),
            children=[],
        )

        for afile in files:
            download_url = f"{self.api_url}/model/download/{self.model_id}.{context}?filename={afile['name']}"
            add_to_tree(
                tree=tree,
                tree_path=[afile["name"]],
                path=download_url,
                size=int(afile["fileSize"]),
                osbrepository_id=self.osbrepository.id,
            )

        return tree

    def get_description(self, context):
        logger.debug(f"Getting description: {context}")
        try:
            result = self.get_json(f"{self.api_url}/{self.model_id}.{context}")
            return result["description"]
        except Exception as e:
            logger.debug(
                "unable to get the description from biomodels, %", str(e))
            return ""

    def get_tags(self, context):
        # using the format name for the moment, since they don't do explict
        # tags/keywords
        logger.debug(f"Getting tags: {context}")
        result = self.get_json(f"{self.api_url}/{self.model_id}.{context}")
        return result["format"]["name"]

    # biomodels files are usually small, so one task is enough
    def create_copy_task(self, workspace_id, origins: List[ResourceOrigin]):
        import workspaces.service.workflow as workflow

        # no file tree in Biomodels from the looks of it
        folder = self.osbrepository.name

        # if nothing is selected, origins has one entry with path "/"
        # we get the file list and download individual files
        # Biomodels does allow downloading the archive, but that is generated
        # on the fly and can require us to wait for an unspecified amount of
        # time
        if len(origins) == 1 and origins[0].path == "/":
            """
            # to use the archive method, just set paths to ""
            paths = ""
            """
            files = self._get_filelist(self.osbrepository.default_context)
            download_url_prefix = f"{self.api_url}/model/download/{self.model_id}.{self.osbrepository.default_context}?filename="
            paths = "\\".join(f"{download_url_prefix}{file['name']}" for file in files)
        else:
            paths = "\\".join(o.path for o in origins)

        # username / password are not currently used
        return workflow.create_copy_task(
            image_name="workspaces-biomodels-copy",
            workspace_id=workspace_id,
            folder=folder,
            url=f"{self.model_id}.{self.osbrepository.default_context}",
            paths=paths,
            username="",
            password="",
        )
