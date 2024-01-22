import re
import sys
from typing import List
import requests

from cloudharness import log as logger
from workspaces.models import FigshareRepositoryResource, RepositoryResourceNode, RepositoryInfo
from workspaces.models.resource_origin import ResourceOrigin

from .utils import add_to_tree


class FigShareException(Exception):
    pass


class FigShareAdapter:
    """
    Adapter for FigShare

    https://docs.figshare.com/
    """

    def __init__(self, osbrepository, uri=None):
        self.osbrepository = osbrepository
        self.uri = uri if uri else osbrepository.uri
        # even for different figshare "instances", the IDs remain the same, and
        # there's only one API end point
        self.api_url = "https://api.figshare.com/v2/"

        # hard coded list of valid figshare URls
        figshare_urls = [
            "figshare.com",  # default
            "rdr.ucl.ac.uk"  # UCL
        ]

        # create composite for re
        url_str = "https://("
        for v in figshare_urls:
            url_str += (v + "|")
        url_str += ")"

        try:
            self.article_id = re.search(
                f"{url_str}/.*/(.*?)$",
                self.uri.strip("/")).group(2)

        except AttributeError:
            raise FigShareException(f"{uri} is not a valid Figshare URL")

    def get_json(self, uri):
        logger.debug(f"Getting: {uri}")
        try:
            r = requests.get(
                uri,
            )
            if r.status_code == 200:
                return r.json()
            else:
                raise FigShareException(
                    f"Unexpected requests status code: {r.status_code}")
        except Exception as e:
            raise FigShareException("Unexpected error:", sys.exc_info()[0])

    def get_base_uri(self):
        return self.uri

    def get_info(self) -> RepositoryInfo:
        info = self.get_json(
            f"{self.api_url}/articles/{self.article_id}")
        return RepositoryInfo(name=info["title"], contexts=self.get_contexts(), tags=info["tags"], summary=info.get("description", ""))

    def get_contexts(self):
        result = self.get_json(
            f"{self.api_url}/articles/{self.article_id}/versions")
        # returned as integers, so cast to string before returning
        return [str(v["version"]) for v in result]

    def get_resources(self, context):
        # can also be fetched from the full article end point, but this is more
        # direct
        contents = self.get_json(
            f"{self.api_url}/articles/{self.article_id}/files")

        tree = RepositoryResourceNode(
            resource=FigshareRepositoryResource(
                name="/",
                path="/",
                osbrepository_id=self.osbrepository.id,
            ),
            children=[],
        )

        for afile in contents:
            add_to_tree(
                tree=tree,
                tree_path=[afile["name"]],
                path=afile["download_url"],
                size=afile["size"],
                osbrepository_id=self.osbrepository.id,
            )

        return tree

    def _get_figshare_info(self, context):
        result = self.get_json(
            f"{self.api_url}/articles/{self.article_id}/versions/{context}")
        return result

    def get_description(self, context):
        try:
            result = self._get_figshare_info(context)
            return result["description"]
        except Exception as e:
            logger.debug("unable to get the description from Figshare, %", str(e))
            return ""

    def get_tags(self, context):
        try:
            result = self._get_figshare_info(context)
            return result["tags"]
        except Exception as e:
            logger.debug("unable to get the tags from Figshare, %", str(e))
            return []

    def create_copy_task(self, workspace_id, origins: List[ResourceOrigin]):
        tasks = []
        import workspaces.service.workflow as workflow
        for origin in origins:
            path = origin.path
            # no file tree in FigShare
            folder = self.osbrepository.name

            # download everything: the handler will fetch the complete file list
            # and download them all
            if not path or path == "/":
                path = self.article_id

            # username / password are optional and future usage,
            # e.g. for accessing non public repos
            tasks.append(workflow.create_copy_task(
                image_name="workspaces-figshare-copy",
                workspace_id=workspace_id,
                folder=folder,
                url=path,
                username="",
                password="",
            ))
        return tasks
