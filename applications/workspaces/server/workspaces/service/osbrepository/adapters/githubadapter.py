import os
import base64
from typing import List
import requests

from cloudharness import log as logger
from cloudharness.utils.secrets import get_secret

from workspaces.models import GITRepositoryResource, RepositoryResourceNode, RepositoryInfo
from workspaces.models.resource_origin import ResourceOrigin
from .utils import add_to_tree


def _clean_url_and_end_with_slash(url):
    first_part = url[:7]  # https:/
    second_part = url[7:] + "/"  # /host/path
    while "//" in second_part:
        second_part = second_part.replace("//", "/")
    return first_part + second_part


class GitHubAdapter:
    def __init__(self, osbrepository, uri=None):
        self.osbrepository = osbrepository
        self.uri = uri if uri else osbrepository.url
        self.api_url = _clean_url_and_end_with_slash(
            self.uri.replace("https://github.com/",
                             "https://api.github.com/repos/")
        )
        self.download_base_url = _clean_url_and_end_with_slash(self.uri)

    def get_json(self, uri):
        try:
            gh_user = get_secret("github-user")
        except:
            gh_user = None
        try:
            gh_token = get_secret("github-token")
        except:
            gh_token = None
        r = requests.get(
            uri,
            auth=(gh_user, gh_token)
        )
        if r.status_code == 200:
            return r.json()
        elif r.status_code == 403:
            # rate limit hit
            error = r.json()
            logger.info(error)
            raise Exception(f"GitHub adapter error: {error['message']}")
        else:
            raise Exception(
                f"Failed getting GitHub content, url: {uri}, status code: {r.status_code}")

    def get_base_uri(self):
        return self.uri

    def get_contexts(self):
        branches = self.get_json(self.api_url + "branches?per_page=100")
        tags = self.get_json(self.api_url + "tags?per_page=100")
        return [context["name"] for context in branches + tags]

    def is_context_branch(self, context):
        return requests.get(self.api_url + "branches/" + context ).status_code == 200

    def get_context_base_path(self, context):
        return os.path.join(
            self.download_base_url, "branches" if self.is_context_branch(context) else "tags", context)

    def get_resources(self, context):
        contents = self.get_json(
            f"{self.api_url}git/trees/{context}?recursive=1")
        path = self.get_context_base_path(context)

        tree = RepositoryResourceNode(
            resource=GITRepositoryResource(
                name="/",
                path=path,
                osbrepository_id=self.osbrepository.id,
                ref=context,
            ),
            children=[],
        )
        base_path = self.get_context_base_path(context)
        for git_obj in contents["tree"]:
            download_url = f"{base_path}/{git_obj['path']}"
            add_to_tree(
                tree=tree,
                tree_path=git_obj["path"].split("/"),
                path=download_url,
                sha=git_obj["sha"],
                ref=context,
                osbrepository_id=self.osbrepository.id,
            )

        return tree

    def _get_context_from_url(self, url):
        return url.replace(self.download_base_url, "").split("/")[0]

    def _get_path_from_url(self, url):
        return "/".join(url.replace(self.download_base_url, "").split("/")[1:])

    def get_latest_hash(self, download_url):
        # get the latest version of the file specified in the download url
        context = self._get_context_from_url(download_url)
        path = self._get_path_from_url(download_url)
        file = self.get_json(f"{self.api_url}contents/{path}?ref={context}")
        return file["sha"]

    def get_description(self, context):
        try:
            result = self.get_json(f"{self.api_url}readme?ref={context}")
            description = base64.b64decode(result["content"]).decode("utf-8")
            return description
        except Exception as e:
            logger.debug(
                "unable to get the description from github, %", str(e))
            return ""

    def get_info(self) -> RepositoryInfo:
        return RepositoryInfo(name=self.uri.split("/")[-1], contexts=self.get_contexts(), tags=self.get_tags(), summary="")

    def get_tags(self, context=None):
        """Topics/keywords"""
        tags = self.get_json(self.api_url + "topics")
        return tags["names"]
    
    def create_copy_task(self, workspace_id, origins: List[ResourceOrigin]):
        # download the resource
        import workspaces.service.workflow as workflow
            
        folder = os.path.join(os.path.basename(self.uri), self.osbrepository.default_context)

        return workflow.create_copy_task(
            image_name="workspaces-github-copy",
            workspace_id=workspace_id,
            folder=folder,
            url=self.uri,
            paths="\\".join(o.path.split(self.osbrepository.default_context)[1][1:] for o in origins),
            branch=self.osbrepository.default_context,
        )


if __name__ == '__main__':
    gha = GitHubAdapter('https://github.com/OpenSourceBrain/OSBv2')
    print(gha.get_resources('develop'))
