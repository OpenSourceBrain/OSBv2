from datetime import datetime
import os
from cloudharness.applications import get_configuration
from cloudharness.auth.quota import get_user_quotas
from keycloak.exceptions import KeycloakGetError, KeycloakError
from accounts_api.models import User
from cloudharness.auth import AuthClient, UserNotFound
from cloudharness import log
import typing
# from cloudharness.models import User as CHUser # Cloudharness 2.0.0

print("User Service")
class UserNotAuthorized(Exception): pass


def get_user(username_or_id: str) -> User:
    client = AuthClient(username=os.getenv('ACCOUNTS_ADMIN_USERNAME', None), password=os.getenv('ACCOUNTS_ADMIN_PASSWORD', None))
    try:

        kc_user = client.get_user(username_or_id)
    except UserNotFound:
        raise
    except KeycloakGetError as e:
        if e.response_code == 404:
            raise UserNotFound(username_or_id)
        raise Exception("Unhandled Keycloak exception") from e
    except IndexError:
        raise UserNotFound(username_or_id)
    except KeycloakError as e:
        raise Exception("Unhandled Keycloak exception") from e

    user = map_user(kc_user)
    try:
        current_user = client.get_current_user()
        if not current_user or current_user['username'] != username_or_id:
            user.email = None
    except:  # user not provided
        log.error("Error checking user", exc_info=True)
        user.email = None


    ws_quotas =  get_user_quotas(get_configuration('workspaces'), user_id=user.id)
    hub_quotas = get_user_quotas(get_configuration('jupyterhub'), user_id=user.id)
    user.quotas = {**ws_quotas, **hub_quotas}
    return user


# Sortable fields, mapped to a sort key over the raw Keycloak user dict.
# Keycloak's admin REST API cannot sort users, so sorting happens here.
USER_SORT_KEYS = {
    'registration_date': lambda u: u.get('createdTimestamp') or 0,
    'username': lambda u: (u.get('username') or '').lower(),
    'name': lambda u: ((u.get('firstName') or '') + ' ' + (u.get('lastName') or '')).strip().lower(),
    'first_name': lambda u: (u.get('firstName') or '').lower(),
    'last_name': lambda u: (u.get('lastName') or '').lower(),
}


def get_users(search: str = None, page: int = 1, per_page: int = 20,
              sort_by: str = 'registration_date', sort_order: str = 'desc') -> typing.Tuple[typing.List[User], int]:
    """Return a page of users plus the total number of matching users.

    Keycloak cannot sort its users list, so the whole (brief) matching list is
    fetched, sorted here, and sliced to the requested page. Brief
    representations keep that fetch light but omit ``attributes`` (profiles,
    avatar, website) and groups; groups are re-fetched for the page rows only.
    """
    try:
        client = AuthClient()
        admin_client = client.get_admin_client()
        query = {'briefRepresentation': 'true'}
        if search:
            query['search'] = search
        # No first/max in the query: python-keycloak fetches all matching users.
        kc_users = admin_client.get_users(query)
    except KeycloakError as e:
        raise Exception("Unhandled Keycloak exception") from e

    sort_key = USER_SORT_KEYS.get(sort_by, USER_SORT_KEYS['registration_date'])
    kc_users.sort(key=sort_key, reverse=sort_order != 'asc')

    total = len(kc_users)
    first = (page - 1) * per_page
    page_users = kc_users[first:first + per_page]

    all_users = []
    for kc_user in page_users:
        try:
            kc_user['userGroups'] = admin_client.get_user_groups(user_id=kc_user['id'], brief_representation=True)
        except KeycloakError:
            log.warning("Could not fetch groups for user %s", kc_user.get('id'), exc_info=True)
        auser = map_user(kc_user)
        auser.email = None  # strip out the e-mail address
        all_users.append(auser)

    return all_users, total


def map_user(kc_user) -> User:
    if isinstance(kc_user, dict):
        raw = kc_user
    else:
        # cloudharness models no longer expose the raw keycloak payload as
        # `_raw_dict`; to_dict() serializes the model back to a plain dict.
        raw = kc_user.to_dict()
    user = User.from_dict(raw)
    if 'attributes' not in kc_user or not kc_user['attributes']:
        kc_user['attributes'] = {}

    user.profiles = {k[len('profile--')::]: kc_user['attributes'][k][0]
                     for k in kc_user['attributes'] if kc_user['attributes'][k] and len(k) > len('profile--') and k.startswith('profile--') }
    try:
        user.avatar = kc_user['attributes'].get('avatar', [None])[0]
    except (IndexError, TypeError):
        # no avatar is set or is empty
        pass
    user.registration_date = datetime.fromtimestamp(kc_user['createdTimestamp'] / 1000)
    try:
        user.website = kc_user['attributes'].get('website', [None])[0]
    except (IndexError, TypeError):
        # no website is set or is empty
        pass

    if 'userGroups' in kc_user:
        user.groups = [g['name'] for g in kc_user['userGroups']]
    return user


def update_user(userid, user: User):    
    client = AuthClient()

    try:
        try:
            current_user = client.get_current_user()
        except UserNotFound:
            # No (valid) authenticated user in the request context
            raise UserNotAuthorized
        if current_user['id'] != user.id:
            raise UserNotAuthorized
        admin_client = client.get_admin_client()
        updated_user = {
            # Keycloak 26's user update requires the username in the payload
            'username': current_user['username'],
            'firstName': user.first_name or current_user['firstName'],
            'lastName': user.last_name or current_user['lastName'],
            'email': user.email or current_user['email'],
            'attributes': {
                **(current_user.get('attributes') or {}),
                **({('profile--' + k): user.profiles[k] for k in user.profiles} if user.profiles else {}),
                'avatar': user.avatar,
                'website': user.website
            }
        }

        admin_client.update_user(userid,  updated_user)
        return get_user(userid)
    except KeycloakError as e:
        if e.response_code == 404:
            raise UserNotFound(userid)
        raise Exception("Unhandled Keycloak exception") from e


if __name__ == '__main__':
    users = get_users("")