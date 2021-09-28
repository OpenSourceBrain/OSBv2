import base64
import requests
from cloudharness import log as logger
from cloudharness.utils.secrets import get_secret

import workspaces.service.workflow as workflow
from workspaces.models import GITRepositoryResource, RepositoryResourceNode

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

    def get_contexts(self):
        branches = self.get_json(self.api_url + "branches")
        tags = self.get_json(self.api_url + "tags")
        return [context["name"] for context in branches + tags]

    def get_resources(self, context):
        contents = self.get_json(
            f"{self.api_url}git/trees/{context}?recursive=1")

        tree = RepositoryResourceNode(
            resource=GITRepositoryResource(
                name="/",
                path=f"{self.download_base_url}branches/{context}",
                osbrepository_id=self.osbrepository.id,
                ref=context,
            ),
            children=[],
        )
        for git_obj in contents["tree"]:
            download_url = f"{self.download_base_url}branches/{context}/{git_obj['path']}"
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

    def get_tags(self, context):
        return []

    def create_copy_task(self, workspace_id, name, path):
        # download the resource
        name = name if name != "/" else self.osbrepository.name
        folder = self.osbrepository.name + \
            path.replace(self.download_base_url + "branches", "")
        folder = folder[: folder.rfind("/")]
        # username / password are optional and future usage,
        # e.g. for accessing non public repos
        return workflow.create_copy_task(
            image_name="workspaces-github-copy",
            workspace_id=workspace_id,
            name=name,
            folder=folder,
            path=path,
            username="",
            password="",
        )


if __name__ == '__main__':
    gha = GitHubAdapter('https://github.com/OpenSourceBrain/OSBv2')
    print(gha.get_resources('develop'))
