import re
import sys
from typing import List
import requests

from cloudharness import log as logger
from workspaces.models import RepositoryResourceNode, RepositoryInfo
from workspaces.models.resource_origin import ResourceOrigin
from workspaces.models.biomodels_repository_resource import BioModelsRepositoryResource

from .utils import add_to_tree




class BioModelsAdapter:
    """
    Adapter for FigShare

    https://docs.figshare.com/
    """

    def __init__(self, osbrepository, uri=None):
        self.osbrepository = osbrepository
        self.uri = uri if uri else osbrepository.uri
        # even for different figshare "instances", the IDs remain the same, and
        # there's only one API end point
        self.api_url = ...



    def get_contexts(self):
        ...

    def get_resources(self, context):
        ...


    def get_description(self, context):
        ...

    def get_tags(self, context):
        ...

    def create_copy_task(self, workspace_id, origins: List[ResourceOrigin]):
        tasks = []
        import workspaces.service.workflow as workflow
        for origin in origins:
            path = origin.path
            # no file tree in FigShare
            folder = self.osbrepository.name


            # username / password are optional and future usage,
            # e.g. for accessing non public repos
            tasks.append(workflow.create_copy_task(
                image_name="workspaces-biomodels-copy",
                workspace_id=workspace_id,
                folder=folder,
                url=path,
                username="",
                password="",
            ))
        return tasks
