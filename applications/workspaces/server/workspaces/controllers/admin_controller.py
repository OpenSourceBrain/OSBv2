from workspaces.service.admin_service import get_user_resource_counts
from workspaces.service.auth import get_auth_client, keycloak_user_id


def user_resource_counts():
    """Per-user workspace and repository counts, admin only.

    :rtype: dict
    """
    current_user_id = keycloak_user_id()
    if current_user_id is None or not get_auth_client().user_has_realm_role(user_id=current_user_id, role="administrator"):
        return "User not authorized", 401
    return get_user_resource_counts()
