from cloudharness import log as logger

from workspaces.models import DandiRepositoryResource, RepositoryResource, RepositoryResourceNode

from .utils import add_to_tree

class DandiAdapter:
    def __init__(self, osbrepository):
        self.osbrepository = osbrepository

    def get_contexts(self):
        return list([])

    def get_resources(self, context):
        contents = {"tree": []}

        tree = RepositoryResourceNode(RepositoryResource(name="/"), children=[])
        for git_obj in contents["tree"]:
            add_to_tree(tree, git_obj["path"].split("/"), osbrepository_id=self.osbrepository.id)

        return tree

    def get_latest_hash(self, download_url):
        return 123

    def get_description(self, context):
        return "Description"

    def create_copy_task(self, name, folder, path):
        name = name if name != "/" else self.osbrepository.name
        folder = self.osbrepository.name + path.replace(self.download_base_url + "branches", "")
        folder = folder[: folder.rfind("/")]
        # do something...
