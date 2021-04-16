"""Model base class"""
from flask.views import MethodView
from cloudharness import log as logger
from workspaces.utils import row2dict


def rm_null_values(dikt):
    tmp = {}
    for k,v in dikt.items():  # remove null fields from dict
        if v:
            tmp.update({k:v})
    return tmp


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
        list_name = self.repository.model.__tablename__
        list_name_plural = list_name[:-1] + list_name[-1:].replace("y","ie") + "s"
        return {"pagination": {
            "current_page": page,
            "number_of_pages": total_pages,
        },
            list_name_plural : list(obj_dicts)}

    def post(self, body):
        """Save an object to the repository."""
        body = rm_null_values(body)
        obj = self.repository.post(body)
        return obj.to_dict()

    def get(self, id_):
        """Get an object from the repository."""
        obj = self.repository.get(id=id_)
        if obj is None:
            return f"{self.repository.model.__name__} with id {id_} not found.", 404
        return obj.to_dict()

    def put(self, body, id_):
        """Update an object in the repository."""
        return self.repository.put(body, id_)

    def delete(self, id_):
        """Delete an object from the repository."""
        return self.repository.delete(id_)
