import random
import sys
import logging

from jupyterhub.auth import Authenticator
from jupyterhub.handlers import BaseHandler
from tornado import gen
from traitlets import Bool
from jupyterhub.utils import url_path_join
from cloudharness.auth import AuthClient

handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
logging.getLogger().addHandler(handler)


class CloudHarnessAuthenticateHandler(BaseHandler):
    """
    Handler for /chkclogin
    Creates a new user based on the keycloak user, and auto starts their server
    """

    def initialize(self, force_new_server, process_user):
        super().initialize()
        self.force_new_server = force_new_server
        self.process_user = process_user

    @gen.coroutine
    def get(self):
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
            if accessToken == '-1' or not accessToken:

                raw_user = self.get_anonymous_user()
            else:
                accessToken = accessToken.value
                user_data = AuthClient.decode_token(accessToken)
                username = user_data['sub']
                print("Username", username, "-",
                      user_data['preferred_username'])
                raw_user = self.user_from_username(username)

        except Exception as e:
            logging.info("Error getting user from session", exc_info=True)
            self.request.cookies.clear()
            raw_user = self.get_anonymous_user()

        
     
        # print("JH user: ", raw_user.__dict__)
        self.set_login_cookie(raw_user)
        user = yield gen.maybe_future(self.process_user(raw_user, self))
        self.redirect(self.get_next_url(user))

    def get_anonymous_user(self):
        import socket
        print("Anonymous connection: ", self.request.remote_ip)
        return self.user_from_username("a-%s-%0.5x" % (socket.inet_aton(self.request.remote_ip).hex(), random.randint(0, 99999)))


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
