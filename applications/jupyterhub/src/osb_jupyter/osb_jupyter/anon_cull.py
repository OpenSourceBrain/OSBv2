"""Delete idle anonymous users from the JupyterHub database.

Every visitor without a Keycloak token gets an anonymous JupyterHub user (see
``chauthenticator.auth``). Those identities are disposable, but nothing removed
them: on the dev hub 811 of 816 user rows were anonymous sessions, most of which
had never even run a server.

``jupyterhub-idle-culler`` cannot do this job. Its ``--cull-users`` flag deletes
*every* inactive user, and for a real user that is destructive: the home volume
is named after the JupyterHub row id (``singleuser.storage.dynamic
.pvcNameTemplate: osb-user-{userid}``) and ``legacyusermax`` is compared against
it, so a deleted user comes back with a new id, an empty home directory and
different volume affinity.

This reaper only ever deletes users that match a name pattern we generate for
anonymous sessions, are not admins and have no server. It runs as a JupyterHub
managed service (see ``hub.extraConfig.osb_anonymous`` in
``applications/jupyterhub/deploy/values.yaml``), so JupyterHub passes
JUPYTERHUB_API_URL and JUPYTERHUB_API_TOKEN in the environment. To run it by
hand, set those two variables and pass ``--once``.

Anonymous sessions no longer create a volume (``osb_jupyter.pre_spawn_hook``),
so nothing outside the database is left behind. The claims leaked by earlier
releases are cleaned up by ``osb_jupyter.orphan_pvcs``, which has to run after
this reaper has removed the users owning them.
"""

import argparse
import logging
import os
import re
import sys
import time
from datetime import datetime, timezone
from urllib.parse import quote

import requests

log = logging.getLogger("osb-anonymous-cull")

# The only names this tool may ever delete. Spelled out here rather than derived
# from the prefixes in chauthenticator.auth on purpose: this is the safety gate
# of a destructive job, and it must not widen silently if the way usernames are
# generated changes. Keycloak `sub` UUIDs - what real users are named after -
# cannot match either pattern, and neither can the `admin_users` names.
DELETABLE_NAME_PATTERNS = (
    # current scheme: anon-<16 hex>, one per browser
    re.compile(r"^anon-[0-9a-f]{16}$"),
    # legacy scheme: a-<remote ip as 8 hex>-<5 hex>, one per request
    re.compile(r"^a-[0-9a-f]{8}-[0-9a-f]{5}$"),
)

DEFAULT_TIMEOUT = 3600
DEFAULT_EVERY = 600
DEFAULT_MAX_PER_PASS = 200
DEFAULT_PAGE_SIZE = 200


def is_anonymous_name(name):
    return any(pattern.match(name or "") for pattern in DELETABLE_NAME_PATTERNS)


def parse_timestamp(value):
    """Parse a JupyterHub API timestamp, which is ISO 8601 in UTC."""
    if not value:
        return None
    # `datetime.fromisoformat` only accepts the `Z` suffix from python 3.11 on.
    if value.endswith("Z"):
        value = value[:-1] + "+00:00"
    try:
        parsed = datetime.fromisoformat(value)
    except ValueError:
        log.warning("Could not parse timestamp %r", value)
        return None
    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=timezone.utc)
    return parsed


def is_reapable(user, now, timeout):
    """Whether an anonymous session has been idle long enough to be deleted."""
    if not is_anonymous_name(user.get("name")):
        return False
    if user.get("admin"):
        return False
    # `state=inactive` already excludes users with a server record, but a spawn
    # may have started in between - never delete a session someone is using.
    if user.get("server") or user.get("pending") or user.get("servers"):
        return False
    # Most anonymous users never report activity at all: they are created by the
    # login handler and abandoned, so fall back to when the row was created.
    idle_since = parse_timestamp(
        user.get("last_activity") or user.get("created"))
    if idle_since is None:
        return False
    return (now - idle_since).total_seconds() > timeout


def hold_high_water_mark(reapable):
    """Keep the newest anonymous session, so user ids never go backwards.

    `users.id` is a plain sqlite rowid with no AUTOINCREMENT, so ids are
    *reused*: delete the highest ones and the next user created gets one of them
    back. Two things here are derived from that id - the home volume name
    (`pvcNameTemplate: osb-user-{userid}`) and the `legacyusermax` cutoff - so a
    recycled id would hand a new user a stale volume or the legacy volume
    affinity.

    Ids are handed out in creation order, so keeping the most recently created
    session keeps the high-water mark in place. It costs one row, and that row is
    released on the next pass once a newer session has taken over.
    """
    if len(reapable) < 2:
        return []
    # Timestamps are ISO 8601 in UTC, so they sort as strings.
    newest = max(reapable, key=lambda user: user.get("created") or "")
    return [user for user in reapable if user is not newest]


def list_inactive_users(session, api_url, page_size):
    """All users with no running server, one page at a time."""
    users = []
    offset = 0
    while True:
        response = session.get(
            "%s/users" % api_url,
            params={"state": "inactive", "offset": offset, "limit": page_size},
            headers={"Accept": "application/jupyterhub-pagination+json"},
            timeout=30,
        )
        response.raise_for_status()
        body = response.json()
        if isinstance(body, dict):
            page = body.get("items", [])
            pagination = body.get("_pagination", {})
        else:
            # A hub that does not support pagination returned the whole list.
            page = body
            pagination = {}
        users.extend(page)
        next_page = pagination.get("next")
        if not page or not next_page:
            return users
        offset = next_page["offset"]


def delete_user(session, api_url, name):
    response = session.delete(
        "%s/users/%s" % (api_url, quote(name)), timeout=30)
    if response.status_code == 204:
        return True
    if response.status_code in (400, 404, 409):
        # Started a server or was deleted since it was listed: leave it for the
        # next pass.
        log.info("Skipping %s: %s %s", name,
                 response.status_code, response.text.strip())
        return False
    response.raise_for_status()
    return False


def cull_once(session, api_url, timeout, max_per_pass, page_size, dry_run=False):
    now = datetime.now(timezone.utc)
    inactive = list_inactive_users(session, api_url, page_size)
    reapable = hold_high_water_mark(
        [user for user in inactive if is_reapable(user, now, timeout)])
    if max_per_pass and len(reapable) > max_per_pass:
        # Cap the damage a single pass can do, so a mistake is noticed before it
        # has worked through the whole table.
        log.info("%d anonymous sessions are idle, deleting %d of them this pass",
                 len(reapable), max_per_pass)
        reapable = reapable[:max_per_pass]
    deleted = 0
    for user in reapable:
        name = user["name"]
        if dry_run:
            log.info("Would delete %s (last activity %s, created %s)",
                     name, user.get("last_activity"), user.get("created"))
            deleted += 1
            continue
        if delete_user(session, api_url, name):
            log.info("Deleted anonymous session %s", name)
            deleted += 1
    log.info("Pass complete: %d inactive users, %d anonymous sessions %s",
             len(inactive), deleted, "to delete" if dry_run else "deleted")
    return deleted


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--timeout", type=int, default=DEFAULT_TIMEOUT,
        help="delete anonymous sessions idle for longer than this many seconds")
    parser.add_argument(
        "--every", type=int, default=DEFAULT_EVERY,
        help="seconds between passes")
    parser.add_argument(
        "--max-per-pass", type=int, default=DEFAULT_MAX_PER_PASS,
        help="most sessions to delete in one pass, 0 for no limit")
    parser.add_argument(
        "--page-size", type=int, default=DEFAULT_PAGE_SIZE,
        help="users to request per API page")
    parser.add_argument(
        "--api-url", default=os.environ.get("JUPYTERHUB_API_URL"),
        help="hub API url, defaults to $JUPYTERHUB_API_URL")
    parser.add_argument(
        "--once", action="store_true", help="run a single pass and exit")
    parser.add_argument(
        "--dry-run", action="store_true",
        help="report what would be deleted without deleting anything")
    return parser.parse_args(argv)


def main(argv=None):
    args = parse_args(argv)
    logging.basicConfig(
        stream=sys.stdout, level=logging.INFO,
        format="[%(asctime)s] %(levelname)s %(name)s %(message)s")

    api_url = (args.api_url or "").rstrip("/")
    token = os.environ.get("JUPYTERHUB_API_TOKEN")
    if not api_url or not token:
        log.error("JUPYTERHUB_API_URL and JUPYTERHUB_API_TOKEN are required")
        return 1

    session = requests.Session()
    session.headers["Authorization"] = "token %s" % token

    while True:
        try:
            cull_once(session, api_url, args.timeout, args.max_per_pass,
                      args.page_size, dry_run=args.dry_run)
        except Exception:
            # A failed pass must not take the service down: the hub would keep
            # restarting it and the sessions would pile up unnoticed.
            log.exception("Anonymous session cull failed")
        if args.once:
            return 0
        time.sleep(args.every)


if __name__ == "__main__":
    sys.exit(main())
