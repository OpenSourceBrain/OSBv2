import os

from flask import request, current_app
from sqlalchemy import asc, desc
from sqlalchemy.sql import func

from cloudharness import log as logger
from cloudharness.service import pvc

from ..auth import auth_client
from ..config import Config
from ..utils import get_keycloak_data

from .base_model_repository import BaseModelRepository
from .database import db
from .models import OSBRepositoryContext, Workspace, GITRepository, FigshareRepository, VolumeStorage, \
    WorkspaceImage, WorkspaceResource, TWorkspaceResource, TWorkspace, \
    OSBRepositoryResource
from .utils import *
from ..service.kubernetes import create_persistent_volume_claim

from workspaces.models.repository_content_type import RepositoryContentType


repository_content_type_enum = get_class_attr_val(RepositoryContentType())


class OwnerModel():

    @property
    def keycloak_user_id(self):
        try:
            return auth_client.get_current_user().get('id', None)
        except:
            # TODO: for debugging purpose remove this and return "-1"
            return "80a361f1-221e-4b4d-8440-0ba0b6ec32ef"

    def pre_commit(self, obj):
        logger.debug(f'Pre Commit for {obj} id: {obj.id}')
        if not obj.id:
            obj.user_id = self.keycloak_user_id
        return obj


class WorkspaceRepository(BaseModelRepository, OwnerModel):
    model = Workspace
    defaults = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def get_pvc_name(self, workspace_id):
        return f'workspace-{workspace_id}'

    def get(self, id):
        workspace: TWorkspace = self.model.query.get(id)
        if workspace.publicable or (workspace.owner and workspace.owner.keycloak_id == self.keycloak_user_id):
            return workspace
        return None

    def search_qs(self, filter=None, q=None):

        q_base = self.model.query

        keycloak_user_id = self.keycloak_user_id
        if filter is not None:
            q_base = q_base.filter(*[self._create_filter(*f) for f in filter])
        if filter and any(field for field, condition, value in filter if field.key == 'publicable' and value):
            q1 = q_base
        elif keycloak_user_id is not None:
            if not auth_client.current_user_has_realm_role('administrator'):
                logger.debug(
                    "searching workspaces on keycloak_user_id: %s", keycloak_user_id)
                # non admin users can see only their own workspaces
                q1 = q_base.filter_by(user_id=keycloak_user_id)
                q1 = q1.union(q_base.filter(
                    Workspace.collaborators.any(user_id=keycloak_user_id)))
            else:
                q1 = q_base
        else:
            q1 = q_base.filter_by(publicable=True)
        return q1.order_by(desc(Workspace.timestamp_updated))

    def delete(self, id):
        resource_repository = WorkspaceResourceRepository()
        workspace = self.model.query.filter_by(id=id).first()

        for resource in workspace.resources:
            logger.debug("deleting resource %s", resource.id)
            resource_repository.delete(resource.id)
        logger.info("deleting workspace %s", id)
        super().delete(id)
        logger.info("deleted workspace %s", id)
        logger.info("deleting volume %s", id)
        pvc.delete_persistent_volume_claim(f"workspace-{id}")
        logger.info("deleted volume %s", id)

    def pre_commit(self, workspace):
        workspace = super().pre_commit(workspace)
        return workspace

    def post_commit(self, workspace):
        # Create a new Persistent Volume Claim for this workspace
        logger.debug(f'Post Commit for workspace id: {workspace.id}')
        create_persistent_volume_claim(name=self.get_pvc_name(
            workspace.id), size='2Gi', logger=logger)
        wsrr = WorkspaceResourceRepository()
        for workspace_resource in workspace.resources:
            wsr = wsrr.post_commit(workspace_resource)
            if wsr:
                db.session.add(wsr)
                db.session.commit()
        return workspace


class OSBRepositoryRepository(BaseModelRepository, OwnerModel):
    model = GITRepository

    def search_qs(self, filter=None, q=None):
        # query all repository types, use union to get pagination also to work with filters
        query_list = [GITRepositoryRepository(), FigshareRepositoryRepository()]

        rs = None
        for osb_repository in query_list:
            if q is not None:
                query = osb_repository._get_qs(osb_repository.filters(q))
            else:
                query = osb_repository._get_qs()
            if not rs:
                rs = query
            else:
                rs = rs.union(query)
        return rs.order_by(asc(GITRepository.name))

    def pre_commit(self, osb_repository):
        osb_repository = super().pre_commit(osb_repository)
        for value in osb_repository.repository_content_types.split(","):
            if value not in repository_content_type_enum.values():
                raise Exception("Invalid value in Repository Content Types")
        return osb_repository

class OSBRepositoryResourceRepository(BaseModelRepository):
    model = OSBRepositoryResource

    def post(self, body, **kwargs):
        repository_id = body["osbrepository_id"]
        context_name = body["context_name"]
        full_filename = body["full_filename"]
        uid = body["uid"]

        osbr = OSBRepositoryRepository().get(repository_id)

        context = None
        for c in osbr.used_contexts:
            if c.name == context_name:
                context = c
                break
        osbrr = OSBRepositoryResource(name=full_filename, uid=uid)
        if not context:
            context = OSBRepositoryContext(name=context_name)
            osbr.used_contexts.append(context)
        context.resources.append(osbrr)
        OSBRepositoryRepository().save(osbr)


class OSBRepositoryContextRepository(BaseModelRepository):
    model = OSBRepositoryContext


class VolumeStorageRepository(BaseModelRepository):
    model = VolumeStorage


class GITRepositoryRepository(OSBRepositoryRepository):
    model = GITRepository

    def _get_qs(self, filter=None, q=None):
        """
        Helper function to get the queryset

        Args:
            filter: optional extra filter for the qs
        """
        sqs = self.model.query
        if filter:
            sqs = sqs.filter(*[self._create_filter(*f) for f in filter])
        return sqs

    def pre_commit(self, git_repository):
        git_repository = super().pre_commit(git_repository)
        logger.debug(f'Pre Commit for GIT repository id: {git_repository.id}')
        git_repository.repository_type = "github"
        return git_repository


class FigshareRepositoryRepository(OSBRepositoryRepository):
    model = FigshareRepository

    def _get_qs(self, filter=None, q=None):
        """
        Helper function to get the queryset

        Args:
            filter: optional extra filter for the qs
        """
        sqs = self.model.query
        if filter:
            sqs = sqs.filter(*[self._create_filter(*f) for f in filter])
        return sqs

    def pre_commit(self, figshare_repository):
        logger.debug(f'Pre Commit for FIG repository id: {figshare_repository.id}')
        figshare_repository = super().pre_commit(figshare_repository)
        figshare_repository.repository_type = "figshare"
        return figshare_repository


class VolumeStorageRepository(BaseModelRepository):
    model = VolumeStorage


class WorkspaceImageRepository(BaseModelRepository):
    model = WorkspaceImage


class WorkspaceResourceRepository(BaseModelRepository):
    model = WorkspaceResource

    @staticmethod
    def guess_resurce_type(resource_path):
        resource_path = resource_path.split('?')[0]
        if resource_path[-3:] == "nwb":
            return "e"
        elif resource_path[-3:] == "np":
            return 'g'
        return 'g'

    def pre_commit(self, workspace_resource: TWorkspaceResource):
        # Check if we can determine the resource type
        logger.debug(
            f'Pre Commit for workspace resource id: {workspace_resource.id}')
        if not workspace_resource.resource_type or workspace_resource.resource_type == 'u':
            workspace_resource.resource_type = self.guess_resurce_type(
                workspace_resource.location)
        if workspace_resource.folder is None or len(workspace_resource.folder) == 0:
            workspace_resource.folder = workspace_resource.name
        return workspace_resource

    def post_commit(self, workspace_resource: TWorkspaceResource):
        # Create a load WorkspaceResource workflow task
        logger.debug(
            f'Post Commit for workspace resource id: {workspace_resource.id}')
        workspace = WorkspaceRepository().get(id=workspace_resource.workspace_id)
        if workspace_resource.folder is None:
            logger.debug(
                f'Pre Commit for workspace resource id: {workspace_resource.id} setting folder from file name')
            workspace_resource.folder = workspace_resource.name

        if workspace is not None and workspace_resource.status == 'p' and 'http' == workspace_resource.location[0:4]:
            logger.debug('Starting resource ETL from %s',
                         workspace_resource.location)
            try:
                from ..service.workflow import add_resource
                add_resource(workspace, workspace_resource)
            except Exception as e:
                logger.error(
                    "An error occurred while adding the default resource to the workspace", exc_info=True)
                return workspace_resource
        return workspace_resource

    def post_get(self, workspace_resource):
        workspace = WorkspaceRepository().get(id=workspace_resource.workspace_id)

        return workspace_resource

    def open(self, workspace_resource):
        # test if workspace resource status is "available"
        if workspace_resource.status != "a":
            return f"WorkspaceResource with id {workspace_resource.id} is not yet available for opening. Please wait until the status is a(vailable)", 422

        workspace_resource.timestamp_last_opened = func.now()
        workspace = WorkspaceRepository().get(id=workspace_resource.workspace_id)
        if workspace is not None:
            workspace.last_opened_resource_id = workspace_resource.id
        db.session.add(workspace_resource)
        db.session.add(workspace)
        db.session.commit()

        return "Saved", 200

    def delete(self, id):
        """Delete an object from the repository."""
        resource: TWorkspaceResource = self.get(id)
        super().delete(id)

        try:
            from ..service.workflow import delete_resource
            delete_resource(resource.workspace_id, resource.folder)
        except Exception as e:
            logger.error(
                "An error occurred while deleting resource from the workspace", exc_info=True)
            return None
