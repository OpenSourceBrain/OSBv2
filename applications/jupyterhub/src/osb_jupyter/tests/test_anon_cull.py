"""Tests for the anonymous session reaper.

`osb_jupyter.anon_cull` deletes users, so the point of these is the safety gate:
it must never match a real user. Run them with::

    python3 -m unittest discover applications/jupyterhub/src/osb_jupyter/tests

The module is loaded straight from its path rather than imported as
`osb_jupyter.anon_cull`, because the package `__init__` pulls in kubespawner and
cloudharness, which only exist in the hub image.
"""

import importlib.util
import os
import unittest
from datetime import datetime, timedelta, timezone

MODULE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "osb_jupyter", "anon_cull.py")

_spec = importlib.util.spec_from_file_location("anon_cull", MODULE_PATH)
anon_cull = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(anon_cull)


# Wall clock rather than a fixed instant, because cull_once reads the clock
# itself. Every age below is a minute or more, so the skew is irrelevant.
NOW = datetime.now(timezone.utc)
TIMEOUT = 3600


def timestamp(**delta):
    return (NOW - timedelta(**delta)).isoformat().replace("+00:00", "Z")


def user(name="anon-0123456789abcdef", **kwargs):
    model = {"name": name, "admin": False, "server": None, "pending": None,
             "created": timestamp(days=1), "last_activity": timestamp(days=1)}
    model.update(kwargs)
    return model


class FakeResponse:
    def __init__(self, body=None, status_code=200):
        self._body = body
        self.status_code = status_code
        self.text = str(body)

    def json(self):
        return self._body

    def raise_for_status(self):
        if self.status_code >= 400:
            raise AssertionError("unexpected status %d" % self.status_code)


class FakeSession:
    """Serves one page of users and records the deletions."""

    def __init__(self, users, pages=None, delete_status=204):
        self.users = users
        self.pages = pages
        self.delete_status = delete_status
        self.deleted = []
        self.requested = []

    def get(self, url, params=None, headers=None, timeout=None):
        self.requested.append(params)
        if self.pages is not None:
            return FakeResponse(self.pages[params["offset"]])
        return FakeResponse({"items": self.users, "_pagination": {}})

    def delete(self, url, timeout=None):
        self.deleted.append(url.rsplit("/", 1)[-1])
        return FakeResponse("", self.delete_status)


class TestAnonymousNames(unittest.TestCase):
    def test_generated_names_match(self):
        self.assertTrue(anon_cull.is_anonymous_name("anon-0123456789abcdef"))
        self.assertTrue(anon_cull.is_anonymous_name("a-0a8001de-0f42c"))

    def test_real_users_never_match(self):
        # Real users are named after their Keycloak `sub`, plus the two names in
        # hub.config.Authenticator.admin_users.
        for name in ("0c15dba8-ad02-4c63-b56b-b1ce223ce594",
                     "a1b2c3d4-ad02-4c63-b56b-b1ce223ce594",
                     "a", "filippo@metacell.us", "admin", "", None):
            self.assertFalse(anon_cull.is_anonymous_name(name), name)

    def test_near_misses_never_match(self):
        for name in ("anon-0123456789abcde",     # too short
                     "anon-0123456789abcdef0",   # too long
                     "anon-0123456789abcdeZ",    # not hex
                     "anon-",
                     "xanon-0123456789abcdef",
                     "anon-0123456789abcdef/../etc",
                     "a-0a8001de-0f42c-extra"):
            self.assertFalse(anon_cull.is_anonymous_name(name), name)


class TestIsReapable(unittest.TestCase):
    def test_idle_anonymous_session(self):
        self.assertTrue(anon_cull.is_reapable(user(), NOW, TIMEOUT))

    def test_recently_active_session_is_kept(self):
        recent = user(last_activity=timestamp(minutes=5))
        self.assertFalse(anon_cull.is_reapable(recent, NOW, TIMEOUT))

    def test_activity_wins_over_creation(self):
        # Most anonymous users never report activity, so `created` is the
        # fallback - but it must not override a recent activity.
        model = user(created=timestamp(days=7), last_activity=timestamp(minutes=1))
        self.assertFalse(anon_cull.is_reapable(model, NOW, TIMEOUT))

    def test_created_used_when_activity_is_missing(self):
        self.assertTrue(anon_cull.is_reapable(
            user(last_activity=None), NOW, TIMEOUT))
        self.assertFalse(anon_cull.is_reapable(
            user(last_activity=None, created=timestamp(minutes=5)), NOW, TIMEOUT))

    def test_running_or_pending_session_is_kept(self):
        self.assertFalse(anon_cull.is_reapable(
            user(server="/user/anon-0123456789abcdef/"), NOW, TIMEOUT))
        self.assertFalse(anon_cull.is_reapable(
            user(pending="spawn"), NOW, TIMEOUT))
        self.assertFalse(anon_cull.is_reapable(
            user(servers={"": {}}), NOW, TIMEOUT))

    def test_admins_and_real_users_are_kept(self):
        self.assertFalse(anon_cull.is_reapable(user(admin=True), NOW, TIMEOUT))
        self.assertFalse(anon_cull.is_reapable(
            user(name="0c15dba8-ad02-4c63-b56b-b1ce223ce594"), NOW, TIMEOUT))

    def test_missing_timestamps_are_kept(self):
        self.assertFalse(anon_cull.is_reapable(
            user(created=None, last_activity=None), NOW, TIMEOUT))
        self.assertFalse(anon_cull.is_reapable(
            user(created="not a date", last_activity=None), NOW, TIMEOUT))


class TestCullOnce(unittest.TestCase):
    def cull(self, users, **kwargs):
        session = FakeSession(users)
        options = dict(timeout=TIMEOUT, max_per_pass=0, page_size=200)
        options.update(kwargs)
        deleted = anon_cull.cull_once(session, "http://hub/api", **options)
        return session, deleted

    def test_deletes_only_idle_anonymous_users(self):
        users = [user(name="anon-0000000000000001", created=timestamp(days=3)),
                 user(name="0c15dba8-ad02-4c63-b56b-b1ce223ce594"),
                 user(name="anon-0000000000000002", last_activity=timestamp(minutes=1)),
                 user(name="a-0a8001de-0f42c", created=timestamp(days=2)),
                 # newest anonymous session: kept as the id high-water mark
                 user(name="anon-0000000000000003", created=timestamp(hours=2))]
        session, deleted = self.cull(users)
        self.assertEqual(deleted, 2)
        self.assertEqual(session.deleted,
                         ["anon-0000000000000001", "a-0a8001de-0f42c"])

    def test_max_per_pass_caps_deletions(self):
        users = [user(name="anon-%016x" % index, created=timestamp(days=index + 1))
                 for index in range(10)]
        session, deleted = self.cull(users, max_per_pass=3)
        self.assertEqual(deleted, 3)
        self.assertEqual(len(session.deleted), 3)

    def test_dry_run_deletes_nothing(self):
        session, deleted = self.cull([user(), user(name="anon-000000000000000f")],
                                     dry_run=True)
        self.assertEqual(deleted, 1)
        self.assertEqual(session.deleted, [])

    def test_a_single_idle_session_is_kept(self):
        # It is the newest one, so deleting it would let the next user reuse its
        # id - see hold_high_water_mark.
        session, deleted = self.cull([user()])
        self.assertEqual(deleted, 0)
        self.assertEqual(session.deleted, [])

    def test_only_inactive_users_are_requested(self):
        session, _ = self.cull([user()])
        self.assertEqual(session.requested[0]["state"], "inactive")

    def test_a_started_server_is_left_for_the_next_pass(self):
        users = [user(created=timestamp(days=2)),
                 user(name="anon-000000000000000f")]
        session = FakeSession(users, delete_status=400)
        deleted = anon_cull.cull_once(session, "http://hub/api", TIMEOUT, 0, 200)
        self.assertEqual(deleted, 0)


class TestHighWaterMark(unittest.TestCase):
    """User ids are recycled sqlite rowids, so the newest session is kept."""

    def test_keeps_the_most_recently_created(self):
        users = [user(name="anon-000000000000000a", created=timestamp(days=3)),
                 user(name="anon-000000000000000c", created=timestamp(minutes=90)),
                 user(name="anon-000000000000000b", created=timestamp(days=1))]
        kept = {model["name"] for model in users} - {
            model["name"] for model in anon_cull.hold_high_water_mark(users)}
        self.assertEqual(kept, {"anon-000000000000000c"})

    def test_keeps_the_only_session(self):
        self.assertEqual(anon_cull.hold_high_water_mark([user()]), [])

    def test_handles_an_empty_list(self):
        self.assertEqual(anon_cull.hold_high_water_mark([]), [])

    def test_survives_a_missing_creation_date(self):
        users = [user(name="anon-000000000000000a", created=None),
                 user(name="anon-000000000000000b", created=timestamp(days=1))]
        self.assertEqual([model["name"] for model in
                          anon_cull.hold_high_water_mark(users)],
                         ["anon-000000000000000a"])


class TestPagination(unittest.TestCase):
    def test_follows_the_next_page(self):
        pages = {
            0: {"items": [user(name="anon-%016x" % index) for index in range(2)],
                "_pagination": {"next": {"offset": 2, "limit": 2}}},
            2: {"items": [user(name="anon-000000000000000f")],
                "_pagination": {"next": None}},
        }
        session = FakeSession(None, pages=pages)
        users = anon_cull.list_inactive_users(session, "http://hub/api", 2)
        self.assertEqual(len(users), 3)

    def test_handles_a_plain_list_response(self):
        session = FakeSession(None, pages={0: [user()]})
        users = anon_cull.list_inactive_users(session, "http://hub/api", 2)
        self.assertEqual(len(users), 1)


if __name__ == "__main__":
    unittest.main()
