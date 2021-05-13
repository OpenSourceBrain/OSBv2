from workspaces.models import RepositoryResourceNode


def find_in_tree(t, name):
    for idx, item in enumerate(t):
        if item.resource.name == name:
            return item
    raise ValueError(f"{name} not in list")


def add_to_tree(tree, tree_path, **kwargs):
    for p in tree_path:
        try:
            tree = find_in_tree(tree.children, p)
        except ValueError:
            node = RepositoryResourceNode(resource=type(tree.resource)(name=p, **kwargs), children=[])
            tree.children.append(node)
            tree = node
