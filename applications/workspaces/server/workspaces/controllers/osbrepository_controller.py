import workspaces.service.osbrepository as repository_service


def get_contexts(uri=None, repository_type=None, **kwargs):
    # get the branches of the repository
    try:
        contexts = repository_service.get_contexts(uri, repository_type)
        return contexts, 200
    except Exception as e:
        return str(e), 500

