import time
from multiprocessing import Process

from cloudharness import log
from cloudharness.auth import AuthClient
from cloudharness.middleware import get_authentication_token

# Reuse AuthClient to benefit from valid token
# AuthClient will try to refresh automatically once token expired

_auth_client = None
keycloak_running = False
nap_time = 1


def get_auth_client():
    global _auth_client, keycloak_running
    if not _auth_client:
        try:
            _auth_client = AuthClient()
            keycloak_running = True
        except Exception as e:
            raise Exception("Keycloak not available") from e
    return _auth_client


def keycloak_user_id():
    authentication_token = get_authentication_token()
    print(f"Authentication token: {authentication_token}")
    if not authentication_token:
        return None
    try:
        return AuthClient.decode_token(authentication_token).get("sub", None)
    except Exception as e:
        log.error(f"Failed to decode authentication token: {e}")
        return None
