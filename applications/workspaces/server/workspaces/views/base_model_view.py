"""Model base class"""

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
        page, total_pages, objects = self.repository.search(page=page,
                                                            per_page=per_page,
                                                            *args,
                                                            **kwargs)
        obj_dicts = map(lambda obj: obj.to_dict(), objects.items)
        return {"current_page": page,
                "number_of_pages": total_pages,
                "items": list(obj_dicts)}

    def post(self, body):
        """Save an object to the repository."""
        obj, result_code = self.repository.post(body)
        if result_code == 201:
            obj = obj.to_dict()
        return obj, result_code

    def get(self, id):
        """Get an object from the repository."""
        obj, found = self.repository.get(id)
        if not found:
            return "{} with id {} not found.".format(self.repository.model.__name__, id), 404
        return obj.to_dict()

    def put(self, body, id):
        """Update an object in the repository."""
        return self.repository.put(body, id)

    def delete(self, id):
        """Delete an object from the repository."""
        return self.repository.delete(id)
