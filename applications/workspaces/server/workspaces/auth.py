import time

from cloudharness.auth import AuthClient
from cloudharness import log

# Reuse AuthClient to benefit from valid token
# AuthClient will try to refresh automatically once token expired

auth_client = None
keycloak_running = False
nap_time = 30
while not keycloak_running:
    try:
        auth_client = AuthClient()
        keycloak_running = True
    except Exception as e:
        log.error(f"Keycloak not running? Going for a {nap_time} seconds power nap and will try again later")
        time.sleep(nap_time)  # sleep 30 seconds and try again
