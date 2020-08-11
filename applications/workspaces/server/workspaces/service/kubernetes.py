import os
import kubernetes
import yaml
from ..config import Config

def create_persistent_volume_claim(name, size, logger, **kwargs):

    if not size:
        raise Exception(f"Size must be set. Got {size!r}.")

    if not persistent_volume_claim_exists(name):
        path = os.path.join(Config.TEMPLATE_DIR, 'kubernetes', 'pvc.yaml')
        tmpl = open(path, 'rt').read()
        text = tmpl.format(name=name, size=size)
        data = yaml.safe_load(text)

        obj = _get_api().create_namespaced_persistent_volume_claim(
            namespace=Config.CH_NAMESPACE,
            body=data,
        )
        logger.info(f"PVC child is created: %s", obj)

def persistent_volume_claim_exists(name):
    foundPVCs = _get_api().list_namespaced_persistent_volume_claim(
        namespace=Config.CH_NAMESPACE,
        field_selector=f'metadata.name={name}')
    if len(foundPVCs.items)>0:
        return True
    return False

def _get_api():
    configuration = kubernetes.config.load_incluster_config()
    api_instance = kubernetes.client.CoreV1Api(kubernetes.client.ApiClient(configuration))
    return api_instance
