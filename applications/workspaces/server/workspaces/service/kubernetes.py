from kubernetes.client import V1PersistentVolumeClaim, V1PersistentVolumeClaimSpec, V1ObjectMeta, V1TypedLocalObjectReference, V1ResourceRequirements

from cloudharness import log
from cloudharness.applications import get_configuration


from cloudharness.applications import get_configuration

import workspaces.repository as repos


def create_volume(name, size="2G"):
    from cloudharness.service import pvc
    pvc.create_persistent_volume_claim(name, size, log)


def clone_workspace_volume(source_pvc_name, dest_pvc_name, size):
    try:
        from cloudharness.infrastructure import k8s
        

        k8s.api_instance.create_namespaced_persistent_volume_claim(namespace=k8s.namespace, body=V1PersistentVolumeClaim(
            metadata=V1ObjectMeta(name=dest_pvc_name),
            spec=V1PersistentVolumeClaimSpec(
                access_modes=["ReadWriteOnce", "ReadOnlyMany"],
                storage_class_name="standard",
                data_source=V1TypedLocalObjectReference(
                    kind="PersistentVolumeClaim", name=source_pvc_name),
                resources=V1ResourceRequirements(requests=dict(
                    storage=get_configuration('workspaces').conf['workspace_size']))
            )
        )
        )
    except Exception as e:
        raise Exception(
            f"An error occurred while cloning the persistent volume claim {source_pvc_name}") from e
