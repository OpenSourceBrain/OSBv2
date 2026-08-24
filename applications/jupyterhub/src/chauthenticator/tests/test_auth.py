"""Tests for the anonymous session handling in the CloudHarness authenticator.

These need jupyterhub, tornado and cloudharness, so they only run inside the
jupyterhub image and skip everywhere else::

    kubectl -n <namespace> exec deploy/hub -- \
        python3 -m unittest discover /usr/src/app/chauthenticator/tests

What they pin down is the anonymous identity lifecycle: one JupyterHub user per
browser rather than per request, and the identity being handed back when the same
browser logs in with a Keycloak token.
"""

import unittest
from http.cookies import SimpleCookie
from types import SimpleNamespace

try:
    from chauthenticator import auth
except Exception as error:  # the hub image is not available
    auth = None
    IMPORT_ERROR = error
else:
    IMPORT_ERROR = None

KEYCLOAK_SUB = "0c15dba8-ad02-4c63-b56b-b1ce223ce594"


def make_handler(cookies="", protocol="https", host="lab.example.org"):
    """A handler with just enough around it to exercise the cookie handling."""
    handler = auth.CloudHarnessAuthenticateHandler.__new__(
        auth.CloudHarnessAuthenticateHandler)
    handler.request = SimpleNamespace(
        cookies=SimpleCookie(cookies), protocol=protocol, host=host,
        remote_ip="203.0.113.7", uri="/hub/chkclogin?next=%2Fhub%2Fspawn")
    handler.cookies_set = {}
    handler.cookies_cleared = {}
    handler.usernames = []

    def set_cookie(name, value, **kwargs):
        handler.cookies_set[name] = (value, kwargs)

    def clear_cookie(name, **kwargs):
        handler.cookies_cleared[name] = kwargs

    def user_from_username(name):
        handler.usernames.append(name)
        return SimpleNamespace(name=name)

    handler.set_cookie = set_cookie
    handler.clear_cookie = clear_cookie
    handler.user_from_username = user_from_username
    # the login side of the handler, which the flow test drives
    handler.clear_login_cookie = lambda: None
    handler.set_login_cookie = lambda user: setattr(handler, "logged_in", user)
    handler.get_next_url = lambda user: "/hub/spawn"
    handler.redirect = lambda url: setattr(handler, "redirected_to", url)
    handler.process_user = lambda user, self_: user
    return handler


@unittest.skipIf(IMPORT_ERROR, "needs the jupyterhub image: %s" % IMPORT_ERROR)
class TestAnonymousIdentity(unittest.TestCase):
    def test_a_new_visitor_gets_an_identity_and_a_cookie(self):
        handler = make_handler()
        user = handler.get_anonymous_user()
        value, options = handler.cookies_set[auth.ANONYMOUS_ID_COOKIE]
        self.assertEqual(user.name, auth.ANONYMOUS_USER_PREFIX + value)
        self.assertTrue(auth.ANONYMOUS_ID_PATTERN.match(value))
        self.assertEqual(options["path"], "/")
        self.assertTrue(options["httponly"])
        # required for the cookie to survive the portal's iframe
        self.assertTrue(options["secure"])
        self.assertEqual(options["samesite"], "None")

    def test_each_app_gets_its_own_session(self):
        """Two apps in one browser must not share a server, and so a pod.

        A direct visit to an app lands on that user's default server, so sharing
        one identity across app subdomains would route the second app into the
        pod the first one spawned - with the first app's image.
        """
        nwb = make_handler(host="nwbexplorer.example.org")
        nwb.get_anonymous_user()
        _, options = nwb.cookies_set[auth.ANONYMOUS_ID_COOKIE]
        # host-only, so the browser does not send it to sibling app subdomains
        self.assertNotIn("domain", options)

        # which means netpyne sees no cookie and mints its own identity
        netpyne = make_handler(host="netpyne.example.org")
        netpyne.get_anonymous_user()
        self.assertNotEqual(netpyne.usernames, nwb.usernames)

    def test_the_same_browser_reuses_one_user(self):
        handler = make_handler(cookies="osb-anon-id=0123456789abcdef")
        first = handler.get_anonymous_user()
        second = handler.get_anonymous_user()
        self.assertEqual(first.name, "anon-0123456789abcdef")
        self.assertEqual(second.name, first.name)
        # nothing to re-set: the browser already has the identity
        self.assertEqual(handler.cookies_set, {})

    def test_a_malformed_cookie_is_ignored(self):
        for value in ("0123456789abcde", "0123456789abcdefff", "../../etc",
                      "0123456789ABCDEF", "anon-0123456789abcdef"):
            handler = make_handler(cookies="osb-anon-id=%s" % value)
            user = handler.get_anonymous_user()
            self.assertNotIn(value, user.name)
            self.assertIn(auth.ANONYMOUS_ID_COOKIE, handler.cookies_set)

    def test_plain_http_gets_a_plain_cookie(self):
        # Secure/SameSite=None would be rejected over http, e.g. locally.
        handler = make_handler(protocol="http", host="lab.osb.local")
        handler.get_anonymous_user()
        _, options = handler.cookies_set[auth.ANONYMOUS_ID_COOKIE]
        self.assertNotIn("secure", options)
        self.assertNotIn("samesite", options)

    def test_the_same_app_reuses_the_session_whatever_the_host_looks_like(self):
        for host in ("lab.osb.local", "localhost:8000", "127.0.0.1", "hub"):
            handler = make_handler(cookies="osb-anon-id=0123456789abcdef",
                                   host=host)
            user = handler.get_anonymous_user()
            self.assertEqual(user.name, "anon-0123456789abcdef", host)
            self.assertEqual(handler.cookies_set, {}, host)


@unittest.skipIf(IMPORT_ERROR, "needs the jupyterhub image: %s" % IMPORT_ERROR)
class TestLoggingIn(unittest.TestCase):
    """Logging in has to take over from the anonymous identity cleanly."""

    def run_get(self, handler):
        from tornado.ioloop import IOLoop
        IOLoop().run_sync(handler.get)

    def login(self, handler):
        from unittest.mock import patch
        with patch.object(auth.AuthClient, "decode_token",
                          return_value={"sub": KEYCLOAK_SUB,
                                        "preferred_username": "someone"}):
            self.run_get(handler)

    def test_a_token_wins_over_the_anonymous_cookie(self):
        handler = make_handler(
            cookies="osb-anon-id=0123456789abcdef; kc-access=a.valid.token")
        self.login(handler)
        self.assertEqual(handler.usernames, [KEYCLOAK_SUB])
        self.assertEqual(handler.logged_in.name, KEYCLOAK_SUB)

    def test_logging_in_drops_the_anonymous_identity(self):
        handler = make_handler(
            cookies="osb-anon-id=0123456789abcdef; kc-access=a.valid.token")
        self.login(handler)
        options = handler.cookies_cleared[auth.ANONYMOUS_ID_COOKIE]
        # the browser only drops it when the attributes match the ones it was
        # set with
        self.assertNotIn("domain", options)
        self.assertEqual(options["path"], "/")
        self.assertTrue(options["secure"])
        self.assertEqual(options["samesite"], "None")

    def test_nothing_is_cleared_when_there_was_no_anonymous_session(self):
        handler = make_handler(cookies="kc-access=a.valid.token")
        self.login(handler)
        self.assertEqual(handler.cookies_cleared, {})

    def test_a_visitor_without_a_token_stays_anonymous(self):
        handler = make_handler(cookies="osb-anon-id=0123456789abcdef")
        self.run_get(handler)
        self.assertEqual(handler.usernames, ["anon-0123456789abcdef"])
        self.assertEqual(handler.cookies_cleared, {})

    def test_an_unusable_token_falls_back_to_the_same_identity(self):
        # A logged in user whose token expired must not leave a new user behind
        # on every iframe mount, which is what the old per-request identity did.
        from unittest.mock import patch
        handler = make_handler(
            cookies="osb-anon-id=0123456789abcdef; kc-access=expired")
        with patch.object(auth.AuthClient, "decode_token",
                          side_effect=ValueError("token expired")):
            self.run_get(handler)
        self.assertEqual(handler.usernames, ["anon-0123456789abcdef"])
        self.assertEqual(handler.cookies_set, {})

    def test_the_placeholder_token_is_anonymous(self):
        handler = make_handler(cookies="accessToken=-1")
        self.run_get(handler)
        self.assertEqual(len(handler.usernames), 1)
        self.assertTrue(handler.usernames[0].startswith(
            auth.ANONYMOUS_USER_PREFIX))


if __name__ == "__main__":
    unittest.main()
