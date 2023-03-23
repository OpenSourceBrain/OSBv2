import sys

import yaml
from jupyterhub.user import User
from kubespawner.spawner import KubeSpawner

from cloudharness.auth import AuthClient
from cloudharness import log
from cloudharness import applications


def affinity_spec(key, value):
    return {

        'labelSelector':
            {
                'matchExpressions': [
                    {
                        'key': str(key),
                        'operator': 'In',
                        'values': [str(value)]
                    },
                ]
            },
        'topologyKey': 'kubernetes.io/hostname'
    }


def change_pod_manifest(self: KubeSpawner):
    """
    Application Hook to change the manifest of the notebook image
    before spawning it.

    Args:
        self (KubeSpawner): the spawner

    Returns:
        -
    """
    print("OSB change pod manifest")
    # get the workspace cookie to determine the workspace id

    def get_from_cookie(cookie_name):
        cookie = self.handler.request.cookies.get(cookie_name, None)
        if cookie is None:
            raise Exception(
                "Required cookie not found. Check that the cookie named '%s' is set." % cookie_name)
        return cookie.value

    def user_volume_is_legacy(user_id):
        print("User id", user_id, "max", self.config['apps']['jupyterhub'].get('legacyusermax', 0))
        return int(user_id) < self.config['apps']['jupyterhub'].get('legacyusermax', 0)

    def workspace_volume_is_legacy(workspace_id):
        return int(workspace_id) < self.config['apps']['jupyterhub'].get('legacyworkspacemax', 0)

    try:
        workspace_id = get_from_cookie('workspaceId')
        volume_name = f'workspace-{workspace_id}'
        log.info('Mapping to volume %s', volume_name)

        # We found the workspace id and now we try to mount the
        # workspace persistent volume claim

        ws_pvc = {
            'name': volume_name,
            'persistentVolumeClaim': {
                'claimName': volume_name,
            }
        }

        # add the volume to the pod
        if not [v for v in self.volumes if v['name'] == volume_name]:
            self.volumes.append(ws_pvc)

        
        

        # Add labels to use for affinity
        labels = {
            'workspace': str(workspace_id),
            'user': self.user.name
        }

        self.common_labels = labels
        self.extra_labels = labels
        self.storage_class = f'{self.config["namespace"]}-nfs-client'
        if not user_volume_is_legacy(self.user.id):
            # User pod affinity is by default added by cloudharness
            self.pod_affinity_required = []
        
        write_access = has_user_write_access(
            workspace_id, self.user)
        if workspace_volume_is_legacy(workspace_id):
            # Pods with write access must be on the same node
            self.pod_affinity_required.append(affinity_spec('workspace', workspace_id))
        from pprint import pprint
        pprint(self.volumes)
        if not [v for v in self.volume_mounts if v['name'] == volume_name]:
            self.volume_mounts.append({
                'name': volume_name,
                'mountPath': '/opt/workspace',
                'readOnly': not write_access
            })
    except Exception as e:
        log.error('Change pod manifest failed due to an error.', exc_info=True)



def has_user_write_access(workspace_id, user: User):
    print('Cheking access, name:', user.name, "workspace:", workspace_id)

    workspace = get_workspace(workspace_id)
    workspace_owner = workspace["user"]["username"]
    
    if workspace_owner == user.name:
        return True
    auth_client = AuthClient()
    kc_user = auth_client.get_user(user.name)
    return auth_client.user_has_realm_role(kc_user.id, 'administrator')

def get_workspace(workspace_id, workspace_base_url=None):
    if workspace_base_url is None:
        workspace_conf: applications.ApplicationConfiguration = applications.get_application('workspace')
        workspace_base_url = workspace_conf.get_service_address()
    import requests
    workspace = requests.get(f"{workspace_base_url}/api/workspace/{workspace_id}").json()
    
    return workspace.json()