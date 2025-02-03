import workspaces.service.osbrepository as repository_service

from workspaces.service.crud_service import (
    NotAuthorized,
    NotAllowed,
    OsbrepositoryService,
    VolumestorageService,
    WorkspaceService,
    WorkspaceresourceService,
    TagService,
    NotFoundException
)


from workspaces.controllers.crud.base_model_controller import BaseModelView
from cloudharness.workflows.argo import delete_workflow



class WorkspaceView(BaseModelView):
    service = WorkspaceService()
    
    def post(self, body):
        try:
            return super().post(body)
        except NotAllowed:
            return "Not allowed", 405

    
        
    def delete(self, id_):
        """Delete an object from the repository."""
        for wf in WorkspaceService.get_workspace_workflows(id_):
            delete_workflow(wf.name)

        return super().delete(id_)




class OsbrepositoryView(BaseModelView):
    service = OsbrepositoryService()

    def get(self, id_, *args, **kwargs):
        context = kwargs.get("context")

        try:
            osbrepository_ext = self.service.get(id_)
        except NotAuthorized:
            return "Access to the requested resources not authorized", 401
        except NotFoundException:
            return f"{self.service.repository} with id {id_} not found.", 404
        if osbrepository_ext is None:
            return f"{self.service.repository} with id {id_} not found.", 404

        osbrepository_ext.context_resources = repository_service.get_resources(
            osbrepository=osbrepository_ext, context=context, osbrepository_id=id_
        )  # use context to get the files
        osbrepository_ext.contexts = repository_service.get_contexts(
            repository_type=osbrepository_ext.repository_type, uri=osbrepository_ext.uri
        )
        osbrepository_ext.description = repository_service.get_description(
            osbrepository=osbrepository_ext, context=context
        )  # use context to get the files
        return osbrepository_ext.to_dict(), 200


class VolumestorageView(BaseModelView):
    service = VolumestorageService()


class WorkspaceresourceView(BaseModelView):
    service = WorkspaceresourceService()
    


class TagView(BaseModelView):
    service = TagService()

