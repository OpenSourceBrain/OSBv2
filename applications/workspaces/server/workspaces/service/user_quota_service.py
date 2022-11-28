from cloudharness.applications import get_configuration
from cloudharness.auth.quota import get_user_quotas


def get_pvc_size(application_config, user_id):
    application_config = get_configuration('workspaces')
    user_quotas = get_user_quotas(application_config, user_id=user_id)
    return f"{user_quotas.get('quota-ws-storage-max', '0.1')}Gi"


def get_max_workspaces_for_user(application_config, user_id):
    application_config = get_configuration('workspaces')
    user_quotas = get_user_quotas(application_config, user_id=user_id)
    return user_quotas.get('quota-ws-max', '1')
