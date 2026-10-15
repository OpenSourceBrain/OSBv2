import time

from kubernetes.client import V1PersistentVolumeClaim, V1PersistentVolumeClaimSpec, V1ObjectMeta, V1TypedLocalObjectReference, V1ResourceRequirements
from kubernetes.client.rest import ApiException

from cloudharness import log
from cloudharness.applications import get_configuration


from cloudharness.applications import get_configuration

import workspaces.persistence as repos


def create_volume(name, size="2G"):
    from cloudharness.service import pvc
    try:
        pvc.create_persistent_volume_claim(name=name, size=size, logger=log, useNFS=True)
    except ApiException as e:
        # create_persistent_volume_claim does a non-atomic exists-then-create,
        # so two concurrent callers (e.g. the background create on a plain read
        # and the blocking create when opening) can both pass the existence
        # check and race; the loser gets 409 AlreadyExists. The PVC exists
        # either way, so treat that as success rather than failing the request.
        if e.status == 409:
            return
        raise


def volume_is_ready(name) -> bool:
    """A PVC is ready to be mounted once it is bound to a volume."""
    from cloudharness.service import pvc
    claim = pvc.get_persistent_volume_claim(name)
    return bool(claim and claim.status and claim.status.phase == "Bound")


def wait_for_volume_ready(name, timeout=5, interval=0.5) -> bool:
    """Poll the PVC until it is bound or the timeout (seconds) elapses.

    Returns True as soon as the volume is ready, False if it is still not
    ready after ``timeout`` seconds. Used to guard against NFS flakiness when
    fully opening a workspace.
    """
    deadline = time.monotonic() + timeout
    while True:
        if volume_is_ready(name):
            return True
        if time.monotonic() >= deadline:
            return False
        time.sleep(interval)
