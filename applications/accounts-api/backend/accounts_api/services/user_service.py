from datetime import datetime
from keycloak.exceptions import KeycloakGetError, KeycloakError
from accounts_api.models import User
from cloudharness.auth import AuthClient
from cloudharness import log
import typing
# from cloudharness.models import User as CHUser # Cloudharness 2.0.0

class UserNotFound(Exception): pass


class UserNotAuthorized(Exception): pass


def get_user(userid: str) -> User:
    try:
        client = AuthClient()
        kc_user = client.get_user(userid)
    except KeycloakGetError as e:
        if e.response_code == 404:
            raise UserNotFound(userid)
        raise Exception("Unhandled Keycloak exception") from e
    except KeycloakError as e:
        raise Exception("Unhandled Keycloak exception") from e

    user = map_user(kc_user)
    try:
        current_user = client.get_current_user()
        if not current_user or current_user['id'] != userid:
            user.email = None
    except:  # user not provided
        log.error("Error checking user", exc_info=True)
        user.email = None
    return user


def get_users(query: str) -> typing.List[User]:
    try:
        client = AuthClient()
        kc_users = client.get_users(query)
    except KeycloakError as e:
        raise Exception("Unhandled Keycloak exception") from e
    all_users = []
    for kc_user in kc_users:
        auser = map_user(kc_user)
        auser.email = None  # strip out the e-mail address
        all_users.append(auser)

    return all_users


def map_user(kc_user) -> User:
    user = kc_user if isinstance(kc_user, dict) else User.from_dict(kc_user._raw_dict)
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
        current_user = client.get_current_user()
        if current_user['id'] != userid != user.id:
            raise UserNotAuthorized
        admin_client = client.get_admin_client()
        updated_user = {
            'firstName': user.first_name or current_user['firstName'],
            'lastName': user.last_name or current_user['lastName'],
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
