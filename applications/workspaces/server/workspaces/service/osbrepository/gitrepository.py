import json
import requests

from collections import defaultdict
from workspaces.models import RepositoryResourceNode, RepositoryResource

from .utils import add_to_tree

class GitRepository:
    def __init__(self, uri):
        self.uri = uri.replace("https://github.com/","https://api.github.com/repos/")

    def get_contexts(self):
        branches = requests.get(self.uri + "/" + "branches").json()
        tags = requests.get(self.uri + "/" + "tags").json()
        return list([context["name"] for context in branches + tags])

    def get_resources(self, context):
        repo_files = self.uri + "/" + "git" + "/" + "trees" + "/" + context + "?recursive=1"
        contents = requests.get(repo_files).json()

        tree = RepositoryResourceNode(RepositoryResource(name="/"), children=[])
        for git_obj in contents["tree"]:
            add_to_tree(tree, git_obj["path"].split("/"))

        return tree
