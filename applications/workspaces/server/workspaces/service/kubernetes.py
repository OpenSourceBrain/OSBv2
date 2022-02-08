from cloudharness.service import pvc
import workspaces.repository as repos

def create_persistent_volume_claim(name, size, logger):
    pvc.create_persistent_volume_claim(name, size, logger)

def clone_workspace_volume(source_ws_id, dest_ws_id):
    try:
        source_pvc_name = repos.WorkspaceRepository().get_pvc_name(
            source_ws_id)
        dest_pvc_name = repos.WorkspaceRepository().get_pvc_name(
            dest_ws_id)
        from cloudharness.infrastructure import k8s
        from cloudharness.applications import get_configuration
        from kubernetes.client import V1PersistentVolumeClaim, V1PersistentVolumeClaimSpec, V1ObjectMeta, V1TypedLocalObjectReference, V1ResourceRequirements
        k8s.api_instance.create_namespaced_persistent_volume_claim(namespace=k8s.namespace, body=V1PersistentVolumeClaim(
            metadata=V1ObjectMeta(name=dest_pvc_name),
            spec=V1PersistentVolumeClaimSpec(
                access_modes=["ReadWriteOnce","ReadOnlyMany"],
                storage_class_name="standard",
                data_source=V1TypedLocalObjectReference(
                    kind="PersistentVolumeClaim", name=source_pvc_name),
                resources=V1ResourceRequirements(requests=dict(storage=get_configuration('workspaces').conf['workspace_size']))
            )
        )
        )
    except Exception as e:
        raise Exception(f"An error occurred while cloning the workspace {source_ws_id}") from e