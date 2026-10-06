from cloudharness.applications import get_configuration
from cloudharness.auth.quota import get_user_quotas


def get_pvc_size(user_id):
    application_config = get_configuration('workspaces')
    user_quotas = get_user_quotas(application_config, user_id=user_id)
    return f"{user_quotas.get('quota-ws-storage-max', '0.1')}Gi"


def get_max_workspaces_for_user(user_id) -> int:
    application_config = get_configuration('workspaces')
    user_quotas = get_user_quotas(application_config, user_id=user_id)
    return int(user_quotas.get('quota-ws-max', '1'))


def get_run_resources(user_id) -> dict:
    """A notebook run's pod gets what the user's lab pod gets: jupyterhub's CPU/memory quotas
    (deployment defaults, overridden per user or group in Keycloak)."""
    quotas = get_user_quotas(get_configuration('jupyterhub'), user_id=user_id)
    return {
        "requests": {"cpu": str(quotas["quota-ws-guaranteecpu"]), "memory": f"{quotas['quota-ws-guaranteemem']}G"},
        "limits": {"cpu": str(quotas["quota-ws-maxcpu"]), "memory": f"{quotas['quota-ws-maxmem']}G"},
    }
