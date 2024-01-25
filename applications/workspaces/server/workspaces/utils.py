from inspect import getmembers, ismethod
from types import FunctionType

from flask import request

from cloudharness import log as logger
from cloudharness.auth import AuthClient
from workspaces.models import WorkspaceResourceEntity, ResourceType, WorkspaceEntity


def get_keycloak_data():
    bearer = request.headers.get("Authorization", None)
    logger.debug(f"Bearer: {bearer}")
    if not bearer or bearer == "Bearer undefined":
        decoded_token = None
        keycloak_id = -1  # No authorization --> no user --> only publicable workspaces
    else:
        token = bearer.split(" ")[1]
        decoded_token = AuthClient.decode_token(token)
        keycloak_id = decoded_token["sub"]
    return keycloak_id, decoded_token


def get_pvc_name(workspace_id):
    return f"workspace-{workspace_id}"


disallowed_class_types = ["BaseQuery", "type", "registry", "MetaData"]
name_mappings = {WorkspaceResourceEntity.__name__: {"folder": "path"}}
exclude = { WorkspaceEntity.__name__: {"resources"} }


def dao_entity2dict(obj):
    if hasattr(obj, "to_dict"):
        result = obj.to_dict()
    else:
        disallowed_names = {name for name, value in getmembers(
            type(obj)) if isinstance(value, FunctionType) or name in exclude.get(type(obj).__name__, ())}
        
        result = {}

        for name in dir(obj):

            if name not in disallowed_names and name[0] != "_" and  hasattr(obj, name):
                val = getattr(obj, name)
                if not ismethod(val):
                    clas = val.__class__.__name__
                    if hasattr(val.__class__, "to_dict"):
                        val = val.__class__.to_dict(val)
                    if clas == "InstrumentedList":
                        val = list(dao_entity2dict(r) for r in val)
                    if clas not in disallowed_class_types:
                        result.update({name: val})
    if type(obj).__name__ in name_mappings:
        for src, dest in name_mappings[type(obj).__name__].items():
            result[dest] = result[src]
            del result[src]
    return result


def guess_resource_type(resource_path):
    resource_path = resource_path.split("?")[0]
    extension = resource_path.split(".")[-1]
    if extension == "nwb":
        return ResourceType.E
    elif extension == "np":
        return ResourceType.M
    elif extension == "ipynb":
        return ResourceType.G
    return None
