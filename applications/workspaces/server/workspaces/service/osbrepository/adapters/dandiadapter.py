import concurrent.futures
import os
import re
import sys
from typing import List, TypedDict

import requests
from cloudharness import log as logger

from workspaces.models import DandiRepositoryResource, RepositoryInfo, RepositoryResource, RepositoryResourceNode
from workspaces.models.resource_origin import ResourceOrigin

from .utils import add_to_tree

MAX_WORKERS = 20


class DandiException(Exception):
    pass


class DandiAsset(TypedDict):
    asset_id: str
    url: str


class DandiResource(TypedDict):
    path: str
    version: int
    aggregate_files: int
    aggregate_size: int
    asset: DandiAsset


class DandiAdapter:
    def __init__(self, osbrepository, uri=None):
        self.osbrepository = osbrepository
        self.uri = uri if uri else osbrepository.uri
        self.api_url = "https://api.dandiarchive.org/api"

        try:
            self.dandiset_id = re.search(
                ".*/dandiset/(.*?)[/.*$|$]", self.uri + "/").group(1)
        except AttributeError:
            raise DandiException(f"{self.uri} is not a Dandi set url.")

    def get_json(self, uri):
        logger.debug(f"Getting: {uri}")
        try:
            r = requests.get(
                uri,
            )
            if r.status_code == 200:
                return r.json()
            else:
                raise DandiException(
                    f"Unexpected requests status code: {r.status_code}")
        except Exception as e:
            raise DandiException("Unexpected error:", sys.exc_info()[0])

    def __retrieve_folder_contents(self, context, path_prefix) -> List[DandiResource]:
        uri = f"{self.api_url}/dandisets/{self.dandiset_id}/versions/{context}/assets/paths/?path_prefix={path_prefix}"
        return self.get_json(uri)["results"]

    def __retrieve_files(self, tree_node, context, path_prefix=""):
        logger.debug(f"getFiles for {path_prefix}")
        contents = self.__retrieve_folder_contents(context, path_prefix)
        futures = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            for resource in contents:
                if resource["asset"]:  # downloadable resource
                    dandi_file = resource["asset"]
                    # we save the version in the url query param for later usage in the download task
                    asset_path = f"{self.api_url}/assets/{dandi_file['asset_id']}?folder={context}/{path_prefix}"
                    tree_node.children.append(
                        RepositoryResourceNode(
                            resource=RepositoryResource(
                                path=asset_path,
                                name=os.path.basename(resource["path"]),
                                size=resource["aggregate_size"],
                                # timestamp_modified=dandi_file["modified"],
                                osbrepository_id=self.osbrepository.id,
                            ),
                            children=[],
                        )
                    )
                else:  # a folder
                    new_path_prefix = resource['path']
                    folder_url = f"{self.api_url}/dandisets/{self.dandiset_id}/versions/{context}/assets/paths/?path_prefix={new_path_prefix}&folder={context}/{new_path_prefix}"

                    folder_node = RepositoryResourceNode(
                        resource=RepositoryResource(
                            path=folder_url,
                            name=os.path.basename(resource["path"]),
                            osbrepository_id=self.osbrepository.id,
                        ),
                        children=[],
                    )

                    tree_node.children.append(folder_node)
                    # self.__retrieve_files(
                    #     context=context, tree_node=folder_node, path_prefix=new_path_prefix)
                    futures.append(
                        executor.submit(
                            self.__retrieve_files,
                            context=context,
                            tree_node=folder_node,
                            path_prefix=new_path_prefix,
                        )
                    )
        return futures

    def get_info(self) -> RepositoryInfo:
        resp = self.get_json(f"{self.api_url}/dandisets/{self.dandiset_id}")
        base_info = resp["most_recent_published_version"] or resp["draft_version"]
        detailed_info = self._get_dandi_info(base_info["version"])
        return RepositoryInfo(
            name=base_info["name"],
            contexts=self.get_contexts(),
            tags=detailed_info["metadata"].get("keywords", []),
            summary=detailed_info["metadata"].get("description", ""),
        )

    def get_base_uri(self):
        return f"https://dandiarchive.org/dandiset/{self.dandiset_id}"

    def get_contexts(self):
        versions = self.get_json(
            f"{self.api_url}/dandisets/{self.dandiset_id}/versions/")["results"]
        return [context["version"] for context in versions]

    def create_tree_node(self):
        return RepositoryResourceNode(
            resource=DandiRepositoryResource(
                name="/",
                path="/",
                osbrepository_id=self.osbrepository.id,
            ),
            children=[],
        )

    def get_resources(self, context) -> RepositoryResourceNode:
        tree = self.create_tree_node()
        futures = self.__retrieve_files(tree, context)
        for future in concurrent.futures.as_completed(futures):
            pass
        return tree

    def _get_dandi_info(self, context):
        result = self.get_json(
            f"{self.api_url}/dandisets/{self.dandiset_id}/versions/{context}/info/")
        return result

    def get_description(self, context):
        try:
            result = self._get_dandi_info(context)
            return result["metadata"]["description"]
        except Exception as e:
            logger.debug("unable to get the description from Dandi, %", str(e))
            return ""

    def get_tags(self, context):
        try:
            result = self._get_dandi_info(context)
            return result["metadata"]["keywords"]
        except Exception as e:
            logger.debug("unable to get the tags from Dandi, %", str(e))
            return []

    def create_copy_task(self, workspace_id, origins: List[ResourceOrigin]):
        # download the resource
        all_tasks = []
        for origin in origins:
            path = origin.path
            folder = re.search(".*folder=(.*)$", path).group(1)
            # remove query param delimiters
            downloadpath = re.search(
                "(.*)folder=.*$", path).group(1).strip("&").strip("?")
            if "path_prefix" in downloadpath:
                context = folder.split("/")[0]
                tree = self.create_tree_node()
                futures = self.__retrieve_files(
                    tree, context, path_prefix="/".join(folder.split("/")[1:]))
                for future in concurrent.futures.as_completed(futures):
                    pass
                tasks = []
                self._create_copy_task_assets_of_folder(
                    workspace_id, tree, tasks)
                all_tasks.extend(tasks)
            else:
                all_tasks.append(
                    self._create_copy_asset_task(workspace_id, path))
        return all_tasks

    def _create_copy_task_assets_of_folder(self, workspace_id, tree, tasks):
        children = tree.children
        if children != []:
            for child in children:
                self._create_copy_task_assets_of_folder(
                    workspace_id, child, tasks)
        else:
            resource = tree.resource
            task = self._create_copy_asset_task(
                workspace_id=workspace_id, path=resource.path)
            tasks.append(task)

    def _create_copy_asset_task(self, workspace_id, path):

        import workspaces.service.workflow as workflow

        folder = re.search(".*folder=(.*)$", path).group(1)
        folder = f"{self.osbrepository.name}/{folder}"
        downloadpath = re.search("(.*)\?folder=.*$", path).group(1)
        print(f"Copy task: {folder} - {downloadpath}")

        return workflow.create_copy_task(
            image_name="workspaces-dandi-copy",
            workspace_id=workspace_id,
            folder=folder,
            url=downloadpath,
        )
