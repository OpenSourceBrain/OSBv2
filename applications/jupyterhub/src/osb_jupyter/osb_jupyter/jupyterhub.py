import sys

from jupyterhub.user import User
from kubespawner.spawner import KubeSpawner

from cloudharness.auth import AuthClient
from cloudharness import log


def change_pod_manifest(self: KubeSpawner):
    """
    Application Hook to change the manifest of the notebook image
    before spawning it.

    Args:
        self (KubeSpawner): the spawner

    Returns:
        -
    """

    # get the workspace cookie to determine the workspace id
    workspace_cookie = self.handler.request.cookies.get('workspaceId', None)
    if workspace_cookie:
        workspace_id = workspace_cookie.value
        volume_name = f'workspace-{workspace_id}'
        log.info('Mapping to volume %s', volume_name)

        # We found the workspace id and now we try to mount the
        # workspace persistent volume claim

        # ToDo: add pod affinity so that all pods in read-write
        ws_pvc = {
            'name': volume_name,
            'persistentVolumeClaim': {
                'claimName': volume_name,
                'spec': {
                    'accessModes': ['ReadWriteOnce', 'ReadOnlyMany']
                }
            }
        }


        # add the volume to the pod
        self.volumes.append(ws_pvc)
        workspace_owner = self.handler.request.cookies.get('workspaceOwner', None)
        if workspace_owner is None:
            console.error("Cannot determine the workspace owner. "
                          "Check that the cookie named 'workspaceOwner' is set.")

            # mount the workspace volume in the pod
        self.volume_mounts.append({
            'name': volume_name,
            'mountPath': '/opt/workspace',
            'readOnly': not has_user_write_access(workspace_id, self.user, workspace_owner)
        })


def has_user_write_access(workspace_id, user: User, workspace_owner: str):
    if workspace_owner == user.name:
        return True
    auth_client = AuthClient()
    return auth_client.user_has_realm_role(user.name, 'administrator')
