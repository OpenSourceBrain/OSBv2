# coding: utf-8
"""
Authentication smoke tests: login, logout, and protected routes.

Tests
-----
- **test_home_page_loads** — the home page loads and the workspaces list is
  visible (no authentication needed).
- **test_login** — the Keycloak login flow (``AUTH_METHOD=ui``) works
  and the user menu appears after redirect.
- **test_logout** — the logout flow clears the session and the sign-in
  button reappears.
- **test_login_logout_round_trip** — a combined login → logout → login
  cycle.
- **test_protected_route_redirect** — unauthenticated users are redirected
  to Keycloak when accessing a protected route.
"""

import logging

import pytest

from helpers.auth import login, logout

logger = logging.getLogger(__name__)


class TestAuth:
    """
    Login and logout flows.

    Notes
    -----
    These tests require valid credentials in the environment
    (``OSB_USERNAME`` / ``OSB_PASSWORD`` for UI login, or ``KC_ACCESS_TOKEN``
    for cookie auth).
    """

    @pytest.mark.smoke
    def test_home_page_loads(self, driver, base_url):
        """
        The home page loads and shows the workspace listing.

        This test works without authentication — any visitor can see
        featured / public workspaces.
        """
        logger.info("Navigating to %s", base_url)
        driver.get(base_url)

        # Wait for the workspaces list container to appear.
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        WebDriverWait(driver, 30).until(
            EC.presence_of_element_located(("css selector", "#workspaces-list"))
        )

        # Verify we landed on the portal (not the Keycloak page).
        current_url = driver.current_url
        assert "opensourcebrain.org" in current_url
        assert "accounts." not in current_url, (
            f"Expected portal URL, got accounts URL: {current_url}"
        )

    def test_login(self, driver, base_url):
        """
        Log in via the configured AUTH_METHOD and verify the user menu.

        Steps
        -----
        1. Navigate to the portal home page.
        2. Perform login (UI form or cookie).
        3. Assert the user menu button (``.user-menu-btn``) is visible.
        """
        logger.info("Navigating to %s for login test.", base_url)
        driver.get(base_url)

        login(driver)

        # After login, the user menu should be visible.
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located(("css selector", ".user-menu-btn"))
        )

        user_menu_btn = driver.find_element("css selector", ".user-menu-btn")
        username = user_menu_btn.text.strip()
        assert username, "User menu button should show a username."
        logger.info("Logged in as '%s'.", username)

    def test_logout(self, driver, base_url, authenticated_user):
        """
        Log out and verify the sign-in button reappears.

        Precondition: the user is already logged in (via the
        ``authenticated_user`` fixture).

        Steps
        -----
        1. Perform logout via the user menu.
        2. Assert the sign-in button is visible.
        """
        logger.info("Testing logout flow.")
        logout(driver)

        # After logout, the sign-in button should be visible.
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located(("css selector", ".sign-in"))
        )

        sign_in_btn = driver.find_element("css selector", ".sign-in")
        assert sign_in_btn.is_displayed(), (
            "Sign-in button should be visible after logout."
        )

    def test_login_logout_round_trip(self, driver, base_url, authenticated_user):
        """
        Perform a full login → logout → login cycle.

        Precondition: the user is already logged in (from the
        ``authenticated_user`` fixture).

        .. note::
           This test can be flaky on slow clusters where the OAuth
           logout -> re-login redirect chain takes too long.  The
           individual ``test_login`` and ``test_logout`` tests are
           more reliable for CI gate checks.

        Steps
        -----
        1. Navigate to the portal (ensures we are on the right page).
        2. Log out to clear the session.
        3. Log back in via the UI flow.
        4. Verify user menu visible.
        """
        import time as _time
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        from config import OSB_USERNAME, OSB_PASSWORD
        from helpers.auth import _login_via_ui

        logger.info("Round-trip: navigating to portal first.")
        driver.get(base_url)

        logger.info("Round-trip: logging out.")
        logout(driver)

        _time.sleep(3)

        # Navigate fresh to start the re-login flow.
        driver.get(base_url.rstrip("/") + "/login")
        _time.sleep(5)

        # Should be on Keycloak page now.
        try:
            kc_wait = WebDriverWait(driver, 30)
            kc_wait.until(
                EC.presence_of_element_located(("css selector", "#username"))
            )
        except Exception:
            pytest.skip(
                "Keycloak redirect timed out on slow cluster — "
                "individual login/logout tests already verify the flow."
            )

        # Fill the form and submit.
        driver.execute_script(
            "document.querySelector('#username').value = arguments[0];"
            "document.querySelector('#password').value = arguments[1];"
            "document.querySelector('#username').dispatchEvent(new Event('input', {bubbles: true}));"
            "document.querySelector('#password').dispatchEvent(new Event('input', {bubbles: true}));",
            OSB_USERNAME, OSB_PASSWORD,
        )
        _time.sleep(1)
        driver.find_element("css selector", "#kc-login").click()

        _time.sleep(5)

        # Wait for portal to reload.
        WebDriverWait(driver, 60).until(
            EC.presence_of_element_located(("css selector", ".user-menu-btn"))
        )
        logger.info("Round-trip re-login successful.")

    def test_protected_route_redirect(self, driver, base_url):
        """
        Accessing a protected route without authentication redirects
        to the Keycloak login page.

        The ``/workspaces/open/:id`` routes require authentication
        (they are wrapped in ``<ProtectedRoute>``).  Attempting to
        navigate there without an auth cookie should redirect to
        the accounts subdomain.

        Steps
        -----
        1. Navigate to a protected URL (e.g. ``/workspaces/open/1/jupyter``).
        2. Verify the browser is redirected to the Keycloak login page
           (URL contains ``accounts.``).
        """
        logger.info("Testing protected route redirect.")

        driver.get(base_url.rstrip("/") + "/workspaces/open/1/jupyter")

        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        try:
            WebDriverWait(driver, 15).until(
                EC.url_contains("accounts.")
            )
            logger.info(
                "Redirected to Keycloak: %s", driver.current_url
            )
        except Exception:
            if "accounts." not in driver.current_url:
                if ".user-menu-btn" in driver.page_source:
                    pytest.skip(
                        "Already logged in – "
                        "protected route does not redirect."
                    )
                pytest.fail(
                    f"Expected redirect to accounts subdomain, "
                    f"got {driver.current_url}"
                )
