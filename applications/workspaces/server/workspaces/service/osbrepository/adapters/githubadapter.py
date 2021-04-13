import base64
import requests
import cloudharness

from workspaces.models import RepositoryResourceNode, GITRepositoryResource

from .utils import add_to_tree

logger = cloudharness.log


def _clean_url_and_end_with_slash(url):
    first_part = url[:7]  # https:/
    second_part = url[7:] + "/"  # /host/path
    while '//' in second_part:
        second_part = second_part.replace("//", "/")
    return first_part + second_part

class GitHubAdapter:
    def __init__(self, uri):
        self.url = uri
        self.api_url = _clean_url_and_end_with_slash(uri.replace("https://github.com/","https://api.github.com/repos/"))
        self.download_base_url = _clean_url_and_end_with_slash(uri.replace("https://github.com/","https://raw.githubusercontent.com/"))

    def get_contexts(self):
        branches = requests.get(self.api_url + "branches").json()
        tags = requests.get(self.api_url + "tags").json()
        return list([context["name"] for context in branches + tags])

    def get_resources(self, context):
        repo_files = self.api_url + "git" + "/" + "trees" + "/" + context + "?recursive=1"
        contents = requests.get(repo_files).json()

        tree = RepositoryResourceNode(resource=GITRepositoryResource(name="/"), children=[])
        for git_obj in contents["tree"]:
            download_url = f"{self.download_base_url}{context}/{git_obj['path']}"
            add_to_tree(
                tree=tree,
                tree_path=git_obj["path"].split("/"),
                path=download_url,
                sha=git_obj["sha"],
                ref=context
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
        file = requests.get(f"{self.api_url}contents/{path}?ref={context}").json()
        return file["sha"]

    def get_description(self, context):
        try:
            url = f"{self.api_url}readme?ref={context}"
            result = requests.get(url).json()
            description = base64.b64decode(result["content"]).decode('utf-8')
            return description
        except Exception as e:
            return e

    def copy_resource(self, origin):
        repository_resource = GITRepositoryResource(**origin)
        logger.info("Processiong copy GIT Repository Resource %s", repository_resource)
