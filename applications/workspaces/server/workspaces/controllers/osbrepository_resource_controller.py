from workspaces.repository.model_repository import OSBRepositoryResourceRepository

def post(body, **kwargs):
    OSBRepositoryResourceRepository().post(body, **kwargs)
