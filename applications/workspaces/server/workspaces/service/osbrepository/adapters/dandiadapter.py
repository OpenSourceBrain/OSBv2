import re
import requests
import sys
from cloudharness import log as logger

import workspaces.service.workflow as workflow
from workspaces.models import DandiRepositoryResource, RepositoryResource, RepositoryResourceNode

from .utils import add_to_tree

class DandiException(Exception):
    pass


class DandiAdapter:
    def __init__(self, osbrepository, uri=None):
        self.osbrepository = osbrepository
        self.uri = uri if uri else osbrepository.url
        self.api_url = "https://api.dandiarchive.org/api"
        try:
            self.dandiset_id = re.search(
                ".*/dandiset/(.*?)[/.*$|$]",
                self.uri + "/").group(1)
        except AttributeError:
            raise DandiException(f"{self.uri} is not a Dandi set url.")

    def get_json(self, uri):
        try:
            r = requests.get(
                uri,
            )
            if r.status_code == 200:
                return r.json()
            else:
                raise DandiException(f"Unexpected requests status code: {r.status_code}")
        except Exception as e:
            raise DandiException("Unexpected error:", sys.exc_info()[0])

    def getFolderContents(self, context, path_prefix):
        uri = f"{self.api_url}/dandisets/{self.dandiset_id}/versions/{context}/assets/paths/?path_prefix={path_prefix}"
        return uri, self.get_json(uri)

    def getFiles(self, tree, context, path_prefix=""):
        path, contents = self.getFolderContents(context, path_prefix)
        for key, dandi_folder in contents["folders"].items():
            new_path_prefix = f"{path_prefix}/{key}".strip("/")
            folder_url = f"{self.api_url}/dandisets/{self.dandiset_id}/versions/{context}/assets/paths/?path_prefix={new_path_prefix}&folder={context}/{new_path_prefix}"
            add_to_tree(
                tree=tree,
                tree_path=f"{new_path_prefix}".split("/"),
                path=folder_url,
                osbrepository_id=self.osbrepository.id,
            )
            self.getFiles(context=context, tree=tree, path_prefix=new_path_prefix)
        for key2, dandi_file in contents["files"].items():
            # we save the version in the url query param for later usage in the download task
            download_url = f"{self.api_url}/assets/{dandi_file['asset_id']}?folder={context}/{path_prefix}"
            add_to_tree(
                tree=tree,
                tree_path=dandi_file["path"].split("/"),
                path=download_url,
                size=dandi_file["size"],
                timestamp_modified=dandi_file["modified"],
                osbrepository_id=self.osbrepository.id,
            ) 

    def get_contexts(self):
        versions = self.get_json(f"{self.api_url}/dandisets/{self.dandiset_id}/versions")["results"]
        return [context["version"] for context in versions]

    def createTreeRoot(self):
        return RepositoryResourceNode(
            resource=DandiRepositoryResource(
                name="/",
                path="/",
                osbrepository_id=self.osbrepository.id,
            ),
            children=[],
        )

    def get_resources(self, context):
        tree = self.createTreeRoot()
        self.getFiles(tree, context)

        return tree

    def get_description(self, context):
        try:
            result = self.get_json(f"{self.api_url}/dandisets/{self.dandiset_id}/versions/{context}/info/")
            description = result["metadata"]["description"]
            return description
        except Exception as e:
            logger.debug(
                "unable to get the description from Dandi, %", str(e))
            return ""

    def create_copy_task(self, workspace_id, name, path):
        # download the resource
        name = name if name != "/" else self.osbrepository.name
        folder = re.search(".*folder=(.*)$", path).group(1)
        downloadpath = re.search("(.*)folder=.*$", path).group(1).strip("&").strip("?") # remove query param delimiters
        if "path_prefix" in downloadpath:
            context = folder.split("/")[0]
            tree = self.createTreeRoot()
            self.getFiles(tree, context, path_prefix="/".join(folder.split("/")[1:]))
            tasks = []
            self._create_copy_task_assets_of_folder(workspace_id, tree, tasks)
            return tasks
        else:
            return self._create_copy_asset_task(workspace_id, name, path)

    def _create_copy_task_assets_of_folder(self, workspace_id, tree, tasks):
        children = tree.children
        if children != []:
            for child in children:
                self._create_copy_task_assets_of_folder(workspace_id, child, tasks)
        else:
            resource = tree.resource
            task = self._create_copy_asset_task(
                workspace_id=workspace_id,
                name=resource.name,
                path=resource.path)
            tasks.append(task)

    def _create_copy_asset_task(self, workspace_id, name, path):
        name = name if name != "/" else self.osbrepository.name
        folder = re.search(".*folder=(.*)$", path).group(1)
        folder = f"{self.osbrepository.name}/{folder}"
        downloadpath = re.search("(.*)\?folder=.*$", path).group(1)
        print(f"Copy task: {name} - {folder} - {downloadpath}")
        return workflow.create_copy_task(
            image_name="workspaces-dandi-copy",
            workspace_id=workspace_id,
            name=name,
            folder=folder,
            path=downloadpath,
        )
