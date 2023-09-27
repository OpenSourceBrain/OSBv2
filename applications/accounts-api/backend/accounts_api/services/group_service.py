import os

from accounts_api.models.group import Group
from accounts_api.services.user_service import map_user
from cloudharness.applications import get_configuration
from cloudharness.auth.keycloak import AuthClient
from cloudharness.auth.quota import get_group_quotas
from keycloak.exceptions import KeycloakGetError, KeycloakError


class GroupNotFound(Exception):
    pass


def get_group_by_name(group_name) -> Group:

    kc_group = get_kc_group_by_name(group_name)
    group = map_group(kc_group)

    ws_quotas = get_group_quotas(kc_group, get_configuration('workspaces'))
    hub_quotas = get_group_quotas(kc_group, get_configuration('jupyterhub'))
    group.quotas = {**ws_quotas, **hub_quotas}
    return group

def get_group_users(groupname):
    kc_group = get_kc_group_by_name(groupname)
    client = AuthClient().get_admin_client()
    users = client.get_group_members(kc_group["id"])
    return [map_user(u) for u in users]

def map_group(kc_group: dict) -> Group:
    group = Group()
    group.name = kc_group['name']

    attributes = kc_group['attributes']
    if 'description' in attributes:
        group.description = attributes['description'][0]
    if 'email' in attributes:
        group.email = attributes['email'][0]
    if 'avatar' in attributes:
        group.image = attributes['avatar'][0]

    group.links = {k[len('link--')::]: attributes[k][0]
                   for k in attributes if attributes[k] and len(k) > len('link--') and k.startswith('link--')}

    return group


def get_kc_group_by_name(group_name):
    
    try:
        client = AuthClient().get_admin_client()
        groups = client.get_groups()
        def find_group(groups):
            for group in groups:
                if group["name"].lower() == group_name.lower():
                    return group
                elif group["subGroups"]:
                    sub = find_group(group["subGroups"])
                    if sub:
                        return sub

            return None
        

        group = find_group( groups)
        if not group:
            raise GroupNotFound(group_name)
        return client.get_group(group["id"])
    except KeycloakGetError as e:
        if e.response_code == 404:
            raise GroupNotFound(group_name)
        raise Exception("Unhandled Keycloak exception") from e
    except KeycloakError as e:
        raise Exception("Unhandled Keycloak exception") from e
