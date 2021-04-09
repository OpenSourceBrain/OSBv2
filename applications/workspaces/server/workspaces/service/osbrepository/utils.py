from workspaces.models import RepositoryResourceNode, RepositoryResource

def find_in_tree(t, name):
    for idx, item in enumerate(t):
        if item.resource.name == name:
            return item
    raise ValueError(f"{name} not in list")

def add_to_tree(tree, path):
    for p in path:
        try:
            tree = find_in_tree(tree.children, p)
        except ValueError:
            node = RepositoryResourceNode(RepositoryResource(name=p), children=[])
            tree.children.append(node)
            tree = node