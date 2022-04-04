import workspaces.service.osbrepository as repository_service


def get_contexts(uri=None, repository_type=None, **kwargs):
    # get the branches of the repository
    try:
        contexts = repository_service.get_contexts(uri, repository_type)
        return contexts, 200
    except Exception as e:
        return str(e), 500


def get_keywords(uri=None, repository_type=None, **kwargs):
    """Get keywords/topics of the repository"""
    try:
        adapter = repository_service.get_repository_adapter(
            repository_type=repository_type, uri=uri
        )
        contexts = repository_service.get_contexts(uri, repository_type)
        # get default information
        keywords = adapter.get_tags(contexts[0])
        return keywords, 200
    except Exception as e:
        return str(e), 500


def get_description(uri=None, repository_type=None, **kwargs):
    """Get description for repository"""
    try:
        adapter = repository_service.get_repository_adapter(
            repository_type=repository_type, uri=uri
        )
        contexts = repository_service.get_contexts(uri, repository_type)
        # get default information
        description = adapter.get_description(contexts[0])
        return description, 200
    except Exception as e:
        return str(e), 500
