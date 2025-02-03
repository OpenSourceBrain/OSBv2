import re
from jupyterhub.user import User
from kubespawner.spawner import KubeSpawner

from cloudharness.auth import AuthClient
from cloudharness import log
from cloudharness import applications
from cloudharness.auth.exceptions import UserNotFound
from urllib.parse import parse_qs, urlparse

from harness_jupyter.jupyterhub import set_key_value

allowed_chars = set(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")


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


class CookieNotFound(Exception):
    pass



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
            raise CookieNotFound(
                "Required cookie not found. Check that the cookie named '%s' is set." % cookie_name)
        return cookie.value

    def user_volume_is_legacy(user_id):
        print("User id", user_id, "max",
              self.config['apps']['jupyterhub'].get('legacyusermax', 0))
        return int(user_id) < self.config['apps']['jupyterhub'].get('legacyusermax', 0)

    def workspace_volume_is_legacy(workspace_id):
        return int(workspace_id) < self.config['apps']['jupyterhub'].get('legacyworkspacemax', 0)

    appname = self.image.split('/')[-1].split(':')[0]

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

        app_user = get_app_user(self.user)

        # Add labels to use for affinity
        clean_username = "".join(
            c for c in app_user.username if c in allowed_chars)
        labels = {
            'workspace': str(workspace_id),
            'username': clean_username,
            'user': str(self.user.id),
        }

        self.common_labels = labels
        self.extra_labels = labels
        if self.config['apps']['jupyterhub'].get('nfs_volumes', False):
            self.storage_class = f'{self.config["namespace"]}-nfs-client'

        if not user_volume_is_legacy(self.user.id):
            # User pod affinity is by default added by cloudharness
            self.pod_affinity_required = []

        workspace = get_workspace(workspace_id, get_from_cookie("accessToken"))
        write_access = has_user_write_access(
            workspace, self.user, app_user=app_user)

        if workspace_volume_is_legacy(workspace_id):
            # Pods with write access must be on the same node
            self.pod_affinity_required.append(
                affinity_spec('workspace', workspace_id))
        from pprint import pprint
        pprint(self.volumes)
        self.pod_name = f'ws-{clean_username}-{workspace_id}-{appname}'
        if not [v for v in self.volume_mounts if v['name'] == volume_name]:
            self.volume_mounts.append({
                'name': volume_name,
                'mountPath': '/opt/workspace',
                'readOnly': not write_access
            })
        if "image=" in self.handler.request.uri and is_user_trusted(self.user):
            print("Image override")
            image = parse_qs(urlparse(self.handler.request.uri).query)[
                'image'][0]
            print("Image is", image)
            self.image = image
            self.pod_name = f"{self.pod_name}--{re.sub('[^0-9a-zA-Z]+', '-', image)}"
            # open external resources

    except (CookieNotFound, UserNotFound):
        # Setup a readonly default session
        self.pod_name = f'anonymous-{self.user.name}-{appname}'
        self.storage_pvc_ensure = False
        self.volumes = []
        self.volume_mounts = []

        print("Setting user quota cpu/mem usage")
        from cloudharness.applications import get_current_configuration, get_configuration
        try:
            subdomain = self.handler.request.host.split(
                str(self.config['domain']))[0][0:-1]
            appname = next(app["name"] for app in self.config['apps'].values(
            ) if app["harness"]["subdomain"] == subdomain)
            app_conf = get_configuration(appname).to_dict()
            cpu_conf = app_conf.get("singleuser", {}).get("cpu", {})
            mem_conf = app_conf.get("singleuser", {}).get("memory", {})
        except StopIteration:
            cpu_conf = {}
            mem_conf = {}

        jh_conf = get_configuration('jupyterhub')
        cpu_conf = {**jh_conf.singleuser["cpu"].to_dict(), **cpu_conf}
        mem_conf = {**jh_conf.singleuser["memory"].to_dict(), **mem_conf}
        set_key_value(self, key="cpu_guarantee", value=cpu_conf["guarantee"])
        set_key_value(self, key="cpu_limit", value=cpu_conf["limit"])
        set_key_value(self, key="mem_guarantee",
                      value=mem_conf["guarantee"])
        set_key_value(self, key="mem_limit", value=mem_conf["limit"])
        print("Starting anonymous session with no volumes")
    except Exception as e:
        log.error('Change pod manifest failed due to an error.', exc_info=True)

    # Add customized config map for jupyter notebook config
    self.volumes.append({
        'name': 'jupyterhub-notebook-config',
        'configMap': {'name': 'jupyterhub-notebook-config'}
    })
    self.volume_mounts.append({
        'name': 'jupyterhub-notebook-config',
        'subPath': 'jupyter_notebook_config.py',
        'mountPath': '/etc/jupyter/jupyter_notebook_config.py',
        'readOnly': True
    })
    self.volume_mounts.append({
        'name': 'jupyterhub-notebook-config',
        'subPath': 'jupyter_notebook_config.py',
        'mountPath': '/opt/conda/etc/jupyter/nbconfig/jupyter_notebook_config.py',
        'readOnly': True
    })


def get_app_user(user: User):
    auth_client = AuthClient()
    kc_user = auth_client.get_user(user.name)
    return kc_user


def has_user_write_access(workspace, user: User, app_user=None):
    print('Checking access, name:', user.name, "workspace:", workspace["id"])
    workspace_owner = workspace["user"]["id"]
    print("Workspace owner", workspace_owner,
          "-", workspace["user"]["username"])
    return workspace_owner == user.name or is_user_trusted(user)


def is_user_trusted(user: User):
    auth_client = AuthClient()
    kc_user = auth_client.get_user(user.name)
    return auth_client.user_has_realm_role(kc_user.id, 'administrator') or\
        auth_client.user_has_realm_role(kc_user.id, 'trusted')


def get_workspace(workspace_id, token, workspace_base_url=None):
    if workspace_base_url is None:
        workspace_conf: applications.ApplicationConfiguration = applications.get_configuration(
            'workspaces')
        workspace_base_url = workspace_conf.get_service_address()
    import requests
    workspace = requests.get(f"{workspace_base_url}/api/workspace/{workspace_id}",
                             headers={"Authorization": f"Bearer {token}"}).json()

    return workspace
