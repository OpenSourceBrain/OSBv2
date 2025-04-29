import re
import sys
from typing import List
import requests


from fairgraph import KGClient, KGProxy
from fairgraph.errors import ResolutionFailure
from fairgraph.openminds.core import FileRepository, Model, ModelVersion
from cloudharness import log as logger
from workspaces.models import RepositoryResourceNode, RepositoryInfo
from workspaces.models.resource_origin import ResourceOrigin
from workspaces.models.biomodels_repository_resource import EbrainsRepositoryResource

from .utils import add_to_tree


class EbrainsException(Exception):
    pass


class EbrainsAdapter:
    """
    Adapter for Ebrains

    https://search.kg.ebrains.eu/
    """

    def __init__(self, osbrepository, uri=None):
        self.osbrepository = osbrepository
        self.uri = uri if uri else osbrepository.uri
        self.api_url = "https://search.kg.ebrains.eu/"
        # TODO: get permanent application auth token from EBRAINS
        self.kg_client = KGClient(client_id="SOME ID", client_secret="SOME SECRET", host="core.kg.ebrains.eu")

        try:
            self.model_id = re.search(
                f"{self.api_url}/instances/(\\w+)",
                self.uri.strip("/")).group(1)

        except AttributeError:
            raise EbrainsException(f"{uri} is not a valid Ebrains URL")

    def get_json(self, uri=None):
        logger.debug(f"Getting: {self.model_id}")

        model = Model.from_id(id=self.model_id, client=self.client)
        return model


    def get_base_uri(self):
        return self.uri

    def get_info(self) -> RepositoryInfo:
        info = self.get_json()
        return RepositoryInfo(name=info["name"], contexts=self.get_contexts(), tags=info["format"]["name"], summary=info.get("description", ""))

    def get_contexts(self):
        result = self.get_json()
        if isinstance(result.versions, list):
            revisions = result.versions
        else:
            revisions = [result.versions]
        return revisions

    def _get_filelist(self, context):
        logger.debug(f"Getting filelist: {context}")
        contents = self.get_json()
        files = (contents.get("additional", []) + contents.get("main", []))
        return files

    def get_resources(self, context):
        logger.debug(f"Getting resources: {context}")
        files = self._get_filelist(context)

        tree = RepositoryResourceNode(
            resource=EbrainsRepositoryResource(
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
            result = self.get_json()
            return result["description"]
        except Exception as e:
            logger.debug(
                "unable to get the description from biomodels, %", str(e))
            return ""

    def get_tags(self, context):
        # using the format name for the moment, since they don't do explict
        # tags/keywords
        logger.debug(f"Getting tags: {context}")
        result = self.get_json()
        return result["format"]["name"]

    # biomodels files are usually small, so one task is enough
    def create_copy_task(self, workspace_id, origins: List[ResourceOrigin]):
        import workspaces.service.workflow as workflow

        # no file tree in Ebrains from the looks of it
        folder = self.osbrepository.name

        # if nothing is selected, origins has one entry with path "/"
        # we get the file list and download individual files
        # Ebrains does allow downloading the archive, but that is generated
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
