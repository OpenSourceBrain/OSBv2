# coding: utf-8
"""
About dialog tests.

Tests
-----
- **test_about_dialog_opens** — clicking "About" in the sidebar opens
  a dialog with the title "About".
- **test_about_dialog_closes** — the About dialog can be closed.
"""

import logging

import pytest

from pages.home_page import HomePage

logger = logging.getLogger(__name__)


class TestAboutDialog:
    """About dialog visibility and interaction tests."""

    @pytest.mark.smoke
    def test_about_dialog_opens(self, driver, base_url):
        """
        The About dialog opens when "About" is clicked in the sidebar.

        Steps
        -----
        1. Navigate to the home page.
        2. Click "About" in the left sidebar under "Info & Support".
        3. Verify the About dialog appears.
        """
        driver.get(base_url)
        home = HomePage(driver)
        home.wait_for_workspaces_list()

        home.click_about_in_sidebar()
        home.wait_for_about_dialog()

        assert home.is_about_dialog_open(), (
            "About dialog should be visible after clicking 'About'."
        )
        logger.info("About dialog opened successfully.")

    def test_about_dialog_closes(self, driver, base_url):
        """
        The About dialog closes when the close button is clicked.

        Steps
        -----
        1. Open the About dialog.
        2. Close it.
        3. Verify the dialog is no longer visible.
        """
        driver.get(base_url)
        home = HomePage(driver)
        home.wait_for_workspaces_list()

        home.click_about_in_sidebar()
        home.wait_for_about_dialog()

        home.close_about_dialog()

        # Wait a moment for the close animation, then verify gone.
        import time
        time.sleep(1)

        assert not home.is_about_dialog_open(), (
            "About dialog should be closed after clicking the close button."
        )
        logger.info("About dialog closed successfully.")
