from flask.views import MethodView
from flask_sqlalchemy import Pagination

from workspaces.service.crud_service import BaseModelService, NotAuthorized, NotFoundException


class BaseModelView(MethodView):
    """Generic base class for handling REST API endpoints."""

    service: BaseModelService = None

    def search(self, page=1, per_page=20, *args, **kwargs):
        """
        Query the model and return all records

        Args:
            page: The page number
            per_page: The number of records per page to limit

        Returns:
            dict with all records from the model
            current page
            number of pages
        """
        objects = self.service.search(
            page=page, per_page=per_page, *args, **kwargs)
        list_name = str(self.service.repository)
        list_name_plural = list_name[:-1] + \
            list_name[-1:].replace("y", "ie") + "s"
        return {
            "pagination": {
                "current_page": page,
                "number_of_pages": objects.pages,
                "total": objects.total
            },
            list_name_plural: objects.items,
        }

    def post(self, body):
        """Save an object to the repository."""

        obj = self.service.post(body).to_dict()
        result_code = 201

        return obj, result_code

    def get(self, id_):
        """Get an object from the repository."""
        try:
            obj = self.service.get(id_)
        except NotAuthorized:
            return "Access to the requested resources not authorized", 401
        except NotFoundException:
            return f"{self.service.repository} with id {id_} not found.", 404
        if obj is None:
            return f"{self.service.repository} with id {id_} not found.", 404
        if isinstance(obj, dict):
            return obj
        return obj.to_dict()

    def put(self, body, id_):
        """Update an object in the repository."""
        return self.service.put(body, id_).to_dict()

    def delete(self, id_):
        """Delete an object from the repository."""
        return self.service.delete(id_)
