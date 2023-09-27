from kubernetes.client import V1PersistentVolumeClaim, V1PersistentVolumeClaimSpec, V1ObjectMeta, V1TypedLocalObjectReference, V1ResourceRequirements

from cloudharness import log
from cloudharness.applications import get_configuration


from cloudharness.applications import get_configuration

import workspaces.persistence as repos


def create_volume(name, size="2G"):
    from cloudharness.service import pvc
    pvc.create_persistent_volume_claim(name=name, size=size, logger=log, useNFS=True)
