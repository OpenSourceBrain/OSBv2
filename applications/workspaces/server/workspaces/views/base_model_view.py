from flask.views import MethodView

from workspaces.utils import row2dict


class BaseModelView(MethodView):
    """Generic base class for handling REST API endpoints."""

    service = None

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
        page, total_pages, objects = self.service.search(page=page, per_page=per_page, *args, **kwargs)
        obj_dicts = list(map(lambda obj: row2dict(obj), objects.items))
        list_name = str(self.service.repository)
        list_name_plural = list_name[:-1] + list_name[-1:].replace("y", "ie") + "s"
        return {
            "pagination": {
                "current_page": page,
                "number_of_pages": total_pages,
            },
            list_name_plural: obj_dicts,
        }

    def post(self, body):
        """Save an object to the repository."""

        obj = self.service.post(body).to_dict()
        result_code = 201

        return obj, result_code

    def get(self, id_):
        """Get an object from the repository."""
        obj = self.service.get(id_=id_)
        if obj is None:
            return f"{self.service.repository} with id {id_} not found.", 404
        if isinstance(obj, dict):
            return obj
        return obj.to_dict()

    def put(self, body, id_):
        """Update an object in the repository."""
        return self.service.put(body, id_)

    def delete(self, id_):
        """Delete an object from the repository."""
        return self.service.delete(id_)
