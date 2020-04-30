"""Model Repository class"""

import math

from .database import db
from .models import *
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql import func
from open_alchemy import model_factory


class BaseModelRepository:
    """Generic base class for handling REST API endpoints."""

    model = None
    calculated_fields = None
    defaults = None
    search_qs = None

    def _get(self, id):
        """
        Query the model and get the record with the provided id

        Args:
            id: The object id to query from the repository

        Returns:
            repository record of the model
        """
        if id is not None:
            obj = self.model.query.filter_by(id=id).first()
            if obj:
                return obj, True
        return None, False

    def _calculated_fields_populate(self, obj):
        if self.calculated_fields:
            for fld in self.calculated_fields:
                setattr(obj, fld, getattr(self, fld)(obj.id))
        return obj

    def _pre_commit(self, new_obj):
        if hasattr(self, "pre_commit"):
            self.pre_commit(new_obj)

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
            if key not in ("id", "timestamp_created") and not key.startswith("_") and hasattr(obj, key):
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

    def _create_filter(self, field, comparator, value):
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
        if comparator == '==':
            return field == value
        elif comparator in ('!', 'not'):
            return field != value
        elif comparator == 'like':
            return field.like('%'+value+'%')
        else:
            return field == value

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
        if not self.search_qs:
            sqs = self.model.query
        else:
            sqs = eval(self.search_qs)
        if q:
            filters = []
            for arg in q.strip().split("+"):
                field_comparator, value = arg.strip().split('=')
                field, comparator = field_comparator.split('__')
                attr = getattr(self.model, field)
                if isinstance(attr.comparator.type, sqlalchemy.types.Boolean):
                    value = value.upper() in ('TRUE', '1', 'T')
                filters.append(self._create_filter(attr, comparator, value))
            sqs = sqs.filter(*filters)
        objects = sqs.paginate(page, per_page, True)
        total_objects = db.session.query(func.count(self.model.id)).scalar()
        for obj in objects.items:
            self._calculated_fields_populate(obj)
        total_pages = math.ceil(total_objects / per_page)
        return page, total_pages, objects

    def post(self, body):
        """Save an object to the repository."""
        new_obj = self.model.from_dict(**body)
        if new_obj.id is not None:
            tmp_obj, found = self._get(new_obj.id)
            if found:
                return "{} with id {} already exists.".format(self.model.__name__, new_obj.id), 400
            # POST means create new record so clear the current object ID
            new_obj.id = None

        if "timestamp_created" in self.model.__dict__:
            setattr(new_obj, "timestamp_created", func.now())

        if "timestamp_updated" in self.model.__dict__:
            setattr(new_obj, "timestamp_updated", func.now())

        if self.defaults:
            for fld, default in self.defaults.items():
                setattr(new_obj, fld, default)
        try:
            # trigger post operation
            self._pre_commit(new_obj)
            db.session.add(new_obj)
            db.session.commit()
        except IntegrityError as e:
            return "{}".format(e.orig), 400
        else:
            obj, found = self.get(id=new_obj.id)
            return obj, 201

    def get(self, id):
        """Get an object from the repository."""
        obj, found = self._get(id)
        return obj, found

    def put(self, body, id):
        """Update an object in the repository."""
        obj, found = self._get(id)
        if not found:
            return "{} with id {} not found.".format(self.model.__name__, id), 404

        new_obj = self.model.from_dict(**body)
        obj = self._copy_attrs(obj, new_obj)

        if hasattr(obj, "timestamp_updated"):
            setattr(obj, "timestamp_updated", func.now())

        self._pre_commit(obj)
        db.session.commit()
        return "Saved", 200

    def delete(self, id):
        """Delete an object from the repository."""
        result = self.model.query.filter_by(id=id).delete()
        if not result:
            return "{} with id {} not found.".format(self.model.__name__, id), 404
        db.session.commit()
        return 200
