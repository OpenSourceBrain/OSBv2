import requests

from workspaces.models import RepositoryResourceNode, RepositoryResource

from .utils import add_to_tree

class FigShareAdapter:
    def __init__(self, uri):
        self.uri = uri

    def get_contexts(self):
        return list([])

    def get_resources(self, context):
        contents = {"tree": []}

        tree = RepositoryResourceNode(RepositoryResource(name="/"), children=[])
        for git_obj in contents["tree"]:
            add_to_tree(tree, git_obj["path"].split("/"))

        return tree
