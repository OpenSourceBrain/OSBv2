# coding: utf-8
"""
Page object for the OSBv2 user profile page.

URL: ``/user/:userName``

Shows a user's public profile, including:
- Avatar, display name, username
- Links (website, GitHub, Twitter, ORCID, etc.)
- Group memberships (as clickable chips)
- Quota information (visible only to the profile owner)
- Tab panels with the user's public workspaces, private workspaces
  (visible only to the owner), and repositories.

The "Edit My Profile" button opens a UserEditor dialog.
"""

import logging
from typing import Optional

from pages.base_page import BasePage

logger = logging.getLogger(__name__)


class UserPage(BasePage):
    """
    User profile page.

    Attributes
    ----------
    PAGE_PATH : str
        ``/user/`` – the full path includes the username.
    username : str or None
        The username of the profile being viewed.
    """

    PAGE_PATH = "/user/"

    def __init__(self, driver, username: Optional[str] = None):
        super().__init__(driver)
        self.username = username
        if username:
            self.PAGE_PATH = f"/user/{username}"

    # ==========================================================================
    # Page readiness
    # ==========================================================================

    def wait_for_page_loaded(self, timeout: Optional[int] = None) -> None:
        """
        Wait for the profile info sidebar to be visible.

        Selector: ``#profile-info``
        """
        self.wait_for_visible("css selector", "#profile-info", timeout=timeout)

    # ==========================================================================
    # Profile info
    # ==========================================================================

    def get_display_name(self) -> str:
        """
        Return the user's display name heading.

        Selector: ``.name`` (h1 element inside #profile-info).
        """
        el = self.wait_for_visible("css selector", ".name")
        return el.text or ""

    def get_username(self) -> str:
        """
        Return the username subheading.

        Selector: ``.username`` (p element inside #profile-info).
        """
        el = self.wait_for_visible("css selector", ".username")
        return el.text or ""

    def is_edit_profile_visible(self) -> bool:
        """
        Check if the "Edit My Profile" button is visible.

        This button only appears when the logged-in user views their
        own profile, or when an admin views any profile.

        Returns
        -------
        bool
        """
        try:
            self.find("xpath", '//button[contains(., "Edit My Profile")]')
            return True
        except Exception:
            return False

    def click_edit_profile(self) -> None:
        """
        Click the "Edit My Profile" button to open the UserEditor dialog.

        Precondition: ``is_edit_profile_visible()`` must be ``True``.
        """
        logger.info("Clicking 'Edit My Profile' button.")
        self.click("xpath", '//button[contains(., "Edit My Profile")]')

    # ==========================================================================
    # Group chips
    # ==========================================================================

    def get_group_chips(self):
        """
        Return all group chip elements on the profile.

        Group chips have class ``.first-chip``.

        Returns
        -------
        list[WebElement]
        """
        return self.find_all("css selector", ".first-chip")

    def click_group(self, group_name: str) -> None:
        """
        Click a group chip to navigate to the group detail page.

        Parameters
        ----------
        group_name : str
            The group name to click.
        """
        logger.info('Clicking group "%s".', group_name)
        self.click("xpath", f'//*[contains(@class, "first-chip") and contains(., "{group_name}")]')

    # ==========================================================================
    # Tab panels
    # ==========================================================================

    def click_public_workspaces_tab(self) -> None:
        """
        Click the "Public Workspaces" tab (tab index 0).

        Selector: ``#tab-0``
        """
        logger.info("Clicking 'Public Workspaces' tab.")
        self.click("css selector", "#tab-0")

    def click_private_workspaces_tab(self) -> None:
        """
        Click the "Private Workspaces" tab (tab index 1).

        Selector: ``#tab-1``

        Precondition: this tab is only visible when viewing your own
        profile or when logged in as an admin.
        """
        logger.info("Clicking 'Private Workspaces' tab.")
        self.click("css selector", "#tab-1")

    def click_repositories_tab(self) -> None:
        """
        Click the "Repositories" tab (tab index 2).

        Selector: ``#tab-2``
        """
        logger.info("Clicking 'Repositories' tab.")
        self.click("css selector", "#tab-2")

    def get_workspace_cards_in_tab(self, tab_index: int):
        """
        Return the workspace cards inside a tab panel.

        Parameters
        ----------
        tab_index : int
            The tab index (0 = public, 1 = private, 2 = repositories).
            Tab 2 can also contain repository rows.

        Returns
        -------
        list[WebElement]
        """
        panel_id = f"#tabpanel-{tab_index}"
        panel = self.wait_for_visible("css selector", panel_id)
        return panel.find_elements("css selector", ".workspace-page-link")

    # ==========================================================================
    # UserEditor dialog
    # ==========================================================================

    def wait_for_edit_dialog(self) -> None:
        """
        Wait for the "Edit My Profile" dialog to appear.

        Selector: the MUI dialog root with a title text.
        """
        self.wait_for_visible("css selector", 'div[role="dialog"]')

    # ==========================================================================
    # UserEditor form interactions
    # ==========================================================================

    def fill_profile_picture_url(self, url: str) -> None:
        """
        Fill the ``#profilePictureURL`` field in the UserEditor.

        Parameters
        ----------
        url : str
            The URL for the new profile picture.
        """
        logger.info('Filling profile picture URL: "%s".', url)
        self.type_text("css selector", "#profilePictureURL", url)

    def click_save_profile(self) -> None:
        """
        Click the "Save Changes" button in the UserEditor.

        Selector: button with text "Save Changes".
        """
        logger.info("Clicking 'Save Changes' button.")
        self.click("xpath", '//button[contains(., "Save Changes")]')

    def click_cancel_profile_edit(self) -> None:
        """
        Click the "Cancel" button in the UserEditor to discard changes.

        Selector: button with text "Cancel".
        """
        logger.info("Clicking 'Cancel' button in profile editor.")
        self.click("xpath", '//button[contains(., "Cancel")]')
