"""
Base CRUD logic for application models
"""

import re

from cloudharness import log as logger
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql import func

from ..database import db
from .models import *


class BaseModelRepository:
    """Generic base class for handling REST API endpoints."""

    model = None

    defaults = None
    search_qs = None

    def __init__(self, model=None):
        if model:
            self.model = model
        

    def _get(self, id):
        """
        Query the model and get the record with the provided id

        Args:
            id: The object id to query from the repository

        Returns:
            repository record of the model
        """
        if id is not None:
            return self.model.query.get(id)
        return None

    def _get_and_copy_item(self, item):
        item_db = item.query.filter_by(id=item.id).first()
        if item_db:
            item = self._copy_attrs(item_db, item)
        return item

    def _copy_attrs(self, cur_obj, new_obj):
        """
        Recursive copy of all data related attributes from the new object to the currect object
        """
        for key in new_obj.__dict__:
            if key not in ("id", "timestamp_created") and not key.startswith("_") and hasattr(cur_obj, key):
                if isinstance(getattr(cur_obj, key), list):
                    # copy the list and check if the items already exist if so update them else create them
                    new_obj_list = []
                    for new_item in getattr(new_obj, key):
                        new_item = self._get_and_copy_item(new_item)
                        new_obj_list.append(new_item)
                    setattr(cur_obj, key, new_obj_list)
                elif isinstance(getattr(cur_obj, key), db.Model):
                    # copy the object if the object exists then update else create
                    new_item = self._get_and_copy_item(getattr(new_obj, key))
                    setattr(cur_obj, key, self._copy_attrs(
                        getattr(cur_obj, key), new_item))
                else:
                    # just copy the value
                    setattr(cur_obj, key, getattr(new_obj, key))
        return cur_obj

    

    def _create_filter(self, field, comparator, value, entity=None):
        """
        Helper function for creating the criterion for SQL Alchemy

        Args:
            field: the database field
            comparator: the comparator
            value: the search value

        Returns:
            SQL Alchemy Filter

        Implemented comparators are:
            = or ==     - equals
            ! or not    - not equals
            like        - text matches, wildcards: % match any n chars, ? match one char
                            a % will be added at the start and the end of the match string

        Usage examples:
            q=id=3 (id equals to 3)
            q=name__like=My%Name (search all records where name matches %My%Name%)
            q=id__!=10 (id is not 10)
        """

        logger.debug("Search for %s filter: %s %s %s",
                     self.model, field, comparator, value)
        if comparator == "==":
            return field == value
        elif comparator in ("!", "not"):
            return field != value
        elif comparator == "like":
            # ilike makes the search case insensitive
            return field.ilike("%" + value + "%")
        else:
            return field == value

    def _get_qs(self, filter=None, q=None, *args, **kwargs):
        """
        Helper function to get the queryset

        Args:
            filter: optional extra filter for the qs
        """
        if not self.search_qs:
            sqs = self.model.query
            if filter:
                sqs = sqs.filter(*[self._create_filter(*f) for f in filter])
        else:
            if isinstance(self.search_qs, str):
                sqs = eval(self.search_qs)
            else:
                sqs = self.search_qs(filter, q, *args, **kwargs)
        return sqs

    def filters(self, q=None):
        filters = []
        for arg in q.strip().split("+"):
            field_comparator, value = arg.strip().split("=")
            field_comparator = field_comparator.split("__")
            field = field_comparator[0]
            comparator = field_comparator[1] if len(
                field_comparator) > 1 else "="
            related_attr = re.compile(r"(.*)\[(.*)\]").match(field)
            if related_attr:
                attr = getattr(self.model, related_attr.group(1))
                attr = attr.property.entity.class_manager.local_attrs.get(
                    related_attr.group(2))
            else:
                attr = getattr(self.model, field)
                if isinstance(attr.comparator.type, sqlalchemy.types.Boolean):
                    value = value.upper() in ("TRUE", "1", "T")
            logger.debug("Filter attr: %s comparator: %s value: %s",
                         attr.key, comparator, value)
            if isinstance(attr.comparator, sqlalchemy.orm.relationships.RelationshipProperty.Comparator):
                # filter on sub query
                field = field_comparator[1]
                comparator = field_comparator[2] if len(
                    field_comparator) > 2 else "="
                attr = attr.property.entity.class_manager.local_attrs.get(
                    field)
            filters.append((attr, comparator, value))
        return filters

    def search(self, page=1, per_page=20, q=None, *args, **kwargs):
        """
        Query the model and return all records

        Args:
            page: The page number
            per_page: The number of records per page to limit
            q: query string for filter records. example q=name__like=Test%+type=N

        Returns:
            page, total_pages, objects
        """
        """Get all objects from the repository."""
        if q:
            logger.debug("Query %s", q)
            filters = self.filters(q)
            sqs = self._get_qs(filters, q, *args, **kwargs)
        else:
            sqs = self._get_qs(*args, **kwargs)
        objects = sqs.paginate(page=page, per_page=per_page)

        return objects
    
    def post(self, entity):
        """Save an object to the repository."""

        if entity.id is not None:
            tmp_obj = self._get(entity.id)
            if tmp_obj is not None:
                return f"{self.model.__name__} with id {id} already exists.", 400
            # POST means create new record so clear the current object ID
            entity.id = None

        if "timestamp_created" in self.model.__dict__:
            entity.timestamp_created = func.now()

        if "timestamp_updated" in self.model.__dict__:
            entity.timestamp_updated = func.now()

        if self.defaults:
            for fld, default in self.defaults.items():
                setattr(entity, fld, default)
        try:
            # trigger post operation
            db.session.add(entity)
            db.session.commit()
        except IntegrityError as e:
            raise e
        else:
            obj = self.get(id=entity.id)
            return obj

    def get(self, id):
        """Get an object from the repository."""
        obj = self._get(id)
        return obj

    def set_timestamp_updated(self, obj):
        if hasattr(obj, "timestamp_updated"):
            setattr(obj, "timestamp_updated", func.now())
        return obj
    
    def clone(self, id):
        """Clone an object from the repository."""
        obj = self._get(id)
        db.session.expunge(obj)
        from sqlalchemy.orm.session import make_transient
        make_transient(obj)
        obj.id = None
        return obj

    def save(self, obj):
        obj = self.set_timestamp_updated(obj)
        db.session.commit()
        return obj

    def put(self, body, id):
        """Update an object in the repository."""
        obj = self._get(id)
        if obj is None:
            return f"{self.model.__name__} with id {id} not found.", 404

        new_obj = body
        obj = self._copy_attrs(obj, new_obj)
        obj = self.set_timestamp_updated(obj)
        db.session.commit()
        return obj

    def delete(self, id):
        """Delete an object from the repository."""
        result = self.model.query.filter_by(id=id).first()
    
        if not result:
            return f"{self.model.__name__} with id {id} not found.", 404
        db.session.delete(result)
        return db.session.commit()

    def __str__(self):
        return self.model.__tablename__
