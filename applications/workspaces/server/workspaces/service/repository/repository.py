from .gitrepository import GitRepository


def get_repository_service(repository):
    if repository.repository_type == "g":
        return GitRepository(repository)
    return None


def get_branches(repository):
    repository_service = get_repository_service(repository)
    return repository_service.get_branches()


def get_context(repository):
    repository_service = get_repository_service(repository)
    return repository_service.get_context()
