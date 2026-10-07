# coding: utf-8
"""
Authentication helpers for OSBv2 Selenium tests.

Supports two strategies, controlled by the ``AUTH_METHOD`` config value:

**ui** (default)
    Drive the Keycloak login page — click "Sign in", fill the username and
    password fields, submit.  This mirrors what a real user does and is the
    most robust option.

**cookie**
    Bypass the login form by injecting a valid ``kc-access`` cookie directly
    into the browser session.  You must provide a pre-obtained JWT token via
    the ``KC_ACCESS_TOKEN`` environment variable.  Useful for fast local
    iteration when you have a long-lived token.

Examples
--------
    # UI login (default)
    pytest tests/ -k test_login

    # Cookie-based auth
    KC_ACCESS_TOKEN="eyJhbGci..." AUTH_METHOD=cookie pytest tests/
"""

import logging

from selenium.webdriver.remote.webdriver import WebDriver

from config import AUTH_METHOD, OSB_USERNAME, OSB_PASSWORD
from css_selectors import (
    LOGIN_BTN,
    LOGIN_BUTTON,
    PASSWORD_FIELD,
    SIGN_IN,
    USERNAME_FIELD,
    USER_MENU_BTN,
)

logger = logging.getLogger(__name__)


def login(driver: WebDriver) -> None:
    """
    Authenticate the browser session.

    Dispatches to :func:`login_via_ui` or :func:`login_via_cookie` based on
    the ``AUTH_METHOD`` configuration value.
    """
    if AUTH_METHOD == "cookie":
        _login_via_cookie(driver)
    else:
        _login_via_ui(driver)


def _login_via_ui(driver: WebDriver) -> None:
    """
    Authenticate by clicking through the Keycloak login form.

    Raises
    ------
    ValueError
        If ``OSB_USERNAME`` or ``OSB_PASSWORD`` are empty.
    RuntimeError
        If Keycloak reports an authentication error.
    """
    import time as _time

    if not OSB_USERNAME or not OSB_PASSWORD:
        raise ValueError(
            "UI login requires OSB_USERNAME and OSB_PASSWORD environment variables. "
            "Set them or use AUTH_METHOD=cookie with KC_ACCESS_TOKEN."
        )

    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC

    # Step 1: Wait for the "Sign in" button to be clickable, then click.
    # The staging cluster is on slim resources — generous timeouts needed.
    wait = WebDriverWait(driver, 60)
    wait.until(EC.element_to_be_clickable(("css selector", SIGN_IN)))
    logger.info("Clicking 'Sign in' button.")
    driver.find_element("css selector", SIGN_IN).click()
    _time.sleep(3)

    # Step 2: Wait for the Keycloak login page to fully load.
    # Slow cluster: give it up to 120 seconds.
    _time.sleep(3)
    kc_wait = WebDriverWait(driver, 120)
    kc_wait.until(EC.presence_of_element_located(("css selector", USERNAME_FIELD)))
    kc_wait.until(EC.presence_of_element_located(("css selector", PASSWORD_FIELD)))
    logger.info("On Keycloak login page: %s", driver.current_url)

    # Step 3: Fill the Keycloak login form using JavaScript.
    # Some Keycloak versions require specific JS events (input/change)
    # that send_keys may not trigger in all browsers.
    _time.sleep(1)
    driver.execute_script(
        "document.querySelector('#username').value = arguments[0];"
        "document.querySelector('#password').value = arguments[1];"
        "document.querySelector('#username').dispatchEvent(new Event('input', {bubbles: true}));"
        "document.querySelector('#password').dispatchEvent(new Event('input', {bubbles: true}));",
        OSB_USERNAME, OSB_PASSWORD,
    )
    _time.sleep(1)

    # Step 4: Submit by clicking the #kc-login button.
    # The staging instance's Keycloak does NOT respond to Enter key;
    # the button must be clicked explicitly.
    logger.info("Clicking Keycloak login button.")
    _time.sleep(1)
    kc_login_wait = WebDriverWait(driver, 30)
    login_btn = kc_login_wait.until(EC.element_to_be_clickable(("css selector", LOGIN_BUTTON)))
    login_btn.click()
    _time.sleep(5)

    # Step 5: Check whether we're still on the Keycloak login page
    # (authentication failed), or back on the portal.
    current_url = driver.current_url
    body_text = driver.find_element("tag name", "body").text or ""

    if "accounts." in current_url and "invalid username or password" in body_text.lower():
        raise RuntimeError(
            "Keycloak login failed: Invalid username or password. "
            "Check USERNAME and PASSWORD in tests/.env."
        )

    # Also check for other error patterns.
    for error_class in (".alert-error", "#input-error"):
        try:
            error_el = driver.find_element("css selector", error_class)
            error_text = error_el.text.strip() or "Unknown error"
            if error_text:
                raise RuntimeError(
                    f"Keycloak login failed: {error_text}. "
                    "Check OSB_USERNAME and OSB_PASSWORD in tests/.env."
                )
        except Exception:
            pass

    # Step 6: Wait for the portal to reload with the user menu visible.
    # The OAuth redirect chain (Keycloak → portal, cookie set, React init)
    # can be slow on the slim staging cluster.
    logger.info("Waiting for portal to reload after login (up to 60s)...")
    wait = WebDriverWait(driver, 60)
    wait.until(EC.presence_of_element_located(("css selector", USER_MENU_BTN)))

    logger.info("Login successful – user menu is now visible.")


def _login_via_cookie(driver: WebDriver) -> None:
    """
    Authenticate by setting the ``kc-access`` cookie directly.

    The cookie must be a valid, non-expired Keycloak JWT.  Provide it via
    the ``KC_ACCESS_TOKEN`` environment variable.

    This strategy visits the home page first so the cookie domain is
    established, then injects the cookie and refreshes.
    """
    import os

    token = os.getenv("KC_ACCESS_TOKEN", "")
    if not token:
        raise ValueError(
            "Cookie login requires KC_ACCESS_TOKEN environment variable."
        )

    logger.info("Setting kc-access cookie directly (bypassing login form).")

    # Visit the home page so the browser has the correct domain for the cookie.
    from config import APP_URL
    driver.get(APP_URL)

    # Set the authentication cookie that the portal expects.
    driver.add_cookie({"name": "kc-access", "value": token, "path": "/"})

    # Refresh so the React app picks up the cookie and dispatches userLogin.
    driver.refresh()

    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC

    wait = WebDriverWait(driver, 15)
    wait.until(EC.presence_of_element_located(("css selector", USER_MENU_BTN)))

    logger.info("Cookie login successful – user menu is now visible.")


def logout(driver: WebDriver) -> None:
    """
    Log the current user out via the header user menu.

    Expects the user menu button to be visible (i.e. the user is logged in).
    After logging out, waits for the sign-in button to reappear.
    """
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC

    # Slow cluster: wait up to 30s for the user menu to appear.
    wait = WebDriverWait(driver, 30)

    # Open the user menu.
    logger.info("Opening user menu.")
    wait.until(EC.element_to_be_clickable(("css selector", USER_MENU_BTN)))
    driver.find_element("css selector", USER_MENU_BTN).click()

    # Click the "Logout" menu item.
    from css_selectors import LOGOUT_MENU_ITEM
    wait.until(EC.element_to_be_clickable(("css selector", LOGOUT_MENU_ITEM)))
    driver.find_element("css selector", LOGOUT_MENU_ITEM).click()

    # Wait for sign-in button to reappear (confirms logout).
    wait.until(EC.element_to_be_clickable(("css selector", LOGIN_BTN)))

    logger.info("Logout successful – sign-in button is now visible.")


def ensure_logged_in(driver: WebDriver) -> None:
    """
    Ensure the browser is authenticated.  If the user menu is already
    visible we skip login, otherwise we perform the login flow.

    Useful as a test-fixture setup step that can be called from any test.
    """
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException

    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(("css selector", USER_MENU_BTN))
        )
        logger.info("Already logged in – skipping login step.")
    except TimeoutException:
        logger.info("Not logged in – running login flow.")
        login(driver)
