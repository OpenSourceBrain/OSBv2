from datetime import datetime
import os
import time
import requests
from cloudharness.applications import get_configuration
from cloudharness.auth.quota import get_user_quotas
from cloudharness.middleware import get_authentication_token
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

# Fields sorted on per-user resource counts from the workspaces service.
COUNT_SORT_FIELDS = ('workspaces', 'repositories')

# The user list and the resource counts are both O(number of users) to fetch,
# so they are cached for a short TTL instead of being re-fetched on every page
# click. Slightly stale backoffice data is an acceptable trade-off; set the
# TTL to 0 to disable caching.
CACHE_TTL_SECONDS = int(os.getenv('USERS_CACHE_TTL_SECONDS', '60'))
_users_cache = {'expires': 0.0, 'value': None}
_counts_cache = {'expires': 0.0, 'value': None}


def _cached(cache: dict, fetch: typing.Callable[[], typing.Any]):
    """Return the cached value, refreshing it after CACHE_TTL_SECONDS.

    A failed refresh keeps serving the stale value for another TTL instead of
    failing the request; it raises only when there is nothing to serve yet.
    """
    now = time.monotonic()
    if cache['value'] is not None and now < cache['expires']:
        return cache['value']
    try:
        cache['value'] = fetch()
    except Exception:
        if cache['value'] is None:
            raise
        log.warning("Could not refresh cached data, serving stale values", exc_info=True)
    cache['expires'] = now + CACHE_TTL_SECONDS
    return cache['value']


def _is_admin() -> bool:
    """True when the calling token carries the administrator realm role."""
    token = get_authentication_token()
    if not token:
        return False
    try:
        decoded = AuthClient.decode_token(token)
    except Exception:
        return False
    return 'administrator' in ((decoded or {}).get('realm_access') or {}).get('roles', ())


def _get_user_resource_counts() -> dict:
    """Per-user workspace/repository counts from the workspaces service.

    The caller's bearer token is forwarded; the endpoint is admin-only, and
    since the result may be served from the cache to later callers, the
    caller's admin role must be checked before using it (see get_users).
    """
    workspaces_address = get_configuration('workspaces').get_service_address()
    token = get_authentication_token()
    response = requests.get(
        f"{workspaces_address}/api/user-resource-counts",
        headers={'Authorization': f"Bearer {token}"} if token else {},
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def get_users(search: str = None, page: int = 1, per_page: int = 20,
              sort_by: str = 'registration_date', sort_order: str = 'desc') -> typing.Tuple[typing.List[User], int, dict]:
    """Return a page of users, the total number of matching users, and the
    workspace/repository counts for the page's users (keyed by user id).

    Keycloak cannot sort its users list, so the whole (brief) matching list is
    fetched, sorted here, and sliced to the requested page. Brief
    representations keep that fetch light but omit ``attributes`` (profiles,
    avatar, website) and groups; groups are re-fetched for the page rows only.
    """
    try:
        client = AuthClient()
        admin_client = client.get_admin_client()
        if search:
            # Search results are small; hit Keycloak directly so its search
            # semantics apply (the cache only holds the unfiltered list).
            # No first/max in the query: python-keycloak fetches all matches.
            kc_users = admin_client.get_users({'briefRepresentation': 'true', 'search': search})
        else:
            # Copy so concurrent requests never sort the shared cached list.
            kc_users = list(_cached(
                _users_cache, lambda: admin_client.get_users({'briefRepresentation': 'true'})))
    except KeycloakError as e:
        raise Exception("Unhandled Keycloak exception") from e

    counts = {}
    # The counts may come from the cache, so gate them on the caller's own
    # admin role here rather than relying on the workspaces endpoint's 401.
    if _is_admin():
        try:
            counts = _cached(_counts_cache, _get_user_resource_counts)
        except Exception:
            log.warning("Could not fetch workspace/repository counts from the workspaces service", exc_info=True)

    if sort_by in COUNT_SORT_FIELDS:
        sort_key = lambda u: counts.get(u['id'], {}).get(sort_by, 0)
    else:
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

    # Users without resources have no entry in the workspaces service response.
    page_counts = {u['id']: counts.get(u['id'], {'workspaces': 0, 'repositories': 0}) for u in page_users} if counts else {}
    return all_users, total, page_counts


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