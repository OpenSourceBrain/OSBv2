"""The DANDI key for an upload: the `DANDI_API_KEY` attribute of the Keycloak user the request
names. It never leaves OSB (no response, log or error carries it), and is read on every call, so a
changed attribute applies without a restart.
"""
from cloudharness.auth import UserNotFound

from workspaces.service.auth import get_auth_client

DANDI_API_KEY_ATTRIBUTE = "DANDI_API_KEY"


class DandiKeyMissing(Exception):
    """503: the deployment is misconfigured. The named user doesn't exist or has no DANDI key."""


class DandiKeyUnavailable(Exception):
    """503: Keycloak could not be reached."""


def _user_attributes(username: str) -> dict:
    user = get_auth_client().get_user(username)
    return user.attributes or {}


def dandi_api_key(username: str) -> str:
    try:
        attributes = _user_attributes(username)
    except UserNotFound as exc:
        raise DandiKeyMissing(f"there is no user {username!r}") from exc
    except Exception as exc:  # noqa: BLE001 (any other failure means Keycloak couldn't be asked)
        raise DandiKeyUnavailable("Keycloak is not available") from exc
    # Keycloak keeps every attribute as a list of strings.
    key = (attributes.get(DANDI_API_KEY_ATTRIBUTE) or [""])[0].strip()
    if not key:
        raise DandiKeyMissing(f"user {username!r} has no {DANDI_API_KEY_ATTRIBUTE} attribute")
    return key
