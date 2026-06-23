# coding: utf-8
"""
Application-open tests: NetPyNE, NWB Explorer, JupyterLab.

These tests open workspaces with Jupyter-based applications in the
``#workspace-frame`` iframe.  They require authentication and a running
JupyterHub server.

Tests
-----
- **test_open_with_nwb_explorer** — open a workspace with NWB Explorer.
- **test_open_with_netpyne** — open a workspace with NetPyNE.
- **test_open_with_jupyterlab** — open a workspace with JupyterLab.

Important
---------
These tests are marked ``@pytest.mark.slow`` because spawning Jupyter
servers can take several minutes.  The default timeout for application
load is :data:`config.WORKSPACE_LOAD_TIMEOUT` (10 minutes).
"""

import logging
import time

import pytest

from pages.home_page import HomePage
from pages.workspace_page import WorkspacePage
from pages.workspace_open_page import WorkspaceOpenPage

logger = logging.getLogger(__name__)


# Application configurations: name shown in the split-button menu, the
# URL fragment that appears after opening, and a CSS selector inside
# the iframe that confirms the app is ready.
_APPS = {
    "NWB Explorer": {
        "menu_name": "NWB Explorer",
        "url_fragment": "/nwbexplorer",
        "ready_selector": "#main-container-inner",
    },
    "NetPyNE": {
        "menu_name": "NetPyNE",
        "url_fragment": "/netpyne",
        "ready_selector": "#mainContainer",
    },
    "JupyterLab": {
        "menu_name": "JupyterLab",
        "url_fragment": "/jupyter",
        "ready_selector": "#jp-main-dock-panel",
    },
}


def _open_and_wait_for_app(
    driver, base_url, app_config: dict, authenticated_user: str
) -> None:
    """
    Shared helper: open a workspace with an application and wait for it
    to be ready inside the iframe.

    Parameters
    ----------
    driver : WebDriver
    base_url : str
    app_config : dict
        Keys: ``menu_name``, ``url_fragment``, ``ready_selector``.
    authenticated_user : str
        Username from the authenticated_user fixture.

    Raises
    ------
    pytest.fail
        If the application iframe does not load or the ready selector
        is not found.
    """
    app_name = app_config["menu_name"]
    logger.info("Opening workspace with %s.", app_name)

    # Step 1: Navigate to home and find a workspace to open.
    driver.get(base_url)
    home = HomePage(driver)
    home.wait_for_workspaces_list()

    # Try the "Featured" tab first — it typically has workspaces.
    home.click_featured_tab()
    time.sleep(2)

    # If there are workspace cards, click the first one.
    cards = home.get_workspace_cards()
    if not cards:
        # Fall back to "All / My workspaces" tab.
        home.click_all_your_workspaces_tab()
        time.sleep(2)
        cards = home.get_workspace_cards()

    if not cards:
        pytest.skip("No workspace cards found — cannot test app opening.")

    home.click_first_workspace()

    # Step 2: Wait for the workspace detail page.
    workspace_page = WorkspacePage(driver)
    workspace_page.wait_for_page_loaded()

    # Step 3: Open the split-button dropdown and select the application.
    workspace_page.select_application(app_name)

    # Step 4: Wait for the application iframe to appear.
    open_page = WorkspaceOpenPage(driver)
    open_page.wait_for_app_frame()

    # Verify the URL contains the expected fragment.
    current_url = driver.current_url
    assert app_config["url_fragment"] in current_url, (
        f"Expected URL to contain '{app_config['url_fragment']}', "
        f"got '{current_url}'"
    )

    # Step 5: Switch into the iframe and wait for the app to be ready.
    open_page.switch_to_app_frame()

    try:
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC
        from config import WORKSPACE_LOAD_TIMEOUT

        WebDriverWait(driver, WORKSPACE_LOAD_TIMEOUT).until(
            EC.presence_of_element_located(
                ("css selector", app_config["ready_selector"])
            )
        )
        logger.info("%s is ready inside the iframe.", app_name)
    except Exception as exc:
        # Switch back before failing so the driver is in a clean state.
        open_page.switch_to_main()
        pytest.fail(f"{app_name} did not load in the iframe: {exc}")
    finally:
        open_page.switch_to_main()


class TestApplications:
    """Application opening flows (slow tests)."""

    @pytest.mark.slow
    def test_open_with_nwb_explorer(self, driver, base_url, authenticated_user):
        """Open a workspace with NWB Explorer and verify it loads."""
        _open_and_wait_for_app(
            driver, base_url, _APPS["NWB Explorer"], authenticated_user
        )

    @pytest.mark.slow
    def test_open_with_netpyne(self, driver, base_url, authenticated_user):
        """Open a workspace with NetPyNE and verify it loads."""
        _open_and_wait_for_app(
            driver, base_url, _APPS["NetPyNE"], authenticated_user
        )

    @pytest.mark.slow
    def test_open_with_jupyterlab(self, driver, base_url, authenticated_user):
        """Open a workspace with JupyterLab and verify it loads."""
        _open_and_wait_for_app(
            driver, base_url, _APPS["JupyterLab"], authenticated_user
        )
