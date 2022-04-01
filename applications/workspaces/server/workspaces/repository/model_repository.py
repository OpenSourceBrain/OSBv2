import json
import os
import shutil

from types import SimpleNamespace

from cloudharness import log as logger
from cloudharness.service import pvc
from sqlalchemy import desc, or_
from sqlalchemy.sql import func


from workspaces.config import Config
from workspaces.models import RepositoryContentType, ResourceStatus, User, Tag


from .base_model_repository import BaseModelRepository
from ..database import db
from .models import OSBRepositoryEntity, VolumeStorage, WorkspaceEntity, WorkspaceImage, WorkspaceResourceEntity, Tag
from .utils import *


repository_content_type_enum = get_class_attr_val(RepositoryContentType())


class OwnerModel:

    def pre_commit(self, obj):
        logger.debug(f"Pre Commit for {obj} id: {obj.id}")
        return obj


class WorkspaceRepository(BaseModelRepository, OwnerModel):
    model = WorkspaceEntity
    defaults = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def get(self, id):
        workspace = self._get(id)
        return workspace

    def search_qs(self, filter=None, q=None, tags=None, user_id=None, show_all=False, *args, **kwargs):
        q_base = self.model.query
        if filter is not None:
            if tags:
                q_base = q_base.filter(
                    *[self._create_filter(*f) for f in filter if f[0].key == "name"] )
                q_base = q_base.union(self.model.query.join(self.model.tags).filter(
                    func.lower(Tag.tag).in_(func.lower(t) for t in tags.split("+"))))
           
            q_base = q_base.filter(
                    *[self._create_filter(*f) for f in filter if f[0].key != "name"])
        elif tags:
            q_base = q_base.join(self.model.tags).filter(
                func.lower(Tag.tag).in_(func.lower(t) for t in tags.split("+")))

        if filter and any(field for field, condition, value in filter if field.key == "publicable" and value):
            q1 = q_base

        elif user_id is not None:
            # Admins see all workspaces, non admin users can see only their own workspaces or shared with them
            if not show_all:
                q1 = q_base.filter_by(user_id=user_id)
                q1 = q1.union(q_base.filter(
                    WorkspaceEntity.collaborators.any(user_id=user_id)))
            else:
                q1 = q_base
        else:
            # No logged in user, show only public (in case was not specified)
            q1 = q_base.filter(WorkspaceEntity.publicable == True)

        return q1.order_by(desc(WorkspaceEntity.timestamp_updated))

    def delete(self, id):
        super().delete(id)

    def pre_commit(self, workspace):
        workspace.tags = TagRepository().get_tags_daos(workspace.tags)
        return super().pre_commit(workspace)

    def post_commit(self, workspace):
        # Create a new Persistent Volume Claim for this workspace
        logger.debug(f"Post Commit for workspace id: {workspace.id}")

        wsrr = WorkspaceResourceRepository()
        for workspace_resource in workspace.resources:
            wsr = wsrr.post_commit(workspace_resource)
            if wsr:
                db.session.add(wsr)
                db.session.commit()
        return workspace


class OSBRepositoryRepository(BaseModelRepository, OwnerModel):
    model = OSBRepositoryEntity


    def pre_commit(self, osbrepository):
        osbrepository.tags = TagRepository().get_tags_daos(osbrepository.tags)
        return super().pre_commit(osbrepository)

    def search_qs(self, filter=None, q=None, tags=None, types=None):
        q_base = self.model.query
        if tags:
            q_base = q_base.join(self.model.tags).filter(
                Tag.tag.in_(tags.split("+")))
        if filter:
            q_base = q_base.filter(
                or_(*[self._create_filter(*f) for f in filter]))

        if types:
            q_base = q_base.filter(
                or_(self.model.content_types.ilike(f"%{t}%") for t in types.split("+")))
        return q_base.order_by(desc(OSBRepositoryEntity.timestamp_updated))


class VolumeStorageRepository(BaseModelRepository):
    model = VolumeStorage


class VolumeStorageRepository(BaseModelRepository):
    model = VolumeStorage


class WorkspaceImageRepository(BaseModelRepository):
    model = WorkspaceImage


class TagRepository(BaseModelRepository):
    model = Tag

    def get_tags_daos(self, tags):
        tags_list = []
        for tag in tags:
            z = tag.tag
            items = self.search(q=f"tag__={z}").items
            if len(items) > 0:
                # if found reference to the tag
                tag = items[0]
            tags_list.append(tag)
        return tags_list


class WorkspaceResourceRepository(BaseModelRepository):
    model = WorkspaceResourceEntity

    def update_workspace_resources(self, workspace_id, resources):
        # update the wsr based on found resources in the pvc

        # select all existing workspace resources of the workspace
        all_wsr = self.model.query.filter_by(workspace_id=workspace_id).all()
        found_wsr = []  # array for storing found wsr, used for deletion detection
        for resource in resources:
            folder, filename = os.path.split(resource)
            # try to find by folder and name match
            wsr = next((wsr for wsr in all_wsr if wsr.folder ==
                        folder and wsr.name == filename), None)
            if not wsr:
                # not found, try by folder and "like" path
                wsr = next((wsr for wsr in all_wsr if wsr.folder ==
                            folder and filename in wsr.origin), None)
            if not wsr:
                # not found --> create a new wsr
                wsr = WorkspaceResourceEntity(
                    name=filename,
                    folder=folder,
                    origin='{"path": "' + resource + '"}',
                    status=ResourceStatus.P,  # default status
                    resource_type=self.guess_resource_type(filename),
                    workspace_id=workspace_id,
                )
                logger.info(
                    f"Created new workspace resources {filename} {folder} {resource}")
            else:
                found_wsr.append(wsr)  # add the wsr to the found list

            if wsr.status != ResourceStatus.A:
                # set wsr to active and write to database
                wsr.status = ResourceStatus.A
                db.session.add(wsr)
                db.session.commit()

        for wsr in [wsr for wsr in all_wsr if wsr not in found_wsr]:
            # delete non existing workspace resources
            logger.info(f"Deleting resource: {wsr.id} {wsr.name} {wsr.folder}")
            result = self.model.query.filter_by(id=wsr.id).delete()
            db.session.commit()
        logger.info(
            f"Workspace resources update done for workspace {workspace_id}")

    @staticmethod
    def guess_resource_type(resource_path):
        resource_path = resource_path.split("?")[0]
        if resource_path[-3:] == "nwb":
            return "e"
        elif resource_path[-3:] == "np":
            return "g"
        return "g"

    def pre_commit(self, workspace_resource):
        # Check if we can determine the resource type
        logger.debug(
            f"Pre Commit for workspace resource id: {workspace_resource.id}")

        if not workspace_resource.resource_type or workspace_resource.resource_type == "u":
            origin = json.loads(workspace_resource.origin)
            workspace_resource.resource_type = self.guess_resource_type(
                origin.get("path"))
        if workspace_resource.folder is None or len(workspace_resource.folder) == 0:
            workspace_resource.folder = workspace_resource.name
        return workspace_resource

    def post_commit(self, workspace_resource):
        # Create a load WorkspaceResource workflow task
        logger.debug(
            f"Post Commit for workspace resource id: {workspace_resource.id}")
        workspace = WorkspaceRepository().get(workspace_resource.workspace_id)
        if workspace_resource.folder is None:
            logger.debug(
                f"Pre Commit for workspace resource id: {workspace_resource.id} setting folder from file name")
            workspace_resource.folder = workspace_resource.name

        if (
            workspace is not None
            and workspace_resource.status == "p"
            and workspace_resource.origin
            and len(workspace_resource.origin) > 0
        ):
            from workspaces.helpers.etl_helpers import copy_workspace_resource
            copy_workspace_resource(workspace_resource)
        return workspace_resource

    def post_get(self, workspace_resource):
        workspace = WorkspaceRepository().get(id=workspace_resource.workspace_id)

        return workspace_resource

    def open(self, workspace_resource):
        # test if workspace resource status is "available"
        if workspace_resource.status != "a":
            return (
                f"WorkspaceResource with id {workspace_resource.id} is not yet available for opening. Please wait until the status is a(vailable)",
                422,
            )

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
        workspace_resource = self.get(id)
        super().delete(id)