"""Report and delete user volumes whose JupyterHub user no longer exists.

User home volumes are named after the JupyterHub database row id
(``singleuser.storage.dynamic.pvcNameTemplate: osb-user-{userid}``), so once the
user row is gone there is nothing left to connect a claim to anybody: it just
sits on the NFS server forever.

Anonymous sessions used to leak one claim each, because KubeSpawner decides
whether to create it before the spawner hooks run - 97 of the 100 ``osb-user-*``
claims on the dev cluster belonged to anonymous users.
``osb_jupyter.pre_spawn_hook`` stops new ones from being created; this tool
reclaims the ones already there.

It has to run inside the hub pod, where the hub database and the pod's service
account are available::

    kubectl -n <namespace> exec deploy/hub -- python3 -m osb_jupyter.orphan_pvcs
    kubectl -n <namespace> exec deploy/hub -- python3 -m osb_jupyter.orphan_pvcs --yes

Without ``--yes`` nothing is deleted, only listed. Claims referenced by a pod, or
younger than ``--min-age-hours``, are never touched - a spawn may be in flight.
Run it after ``osb_jupyter.anon_cull`` has removed the anonymous users, since a
claim only looks orphaned once its user row is gone.
"""

import argparse
import logging
import re
import sqlite3
import sys
from datetime import datetime, timedelta, timezone

log = logging.getLogger("osb-orphan-pvcs")

DEFAULT_DB_PATH = "/srv/jupyterhub/jupyterhub.sqlite"
DEFAULT_PVC_PREFIX = "osb-user-"
DEFAULT_MIN_AGE_HOURS = 1
NAMESPACE_PATH = "/var/run/secrets/kubernetes.io/serviceaccount/namespace"


def live_user_ids(db_path):
    """Ids of the users still in the hub database.

    Opened read only: the hub is running and owns this file.
    """
    connection = sqlite3.connect("file:%s?mode=ro" % db_path, uri=True)
    try:
        return {row[0] for row in connection.execute("select id from users")}
    finally:
        connection.close()


def claimed_pvc_names(core_api, namespace):
    """Names of the claims referenced by a pod, whatever its state."""
    claimed = set()
    for pod in core_api.list_namespaced_pod(namespace).items:
        for volume in pod.spec.volumes or []:
            claim = getattr(volume, "persistent_volume_claim", None)
            if claim is not None:
                claimed.add(claim.claim_name)
    return claimed


def find_orphans(core_api, namespace, db_path, pvc_prefix, min_age_hours):
    user_ids = live_user_ids(db_path)
    claimed = claimed_pvc_names(core_api, namespace)
    pattern = re.compile("^%s([0-9]+)$" % re.escape(pvc_prefix))
    cutoff = datetime.now(timezone.utc) - timedelta(hours=min_age_hours)

    orphans = []
    for pvc in core_api.list_namespaced_persistent_volume_claim(namespace).items:
        name = pvc.metadata.name
        match = pattern.match(name)
        if not match:
            continue
        if int(match.group(1)) in user_ids:
            continue
        if name in claimed:
            log.info("Keeping %s: still referenced by a pod", name)
            continue
        created = pvc.metadata.creation_timestamp
        if created and created > cutoff:
            log.info("Keeping %s: created %s, younger than %dh",
                     name, created, min_age_hours)
            continue
        orphans.append(pvc)
    return orphans


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--namespace", help="defaults to the namespace of the running pod")
    parser.add_argument(
        "--db", default=DEFAULT_DB_PATH, help="path to the hub sqlite database")
    parser.add_argument(
        "--pvc-prefix", default=DEFAULT_PVC_PREFIX,
        help="prefix of the user volume names, as configured in pvcNameTemplate")
    parser.add_argument(
        "--min-age-hours", type=int, default=DEFAULT_MIN_AGE_HOURS,
        help="never delete claims younger than this")
    parser.add_argument(
        "--yes", action="store_true",
        help="actually delete: without it the orphans are only listed")
    return parser.parse_args(argv)


def main(argv=None):
    args = parse_args(argv)
    logging.basicConfig(
        stream=sys.stdout, level=logging.INFO,
        format="[%(asctime)s] %(levelname)s %(name)s %(message)s")

    from kubernetes import client, config
    try:
        config.load_incluster_config()
    except config.ConfigException:
        config.load_kube_config()
    core_api = client.CoreV1Api()

    namespace = args.namespace
    if not namespace:
        with open(NAMESPACE_PATH) as namespace_file:
            namespace = namespace_file.read().strip()

    orphans = find_orphans(core_api, namespace, args.db, args.pvc_prefix,
                           args.min_age_hours)
    if not orphans:
        log.info("No orphaned user volumes in %s", namespace)
        return 0

    for pvc in orphans:
        if not args.yes:
            log.info("Would delete %s (%s, created %s)", pvc.metadata.name,
                     pvc.spec.resources.requests.get("storage", "?"),
                     pvc.metadata.creation_timestamp)
            continue
        core_api.delete_namespaced_persistent_volume_claim(
            pvc.metadata.name, namespace)
        log.info("Deleted %s", pvc.metadata.name)

    log.info("%d orphaned user volume(s) %s", len(orphans),
             "deleted" if args.yes else "found, pass --yes to delete them")
    return 0


if __name__ == "__main__":
    sys.exit(main())
