"""EMBER-DANDI keys for the /ember upload endpoints, held on Keycloak users.

The client names a Keycloak user (`username` in the request); that user's attribute `EMBER_API_KEY`
is the key the upload is signed with. The key never leaves OSB: not in a response, a log or an
error. Read on every call, so a changed attribute takes effect without a restart.

The client also says which dandiset to upload into; OSB doesn't decide. EMBER-DANDI itself refuses
a dandiset the key can't write to (that surfaces as a 502 with EMBER's reason).
"""
from cloudharness.auth import UserNotFound

from workspaces.service.auth import get_auth_client

EMBER_API_KEY_ATTRIBUTE = "EMBER_API_KEY"


class EmberKeyMissing(Exception):
    """503: the deployment is misconfigured. The named user doesn't exist or has no EMBER-DANDI key."""


class EmberKeyUnavailable(Exception):
    """503: Keycloak couldn't be asked."""


def _user_attributes(username: str) -> dict:
    """The Keycloak user's attributes (each a list of strings); raises if there is no such user."""
    user = get_auth_client().get_user(username)
    return user.attributes or {}


def ember_api_key(username: str) -> str:
    """The EMBER-DANDI key held by the Keycloak user `username`. Never log the return value."""
    try:
        attributes = _user_attributes(username)
    except UserNotFound as exc:
        raise EmberKeyMissing(f"there is no user {username!r}") from exc
    except Exception as exc:  # noqa: BLE001 (any other failure means Keycloak couldn't be asked)
        raise EmberKeyUnavailable("Keycloak is not available") from exc
    # Keycloak keeps every attribute as a list of strings.
    key = (attributes.get(EMBER_API_KEY_ATTRIBUTE) or [""])[0].strip()
    if not key:
        raise EmberKeyMissing(f"user {username!r} has no {EMBER_API_KEY_ATTRIBUTE} attribute")
    return key
