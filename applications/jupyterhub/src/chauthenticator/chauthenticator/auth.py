import logging
import re
import secrets
import sys

from jupyterhub.auth import Authenticator
from jupyterhub.handlers import BaseHandler
from tornado import gen
from traitlets import Bool
from jupyterhub.utils import url_path_join
from cloudharness.auth import AuthClient

handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
logging.getLogger().addHandler(handler)


# Anonymous sessions are throwaway identities handed to visitors without a
# Keycloak token. They are real JupyterHub users - the hub cannot spawn a server
# without a user row - but they are meant to live only as long as the session:
# osb_jupyter.anon_cull deletes the idle ones and the spawner gives them no
# volume. Everything that has to tell them apart from real users, whose names
# are Keycloak `sub` UUIDs, keys off this prefix.
ANONYMOUS_USER_PREFIX = "anon-"

# Anonymous users minted by the previous scheme, `a-<remote ip in hex>-<random>`,
# which produced a new user on every single request. Still recognised so the
# spawner and the reaper keep treating the leftovers as anonymous.
LEGACY_ANONYMOUS_USER_PREFIX = "a-"

# Pins a browser to one anonymous identity per app, so reloading a page or
# remounting the portal's iframe reuses a session instead of creating another
# user (and another pod).
#
# Deliberately host-only, not shared across the base domain: the identity
# decides which server the visitor lands on, and a direct visit to an app goes to
# that user's *default* server. One identity across netpyne.<domain> and
# nwbexplorer.<domain> would send both to the same default server, so the second
# app would be routed into the pod the first one spawned - running the wrong
# image. Host scope also matches the hub's own login cookie, which carries no
# domain either.
#
# The value only names a scratch session - access is still governed by that
# signed login cookie - but it is http-only so page scripts cannot read or forge
# it.
ANONYMOUS_ID_COOKIE = "osb-anon-id"
ANONYMOUS_ID_BYTES = 8
ANONYMOUS_ID_PATTERN = re.compile("^[0-9a-f]{%d}$" % (2 * ANONYMOUS_ID_BYTES))
ANONYMOUS_ID_COOKIE_DAYS = 30


class CloudHarnessAuthenticateHandler(BaseHandler):
    """
    Handler for /chkclogin
    Creates a new user based on the keycloak user, and auto starts their server
    """

    def initialize(self, force_new_server, process_user):
        print("CH auth handler initialized")
        super().initialize()
        self.force_new_server = force_new_server
        self.process_user = process_user

    @gen.coroutine
    def get(self):
        print("CH auth handler begin")
        if 'open=' in self.request.uri:
            url = self.request.uri.split('open=').pop()
            self.request.cookies.set("loadurl", bytes(
                url, 'utf-8'), encrypted=False, httponly=False)

        # legacy nwb explorer support
        elif 'nwbfile=' in self.request.uri:
            print("Nwb file found")
            url = self.request.uri.split('nwbfile=').pop().split("&")[0]
            print("NWB URL", url)
            self._set_cookie("nwbloadurl", bytes(
                url, 'utf-8'), encrypted=False, httponly=False)
        self.clear_login_cookie()
        try:

            accessToken = self.request.cookies.get(
                'kc-access', None) or self.request.cookies.get('accessToken', None)
            print("Token", accessToken)
            if not accessToken or accessToken.value == '-1':

                raw_user = self.get_anonymous_user()
            else:
                accessToken = accessToken.value
                user_data = AuthClient.decode_token(accessToken)
                username = user_data['sub']
                print("Username", username, "-",
                      user_data['preferred_username'])
                raw_user = self.user_from_username(username)
                # This browser is identified now, so the anonymous handle has
                # served its purpose: drop it rather than leave it around for
                # whoever uses the browser after this user logs out.
                self._clear_anonymous_id_cookie()

        except Exception as e:
            logging.info("Error getting user from session", exc_info=True)
            # Drop the token cookies only: get_anonymous_user still has to read
            # the anonymous id cookie to reuse this browser's identity instead
            # of creating yet another user.
            self.request.cookies.pop('kc-access', None)
            self.request.cookies.pop('accessToken', None)
            raw_user = self.get_anonymous_user()



        # print("JH user: ", raw_user.__dict__)
        self.set_login_cookie(raw_user)
        user = yield gen.maybe_future(self.process_user(raw_user, self))
        self.redirect(self.get_next_url(user))

    def get_anonymous_user(self):
        """Reuse this browser's anonymous identity, or hand out a new one.

        The identity used to be derived from the remote address plus a random
        suffix, which meant a new JupyterHub user - and a new pod - on every
        request, and a 500 for IPv6 clients. It is now pinned to a cookie, so a
        browser maps to a single anonymous user across apps and page loads.
        """
        anonymous_id = self._get_anonymous_id()
        if anonymous_id is None:
            anonymous_id = secrets.token_hex(ANONYMOUS_ID_BYTES)
            self._set_anonymous_id_cookie(anonymous_id)
            logging.info("New anonymous session %s from %s",
                         anonymous_id, self.request.remote_ip)
        else:
            logging.info("Reusing anonymous session %s from %s",
                         anonymous_id, self.request.remote_ip)
        return self.user_from_username(ANONYMOUS_USER_PREFIX + anonymous_id)

    def _get_anonymous_id(self):
        cookie = self.request.cookies.get(ANONYMOUS_ID_COOKIE, None)
        if cookie is None:
            return None
        # The value becomes a username, a pod name and a pod label, so accept
        # nothing but what we generate ourselves.
        if not ANONYMOUS_ID_PATTERN.match(cookie.value):
            logging.warning("Ignoring malformed %s cookie", ANONYMOUS_ID_COOKIE)
            return None
        return cookie.value

    def _anonymous_id_cookie_options(self):
        """Attributes the cookie is set with, and has to be cleared with.

        No domain: see ANONYMOUS_ID_COOKIE, the identity is per app host.
        """
        options = dict(path="/", httponly=True)
        if self.request.protocol == "https":
            # The hub is loaded in the portal's iframe: without these the
            # cookie is dropped on the way back by browsers that treat the
            # embedded context as third party.
            options.update(secure=True, samesite="None")
        return options

    def _set_anonymous_id_cookie(self, anonymous_id):
        self.set_cookie(ANONYMOUS_ID_COOKIE, anonymous_id,
                        expires_days=ANONYMOUS_ID_COOKIE_DAYS,
                        **self._anonymous_id_cookie_options())

    def _clear_anonymous_id_cookie(self):
        if ANONYMOUS_ID_COOKIE not in self.request.cookies:
            return
        # Browsers only drop a cookie when the attributes match the ones it was
        # set with - domain and path always, secure and samesite for a
        # `SameSite=None` one.
        self.clear_cookie(ANONYMOUS_ID_COOKIE,
                          **self._anonymous_id_cookie_options())


class CloudHarnessAuthenticator(Authenticator):
    """
    JupyterHub Authenticator for use with Cloud Harness
    When JupyterHub is configured to use this authenticator, the client 
    needs to set the accessToken domain cookie
    """

    auto_login = True
    login_service = 'chkc'

    force_new_server = Bool(
        True,
        help="""
        Stop the user's server and start a new one when visiting /hub/chlogin
        When set to True, users going to /hub/chlogin will *always* get a
        new single-user server. When set to False, they'll be
        redirected to their current session if one exists.
        """,
        config=True
    )

    def process_user(self, user, handler):
        """
        Do additional arbitrary things to the created user before spawn.
        user is a user object, and handler is a CloudHarnessAuthenticateHandler 
        object. Should return the new user object.
        This method can be a @tornado.gen.coroutine.
        Note: This is primarily for overriding in subclasses
        """
        return user

    def get_handlers(self, app):
        # FIXME: How to do this better?
        extra_settings = {
            'force_new_server': self.force_new_server,
            'process_user': self.process_user
        }
        return [
            ('/chkclogin', CloudHarnessAuthenticateHandler, extra_settings),
            ('/nwbfile=.*', CloudHarnessAuthenticateHandler, extra_settings),
            ('/open=.*', CloudHarnessAuthenticateHandler, extra_settings),
            ('/query?.*', CloudHarnessAuthenticateHandler, extra_settings),
        ]

    def login_url(self, base_url):
        return url_path_join(base_url, 'chkclogin')
