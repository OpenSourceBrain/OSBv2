from .gitrepository import GitRepository


def get_repository_service(repository_type, *args, **kwargs):
    if repository_type == "github":
        return GitRepository(*args, **kwargs)
    return None


def get_contexts(uri, repository_type):
    repository_service = get_repository_service(repository_type=repository_type, uri=uri)
    return repository_service.get_contexts()


def get_resources(repository, context=None):
    repository_service = get_repository_service(
        repository_type=repository.repository_type,
        uri=repository.uri)
    if not context:
        context = repository.default_context
    return repository_service.get_resources(context)
