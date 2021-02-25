"""Model base class"""
import logging
from ..config import Config
logger = logging.getLogger(Config.APP_NAME)
from flask.views import MethodView


class BaseModelView(MethodView):
    """Generic base class for handling REST API endpoints."""

    repository = None

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
        logger.debug("Search args %s", args)
        logger.debug("Search kwargs %s", kwargs)
        page, total_pages, objects = self.repository.search(page=page,
                                                            per_page=per_page,
                                                            *args,
                                                            **kwargs)
        obj_dicts = map(lambda obj: obj.to_dict(), objects.items)
        return {"pagination": {
                    "current_page": page,
                    "number_of_pages": total_pages,
                    },
                f"{self.repository.model.__tablename__}s": list(obj_dicts)}

    def post(self, body):
        """Save an object to the repository."""
        obj, result_code = self.repository.post(body)
        if result_code == 201:
            obj = obj.to_dict()
        return obj, result_code

    def get(self, id_):
        """Get an object from the repository."""
        obj, found = self.repository.get(id=id_)
        if not found:
            return f"{self.repository.model.__name__} with id {id_} not found.", 404
        return obj.to_dict()

    def put(self, body, id_):
        """Update an object in the repository."""
        return self.repository.put(body, id_)

    def delete(self, id_):
        """Delete an object from the repository."""
        return self.repository.delete(id_)
