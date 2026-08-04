"""Tests that an anonymous session never gets a user volume.

These drive a real KubeSpawner, so they need the jupyterhub image and skip
everywhere else::

    kubectl -n <namespace> exec deploy/hub -- \
        python3 -m unittest discover /usr/src/app/osb_jupyter/tests

The storage config below mirrors `singleuser.storage` in
applications/jupyterhub/deploy/values.yaml: dynamic claims named after the
JupyterHub row id, mounted at /opt/user.
"""

import unittest

try:
    from kubespawner import KubeSpawner
    from traitlets.config import Config

    from osb_jupyter import pre_spawn_hook
except Exception as error:  # the hub image is not available
    KubeSpawner = None
    IMPORT_ERROR = error
else:
    IMPORT_ERROR = None

ANONYMOUS_NAME = "anon-0123456789abcdef"
LEGACY_ANONYMOUS_NAME = "a-0a8001de-0f42c"
KEYCLOAK_SUB = "0c15dba8-ad02-4c63-b56b-b1ce223ce594"

HOME_VOLUME = "osb-user-{userid}"


def make_spawner(username):
    config = Config()
    config.KubeSpawner.storage_pvc_ensure = True
    config.KubeSpawner.pvc_name_template = HOME_VOLUME
    config.KubeSpawner.storage_capacity = "2Gi"
    config.KubeSpawner.volumes = [
        {"name": HOME_VOLUME,
         "persistentVolumeClaim": {"claimName": HOME_VOLUME}}]
    config.KubeSpawner.volume_mounts = [
        {"name": HOME_VOLUME, "mountPath": "/opt/user"}]
    spawner = KubeSpawner(config=config, _mock=True)
    spawner.user.name = username
    return spawner


@unittest.skipIf(IMPORT_ERROR, "needs the jupyterhub image: %s" % IMPORT_ERROR)
class TestAnonymousSessionsGetNoVolume(unittest.IsolatedAsyncioTestCase):
    """KubeSpawner has to be built inside a running loop, like its own tests do."""

    async def claimed_volumes(self, spawner):
        """Claims the pod manifest would mount.

        Configured volumes reach the manifest as V1Volume objects whose nested
        claim is still the plain dict from the config, so read it either way.
        """
        pod = await spawner.get_pod_manifest()
        claims = []
        for volume in pod.spec.volumes or []:
            claim = (volume.get("persistentVolumeClaim")
                     if isinstance(volume, dict)
                     else volume.persistent_volume_claim)
            if claim:
                claims.append(claim["claimName"] if isinstance(claim, dict)
                              else claim.claim_name)
        return claims

    async def test_the_chart_config_would_create_and_mount_a_claim(self):
        # The premise of the other tests: without the hook there is a volume.
        spawner = make_spawner(ANONYMOUS_NAME)
        self.assertTrue(spawner.storage_pvc_ensure)
        self.assertEqual(len(spawner.volumes), 1)
        self.assertEqual(len(await self.claimed_volumes(spawner)), 1)

    async def test_nothing_is_created_for_an_anonymous_session(self):
        # start() reads storage_pvc_ensure before it builds the pod, so this is
        # what decides whether a claim is created at all.
        spawner = make_spawner(ANONYMOUS_NAME)
        pre_spawn_hook(spawner)
        self.assertFalse(spawner.storage_pvc_ensure)

    async def test_nothing_is_mounted_into_an_anonymous_pod(self):
        spawner = make_spawner(ANONYMOUS_NAME)
        pre_spawn_hook(spawner)
        self.assertEqual(spawner.volumes, [])
        self.assertEqual(spawner.volume_mounts, [])
        self.assertEqual(await self.claimed_volumes(spawner), [])

    async def test_legacy_anonymous_names_are_covered_too(self):
        spawner = make_spawner(LEGACY_ANONYMOUS_NAME)
        pre_spawn_hook(spawner)
        self.assertFalse(spawner.storage_pvc_ensure)
        self.assertEqual(await self.claimed_volumes(spawner), [])

    async def test_a_real_user_keeps_their_home_volume(self):
        spawner = make_spawner(KEYCLOAK_SUB)
        pre_spawn_hook(spawner)
        self.assertTrue(spawner.storage_pvc_ensure)
        self.assertEqual(len(spawner.volumes), 1)
        self.assertEqual(len(await self.claimed_volumes(spawner)), 1)

    async def test_the_admin_users_keep_their_home_volume(self):
        # `a` is close to the legacy `a-` prefix, and both names are in
        # hub.config.Authenticator.admin_users.
        for username in ("a", "filippo@metacell.us"):
            spawner = make_spawner(username)
            pre_spawn_hook(spawner)
            self.assertTrue(spawner.storage_pvc_ensure, username)
            self.assertEqual(len(spawner.volumes), 1, username)


if __name__ == "__main__":
    unittest.main()
