import json
import requests

from collections import defaultdict
from workspaces.models import RepositoryContextNode

from .utils import add_to_tree

def tree(): return defaultdict(tree)

class GitRepository:
    def __init__(self, repository):
        self.repository = repository
        self.repo_url = repository.url.replace("https://github.com/"," https://api.github.com/repos/")

    def get_branches(self):
        branches = requests.get(self.repo_url + "/" + "branches").json()
        return list([branch["name"] for branch in branches])

    def get_context(self, branch=None):
        if not branch:
            branch = self.repository.default_branch

        repo_files = self.repo_url + "/" + "git" + "/" + "trees" + "/" + branch + "?recursive=1"
        contents = requests.get(repo_files).json()

        tree = RepositoryContextNode(name="/", children=[])
        for git_obj in contents["tree"]:
            add_to_tree(tree, git_obj["path"].split("/"))

        return tree
