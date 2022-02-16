from inspect import getmembers, ismethod
from types import FunctionType

from flask import request

from cloudharness import log as logger
from cloudharness.auth import AuthClient



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


disallowed_class_types = ["BaseQuery", "type", "registry", "MetaData"]


def dao_entity2dict(obj):
    disallowed_names = {name for name, value in getmembers(
        type(obj)) if isinstance(value, FunctionType)}
    result = {}
    for name in dir(obj):
        if name[0] != "_" and name not in disallowed_names and hasattr(obj, name):
            val = getattr(obj, name)
            if not ismethod(val):
                clas = val.__class__.__name__
                if clas == "InstrumentedList":
                    val = list(dao_entity2dict(r) for r in val)
                if clas not in disallowed_class_types:
                    result.update({name: val})
    return result

