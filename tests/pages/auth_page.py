# coding: utf-8
"""
Page object for the Keycloak authentication pages (login form).

The OSB portal delegates authentication to a Keycloak server running on a
separate subdomain (``accounts.{domain}``).  When the user clicks "Sign in"
on the portal header, the browser is redirected to a Keycloak login page.
After successful authentication, the user is sent back to the portal.

This page object models the Keycloak login form only.  The header-level
sign-in / user-menu interactions are in :class:`HomePage`.
"""

import logging

from pages.base_page import BasePage

logger = logging.getLogger(__name__)


class AuthPage(BasePage):
    """
    Keycloak login form page.

    Notes
    -----
    This page is on a different subdomain than the portal (e.g.
    ``accounts.v2dev.opensourcebrain.org``), so Selenium's same-origin
    restrictions don't matter — the WebDriver operates at the browser level
    and can interact with any page.
    """

    # -- login form ------------------------------------------------------------

    def fill_username(self, username: str) -> None:
        """
        Type into the Keycloak ``#username`` field.

        Parameters
        ----------
        username : str
            The Keycloak username (not email address).
        """
        logger.info("Filling username field.")
        self.type_text("css selector", "#username", username)

    def fill_password(self, password: str) -> None:
        """
        Type into the Keycloak ``#password`` field.

        Parameters
        ----------
        password : str
            The Keycloak password.
        """
        logger.info("Filling password field.")
        self.type_text("css selector", "#password", password)

    def click_login(self) -> None:
        """
        Click the ``#kc-login`` submit button.

        After this click the browser redirects back to the OSB portal.
        The caller should wait for the portal to reload and the user menu
        to appear (use :func:`helpers.auth.login` which handles this end-to-end).
        """
        logger.info("Clicking Keycloak login button.")
        self.click("css selector", "#kc-login")

    def wait_until_loaded(self) -> None:
        """
        Wait until the Keycloak login form fields are present.

        Useful after clicking "Sign in" on the portal to confirm the
        redirect has completed.
        """
        logger.info("Waiting for Keycloak login form to load.")
        self.wait_for("css selector", "#username")
        self.wait_for("css selector", "#password")
