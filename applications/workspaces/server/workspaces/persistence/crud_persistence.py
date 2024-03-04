import json
import os
import shutil

import workspaces.service.osbrepository as repository_service

from types import SimpleNamespace

from cloudharness import log as logger
from cloudharness.service import pvc
from sqlalchemy import desc, or_, and_
from sqlalchemy.sql import func


from workspaces.config import Config
from workspaces.models import RepositoryContentType, ResourceStatus, User, Tag
from workspaces.utils import guess_resource_type


from .base_crud_persistence import BaseModelRepository
from ..database import db
from .models import OSBRepositoryEntity, VolumeStorage, WorkspaceEntity, WorkspaceImage, WorkspaceResourceEntity, Tag
from .utils import *


repository_content_type_enum = get_class_attr_val(RepositoryContentType())


class OwnerModel:

    pass


class WorkspaceRepository(BaseModelRepository, OwnerModel):
    model = WorkspaceEntity
    defaults = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def get(self, id):
        workspace = self._get(id)
        return workspace
    
    def post(self, entity):
        workspace: WorkspaceEntity = super().post(entity)
        return workspace


    def check(self):
        self.model.query.count()

    def search_qs(self, filter=None, q=None, tags=None, user_id=None, show_all=False, *args, **kwargs):
        q_base = self.model.query
        q_base = self.filter_by_user_and_fieldkey(
            filter, user_id, show_all, q_base)

        if filter is None:
            if tags:
                q_base = self.filter_by_tags(tags, q_base)
        else:
            q_base_by_name_description = self.filter_by_name_description(
                filter, q_base)
            q_base = self.filter_by_search_tags(
                filter, q_base, q_base_by_name_description)

            if tags:
                q_base = q_base.intersect(self.filter_by_tags(tags, q_base))

            q_base = self.filter_by_publicable_and_featured(filter, q_base)

        return q_base.order_by(desc(WorkspaceEntity.timestamp_updated))

    def filter_by_publicable_and_featured(self, filter, q_base):
        q_base = q_base.filter(
            and_(*[self._create_filter(*f) for f in filter if (f[0].key == "publicable" or f[0].key == "featured")]))
        return q_base

    def filter_by_user_and_fieldkey(self, filter, user_id, show_all, q_base):
        if filter and any(field for field, condition, value in filter if field.key == "publicable" and value):
            pass
        elif user_id is not None:
            # Admins see all workspaces, non admin users can see only their own workspaces or shared with them
            if not show_all:
                q_base = q_base.filter_by(user_id=user_id)
                q_base = q_base.union(self.model.query.filter(
                    WorkspaceEntity.collaborators.any(user_id=user_id)))
            else:
                q_base = q_base
        else:
            # No logged in user, show only public (in case was not specified)
            q_base = q_base.filter(WorkspaceEntity.publicable == True)
        
        # if filter has user_id, then filter it with the user_id
        if filter and any(field for field, condition, value in filter if field.key == "user_id"):
            q_base = q_base.filter(
                *[self._create_filter(*f) for f in filter if (f[0].key == "user_id")])
        return q_base

    def filter_by_tags(self, tags, q_base):
        q_base = q_base.join(self.model.tags)
        q_base = q_base.intersect(
            *[q_base.filter(func.lower(Tag.tag) == func.lower(i_tag)) for i_tag in tags.split("+")])

        return q_base

    def filter_by_search_tags(self, filter, q_base, q_base_by_name_description):
        search_tags = self.tags_from_search(filter)
        q_base = q_base_by_name_description.union(q_base.join(self.model.tags).filter(
            func.lower(Tag.tag).in_(func.lower(t) for t in search_tags.split("+"))))

        return q_base

    def tags_from_search(self, filter):
        tags = ''
        for field, condition, value in filter:
            if field.key == "name":
                tags = value.replace("+", "").replace("%", "")
                break
        return tags

    def filter_by_name_description(self, filter, q_base):
        return q_base.filter(
            or_(*[self._create_filter(*f) for f in filter if (f[0].key == "name" or f[0].key == "description")]))

    def delete(self, id):
        super().delete(id)


class OSBRepositoryRepository(BaseModelRepository, OwnerModel):
    model = OSBRepositoryEntity

    def get(self, id):
        repository = self._get(id)
        adapter = repository_service.get_repository_adapter(
            repository_type=repository.repository_type, uri=repository.uri
        )
        repository.uri = adapter.get_base_uri()
        return repository

    def search_qs(self, filter=None, q=None, tags=None, types=None, user_id=None):
        q_base = self.model.query
        if user_id is not None:
            q_base = q_base.filter_by(user_id=user_id)

        if filter is None:
            if tags:
                q_base = self.filter_by_tags(tags, q_base)
        else:
            q_base_by_q = self.filter_by_qfilters(filter, q_base)
            q_base = self.filter_by_search_tags(filter, q_base, q_base_by_q)
            if tags:
                q_base = q_base.intersect(self.filter_by_tags(tags, q_base))

        if types is not None:
            q_base = q_base.filter(
                or_(self.model.content_types.ilike(f"%{t}%") for t in types.split("+")))

        return q_base.order_by(desc(OSBRepositoryEntity.timestamp_updated))

    def filter_by_qfilters(self, filter, q_base):
        q_base = q_base.filter(
            or_(*[self._create_filter(*f) for f in filter]))
        return q_base

    def filter_by_tags(self, tags, q_base):
        q_base = q_base.join(self.model.tags)
        q_base = q_base.intersect(
            *[q_base.filter(func.lower(Tag.tag) == func.lower(i_tag)) for i_tag in tags.split("+")])

        return q_base

    def filter_by_search_tags(self, filter, q_base, q_base_by_q):
        search_tags = self.tags_from_search(filter)
        q_base = q_base_by_q.union(q_base.join(self.model.tags).filter(
            func.lower(Tag.tag).in_(func.lower(t) for t in search_tags.split("+"))))
        return q_base

    def tags_from_search(self, filter):
        tags = ''
        for field, condition, value in filter:
            if field.key == "name":
                tags = value.replace("+", "").replace("%", "")
                break
        return tags


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

        found_wsr = []  # array for storing found wsr, used for deletion detection
        for resource in resources:
            # try to find by path match
            wsr = self.model.query.filter_by(workspace_id=workspace_id, folder=resource).first()

            if not wsr:
                # not found --> create a new wsr
                filename = os.path.basename(resource)
                wsr = WorkspaceResourceEntity(
                    name=filename if not "index" in filename else os.path.basename(os.path.dirname(resource)),
                    folder=resource,
                    origin='{"path": "' + resource + '"}',
                    status=ResourceStatus.P,  # default status
                    resource_type=guess_resource_type(filename),
                    workspace_id=workspace_id,
                )
                logger.info(
                    f"Created new workspace resource {resource}")
            
            found_wsr.append(wsr)  # add the wsr to the found list

            if wsr.status != ResourceStatus.A:
                # set wsr to active and write to database
                wsr.status = ResourceStatus.A
                db.session.add(wsr)
                db.session.commit()

        # delete all wsr that were not found an more
        self.model.query.filter_by(workspace_id=workspace_id)\
            .filter(~self.model.id.in_(w.id for w in found_wsr)).delete()
        # TODO test again after the refactoring
        db.session.commit()
        logger.info(
            f"Workspace resources update done for workspace {workspace_id}")





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
