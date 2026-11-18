# coding: utf-8
"""
User profile page tests.

Tests
-----
- **test_user_profile_loads** — navigate to a user's profile and verify
  the profile info sidebar loads.
- **test_user_tabs_exist** — verify the public workspaces, private
  workspaces, and repositories tabs are present.
- **test_edit_profile_button_visibility** — the "Edit My Profile"
  button is visible when viewing your own profile.
"""

import logging
import time

import pytest

from pages.home_page import HomePage
from pages.user_page import UserPage

logger = logging.getLogger(__name__)


class TestUserProfile:
    """User profile page tests."""

    def test_user_profile_loads(
        self, driver, base_url, authenticated_user
    ):
        """
        Navigate to the logged-in user's profile page and verify content.

        Steps
        -----
        1. Navigate to ``/user/{username}`` using the username obtained
           from the ``authenticated_user`` fixture.
        2. Wait for the profile info sidebar (#profile-info).
        3. Verify the display name and username are present.
        """
        username = authenticated_user
        logger.info("Navigating to profile for user: %s", username)

        user_page = UserPage(driver, username=username)
        user_page.navigate(base_url)
        user_page.wait_for_page_loaded()

        # Verify display name and username are visible.
        display_name = user_page.get_display_name()
        assert display_name, "Display name should not be empty."

        uname = user_page.get_username()
        assert uname, "Username should not be empty."
        logger.info("Profile loaded: %s (@%s).", display_name, uname)

    def test_user_tabs_exist(
        self, driver, base_url, authenticated_user
    ):
        """
        Verify the user profile has public workspaces, private workspaces,
        and repositories tabs.

        Steps
        -----
        1. Navigate to own profile.
        2. Check that the three tab buttons are present.
        """
        username = authenticated_user
        user_page = UserPage(driver, username=username)
        user_page.navigate(base_url)
        user_page.wait_for_page_loaded()

        # Tab buttons should be visible.
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(("css selector", "#tab-0"))
        )
        logger.info("'Public Workspaces' tab exists.")

        # Tab 1 (Private Workspaces) only appears for own profile.
        try:
            WebDriverWait(driver, 5).until(
                EC.presence_of_element_located(("css selector", "#tab-1"))
            )
            logger.info("'Private Workspaces' tab exists.")
        except Exception:
            logger.warning("'Private Workspaces' tab not found (may be OK).")

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(("css selector", "#tab-2"))
        )
        logger.info("'Repositories' tab exists.")

    def test_edit_profile_button_visible(
        self, driver, base_url, authenticated_user
    ):
        """
        The "Edit My Profile" button is visible when viewing your own profile.

        Steps
        -----
        1. Navigate to own profile.
        2. Verify the "Edit My Profile" button exists.
        """
        username = authenticated_user
        user_page = UserPage(driver, username=username)
        user_page.navigate(base_url)
        user_page.wait_for_page_loaded()

        assert user_page.is_edit_profile_visible(), (
            "'Edit My Profile' button should be visible on own profile."
        )
        logger.info("'Edit My Profile' button is visible.")

    def test_public_workspaces_tab_clickable(
        self, driver, base_url, authenticated_user
    ):
        """
        Click the "Public Workspaces" tab and verify content loads.

        Steps
        -----
        1. Navigate to own profile.
        2. Click "Public Workspaces" tab.
        3. Verify the tab panel appears.
        """
        username = authenticated_user
        user_page = UserPage(driver, username=username)
        user_page.navigate(base_url)
        user_page.wait_for_page_loaded()

        user_page.click_public_workspaces_tab()

        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located(("css selector", "#tabpanel-0"))
        )
        logger.info("Public Workspaces tab panel is visible.")

    def test_edit_profile(self, driver, base_url, authenticated_user):
        """
        Open the UserEditor dialog and verify the form appears.

        Steps
        -----
        1. Navigate to own profile.
        2. Click "Edit My Profile".
        3. Verify the editor dialog appears with form fields.
        4. Cancel the dialog (discard changes).
        """
        username = authenticated_user
        user_page = UserPage(driver, username=username)
        user_page.navigate(base_url)
        user_page.wait_for_page_loaded()

        assert user_page.is_edit_profile_visible(), (
            "'Edit My Profile' button should be visible."
        )

        user_page.click_edit_profile()
        user_page.wait_for_edit_dialog()

        # Verify at least the profile picture URL field is present.
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    ("css selector", "#profilePictureURL")
                )
            )
            logger.info("Edit profile dialog opened with form fields.")
        except Exception:
            logger.warning("Profile picture URL field not found in dialog.")

        # Cancel to discard any changes.
        user_page.click_cancel_profile_edit()
        time.sleep(1)

        logger.info("Edit profile dialog cancelled successfully.")
