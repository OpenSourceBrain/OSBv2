# coding: utf-8
"""
Pytest configuration and shared fixtures for OSBv2 Selenium tests.

Fixtures
--------
``driver``
    A Selenium Chrome WebDriver instance.  Session-scoped: one browser
    session is shared across all tests in a worker.

``base_url``
    The application-under-test URL from ``config.APP_URL``.

``authenticated_user``
    A session-level fixture that ensures the browser is logged in.
    Calls :func:`helpers.auth.ensure_logged_in` once per session.

``home_page``
    Returns a fully initialized :class:`pages.home_page.HomePage` instance.

``workspace_page``
    Returns a :class:`pages.workspace_page.WorkspacePage` (without a
    specific workspace ID — the caller should set it or navigate manually).

Test selection
--------------
    export APP_URL="https://www.v2dev.opensourcebrain.org/"
    export USERNAME="your-user"
    export PASSWORD="your-password"

    # Run all tests (2 workers)
    pytest tests/ -n 2

    # Run specific module
    pytest tests/tests/test_auth.py

    # Run specific test
    pytest tests/tests/test_auth.py::TestAuth::test_login_logout

    # Show browser window (not headless)
    PUPPETEER_DISPLAY=1 pytest tests/
"""

import logging
import os
import sys
import shutil

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager

# Ensure the tests directory is on sys.path so all modules can import
# from config, selectors, etc.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import APP_URL, PAGE_LOAD_TIMEOUT, WORKSPACE_LOAD_TIMEOUT
from pages.home_page import HomePage

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


@pytest.fixture(scope="session")
def driver():
    """
    Create and configure a WebDriver.

    Set ``BROWSER`` env var to ``chrome`` (default) or ``firefox``.
    Automatically falls back to Firefox if Chrome is not installed.

    Uses ``webdriver-manager`` to auto-download the matching driver binary.
    Runs in headless mode by default; set ``PUPPETEER_DISPLAY=1`` to see
    the browser window.

    Yields
    ------
    webdriver.Chrome or webdriver.Firefox
    """
    browser = os.getenv("BROWSER", "chrome").lower()
    headless = not bool(os.getenv("PUPPETEER_DISPLAY"))

    # If Chrome was requested but isn't installed, fall back to Firefox.
    if browser == "chrome" and not shutil.which("google-chrome") and not shutil.which("chromium-browser") and not shutil.which("chromium"):
        logger.info("Chrome binary not found, falling back to Firefox.")
        browser = "firefox"

    if browser == "firefox":
        logger.info("Starting Firefox WebDriver (headless=%s)...", headless)
        options = FirefoxOptions()
        if headless:
            options.add_argument("--headless")
        options.add_argument("--window-size=1600,1000")
        service = FirefoxService(GeckoDriverManager().install())
        driver_instance = webdriver.Firefox(service=service, options=options)
    else:
        logger.info("Starting Chrome WebDriver (headless=%s)...", headless)
        options = ChromeOptions()
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1600,1000")
        options.add_argument("--ignore-certificate-errors")
        if headless:
            options.add_argument("--headless=new")
        service = ChromeService(ChromeDriverManager().install())
        driver_instance = webdriver.Chrome(service=service, options=options)

    driver_instance.set_page_load_timeout(PAGE_LOAD_TIMEOUT)

    yield driver_instance

    logger.info("Quitting WebDriver.")
    driver_instance.quit()


@pytest.fixture(scope="session")
def base_url() -> str:
    """Return the base URL of the application under test."""
    return APP_URL


@pytest.fixture(scope="session")
def authenticated_user(driver, base_url):
    """
    Ensure the browser is logged in once for the entire session.

    The fixture visits the home page and checks for the user menu.  If
    not present it runs the login flow configured via ``AUTH_METHOD``.

    Yields
    ------
    str
        The username of the authenticated user (from helpers.auth).
    """
    from helpers.auth import ensure_logged_in

    logger.info("Navigating to %s for authentication check.", base_url)
    driver.get(base_url)

    ensure_logged_in(driver)

    # Read the logged-in username from the header button.
    home = HomePage(driver)
    user_menu = home.find("css selector", ".user-menu-btn")
    username = user_menu.text.strip()

    logger.info("Authenticated as '%s'.", username)
    yield username


@pytest.fixture(scope="function")
def home_page(driver) -> HomePage:
    """
    Return a :class:`HomePage` instance sharing the session driver.

    Each test function gets a fresh page object, but the underlying
    browser session persists.
    """
    return HomePage(driver)


# ==========================================================================
# Hooks
# ==========================================================================

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """
    Take a screenshot on test failure if ``CAPTURE_SCREENSHOTS`` is
    enabled in the config.
    """
    outcome = yield
    report = outcome.get_result()

    from config import CAPTURE_SCREENSHOTS

    if report.when == "call" and report.failed and CAPTURE_SCREENSHOTS:
        # Access the driver from the test function's fixture args.
        driver = item.funcargs.get("driver")
        if driver is not None:
            screenshots_dir = os.path.join(
                os.path.dirname(__file__), "screenshots"
            )
            os.makedirs(screenshots_dir, exist_ok=True)

            filename = f"{item.nodeid.replace('::', '_').replace('/', '_')}.png"
            filepath = os.path.join(screenshots_dir, filename)

            try:
                driver.save_screenshot(filepath)
                logger.info("Failure screenshot saved: %s", filepath)
            except Exception as exc:
                logger.warning("Could not save screenshot: %s", exc)


def pytest_configure(config):
    """Register custom markers."""
    config.addinivalue_line(
        "markers",
        "slow: marks tests that take a long time (e.g. workspace application loading).",
    )
    config.addinivalue_line(
        "markers",
        "smoke: marks smoke tests that should always pass quickly.",
    )
