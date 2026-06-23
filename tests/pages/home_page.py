# coding: utf-8
"""
Page object for the OSBv2 home / workspaces listing page.

URL: ``/`` (redirects to ``/workspaces``)

This is the landing page shown to all users (authenticated or not).
It displays workspace cards in tabs:

- **Featured** — curated workspaces highlighted by admins.
- **Public** — all publicly visible workspaces.
- **All / My workspaces** — private workspaces belonging to the
  currently logged-in user (visible only when authenticated).

The left MainDrawer sidebar provides navigation to workspaces and
repositories, a "Create new" button, and info/support links.

The header (AppBar) shows either a "Sign in" button or, when
authenticated, the username with a dropdown user menu.
"""

import logging
from typing import Optional

from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from pages.base_page import BasePage

logger = logging.getLogger(__name__)


class HomePage(BasePage):
    """
    The OSBv2 home page (workspaces listing).

    Attributes
    ----------
    PAGE_PATH : str
        Root path (``/``) – the portal redirects to ``/workspaces``.
    """

    PAGE_PATH = "/"

    # ==========================================================================
    # Workspace listing tabs
    # ==========================================================================

    def click_featured_tab(self) -> None:
        """
        Click the "Featured" workspaces tab.

        Selector: ``#featured-tab``
        """
        logger.info("Clicking 'Featured' tab.")
        self.click("css selector", "#featured-tab")

    def click_public_tab(self) -> None:
        """
        Click the "Public" workspaces tab.

        Selector: ``#public-tab``
        """
        logger.info("Clicking 'Public' tab.")
        self.click("css selector", "#public-tab")

    def click_all_your_workspaces_tab(self) -> None:
        """
        Click the "All / My workspaces" tab.

        Selector: ``#your-all-workspaces-tab``
        """
        logger.info("Clicking 'All / My workspaces' tab.")
        self.click("css selector", "#your-all-workspaces-tab")

    # ==========================================================================
    # Workspace listing content
    # ==========================================================================

    def wait_for_workspaces_list(self, timeout: Optional[int] = None) -> None:
        """
        Wait for the workspace listing container to be present.

        Selector: ``#workspaces-list``
        """
        self.wait_for("css selector", "#workspaces-list", timeout=timeout)

    def get_workspace_cards(self) -> list[WebElement]:
        """
        Return all workspace card elements currently visible.

        Workspace cards are links with an ``aria-label`` attribute inside
        the workspaces listing.  Returns an empty list if no cards are
        present (e.g. API is unavailable or user has no workspaces).

        Returns
        -------
        list[WebElement]
        """
        return self.find_all("css selector", '[aria-label]:not([aria-label=""])')

    def click_first_workspace(self) -> None:
        """
        Click the first workspace card link on the page.

        Uses the ``aria-label`` attribute pattern.  Raises
        ``RuntimeError`` if no workspace cards are found.
        """
        logger.info("Clicking the first workspace card.")
        cards = self.get_workspace_cards()
        if not cards:
            raise RuntimeError("No workspace cards found — API may be down.")
        # Find the first card that links to /workspaces/
        for card in cards:
            href = card.get_attribute("href") or ""
            if "/workspaces/" in href:
                card.click()
                return
        raise RuntimeError("No workspace link found among aria-label elements.")

    def click_workspace_by_name(self, name: str) -> None:
        """
        Click a workspace card whose ``aria-label`` matches the given name.

        Parameters
        ----------
        name : str
            The workspace name to search for (exact match on aria-label).
        """
        logger.info('Clicking workspace with name "%s".', name)
        self.click("css selector", f'a[aria-label="{name}"]')

    # ==========================================================================
    # Sidebar / MainDrawer
    # ==========================================================================

    def click_create_new_button(self) -> None:
        """
        Click the "Create new" button in the left sidebar.

        Selector: ``#create-new-workspace-repository``
        """
        logger.info("Clicking 'Create new' button in sidebar.")
        self.click("css selector", "#create-new-workspace-repository")

    def select_create_workspace_from_menu(self) -> None:
        """
        From the "Create new" dropdown menu, select "Workspace".

        The menu appears after clicking "Create new".  This method
        clicks the menuitem whose text contains "Workspace".
        """
        logger.info("Selecting 'Workspace' from the create-new menu.")

        # Wait for the menu to open.
        self.wait_for("css selector", "#create-new-workspace-repository-menu")

        # Find the menuitem containing "Workspace" (not "Repository").
        menu_items = self.find_all("css selector", 'li[role="menuitem"]')
        for item in menu_items:
            if "Workspace" in (item.text or ""):
                item.click()
                logger.info("Clicked workspace menuitem.")
                return

        raise RuntimeError("Could not find 'Workspace' menuitem in create-new menu.")

    def select_create_repository_from_menu(self) -> None:
        """
        From the "Create new" dropdown menu, select "Repository".

        The menu appears after clicking "Create new".  This clicks the
        menuitem whose text contains "Repository", which opens the
        ``EditRepoDialog`` (Add repository form).
        """
        logger.info("Selecting 'Repository' from the create-new menu.")

        self.wait_for("css selector", "#create-new-workspace-repository-menu")

        menu_items = self.find_all("css selector", 'li[role="menuitem"]')
        for item in menu_items:
            if "Repository" in (item.text or ""):
                item.click()
                logger.info("Clicked repository menuitem.")
                return

        raise RuntimeError("Could not find 'Repository' menuitem in create-new menu.")

    # ==========================================================================
    # Header / AppBar
    # ==========================================================================

    def is_logged_in(self) -> bool:
        """
        Check whether the user menu button (``.user-menu-btn``) is visible,
        indicating the user is authenticated.
        """
        try:
            WebDriverWait(self.driver, 3).until(
                EC.presence_of_element_located(
                    ("css selector", ".user-menu-btn")
                )
            )
            return True
        except Exception:
            return False

    def get_logged_in_username(self) -> str:
        """
        Return the username displayed in the header user menu button.

        Returns
        -------
        str
            The username text, or an empty string if not logged in.
        """
        try:
            el = self.find("css selector", ".user-menu-btn")
            return el.text or ""
        except Exception:
            return ""

    def click_sign_in(self) -> None:
        """
        Click the "Sign in" button in the header.

        Selector: ``.sign-in``

        This redirects the browser to the Keycloak login page on the
        accounts subdomain.
        """
        logger.info("Clicking 'Sign in' button.")
        self.click("css selector", ".sign-in")

    def open_user_menu(self) -> None:
        """
        Open the user dropdown menu by clicking the username button.

        Precondition: user must be logged in (``.user-menu-btn`` visible).
        """
        logger.info("Opening user menu.")
        self.click("css selector", ".user-menu-btn")

    def click_logout_from_menu(self) -> None:
        """
        Click the "Logout" item in the user dropdown menu.

        Precondition: the user menu must already be open.
        """
        logger.info("Clicking 'Logout' menu item.")
        self.click("css selector", ".logout-menu-item")

    def wait_for_user_menu(self, timeout: Optional[int] = None) -> None:
        """
        Wait for the user menu button to appear (user is logged in).

        Selector: ``.user-menu-btn``
        """
        self.wait_for_visible("css selector", ".user-menu-btn", timeout=timeout)

    # ==========================================================================
    # Sidebar navigation
    # ==========================================================================

    def click_about_in_sidebar(self) -> None:
        """
        Click the "About" link in the sidebar to open the About dialog.

        The "About" item is under the "Info & Support" section in the
        left MainDrawer sidebar.  It is a ``<span>`` with text "About".
        """
        logger.info("Clicking 'About' in sidebar.")
        self.click("xpath", '//span[text()="About"]')

    def click_workspaces_in_sidebar(self) -> None:
        """
        Click the "Workspaces" navigation item in the sidebar.

        Selector: sidebar ListItemButton with text "Workspaces".
        """
        logger.info("Clicking 'Workspaces' in sidebar.")
        self.click("xpath", '//*[text()="Workspaces"]')

    def click_repositories_in_sidebar(self) -> None:
        """
        Click the "Repositories" navigation item in the sidebar.

        Selector: sidebar ListItemButton with text "Repositories".
        """
        logger.info("Clicking 'Repositories' in sidebar.")
        self.click("xpath", '//*[text()="Repositories"]')

    # ==========================================================================
    # About dialog
    # ==========================================================================

    def wait_for_about_dialog(self, timeout: Optional[int] = None) -> None:
        """
        Wait for the About dialog to appear.

        The dialog is a MUI Dialog element with the title "About".
        """
        logger.info("Waiting for About dialog.")
        self.wait_for("xpath", '//*[text()="About"]/ancestor::div[@role="dialog"]', timeout=timeout)

    def close_about_dialog(self) -> None:
        """
        Close the About dialog by clicking its close IconButton.

        The close button is an ``<IconButton>`` containing a ``<CloseIcon>``
        inside the dialog title.
        """
        logger.info("Closing About dialog.")
        close_btns = self.find_all("xpath", '//div[@role="dialog"]//button')
        for btn in close_btns:
            # The close button is typically the only button in the dialog header.
            if btn.is_displayed():
                btn.click()
                return

    def is_about_dialog_open(self) -> bool:
        """
        Check whether the About dialog is currently open.

        Returns
        -------
        bool
        """
        try:
            self.find("xpath", '//*[text()="About"]/ancestor::div[@role="dialog"]')
            return True
        except Exception:
            return False

    # ==========================================================================
    # Workspace toolbar / creation from templates
    # ==========================================================================

    def wait_for_template_toolbox(self) -> None:
        """
        Wait for the workspace template toolbox to appear.

        The toolbox is shown inside the "Create new workspace" dialog
        and also on the "My workspaces" tab when the user has 0 workspaces.

        Selector: ``#computational-modeling`` (the grid container).
        """
        self.wait_for_visible("css selector", "#computational-modeling")

    def click_template(self, template_id: str) -> None:
        """
        Click a workspace template card.

        Parameters
        ----------
        template_id : str
            One of ``#data-analysis``, ``#interactive-development``,
            ``#computational-modeling``, or ``#workspace-from-repository``.
        """
        logger.info("Clicking template: %s", template_id)
        self.click("css selector", template_id)

    # ==========================================================================
    # Workspace creation form (WorkspaceEditor)
    # ==========================================================================

    def wait_for_create_workspace_form(self) -> None:
        """
        Wait for the workspace editor dialog to open.

        Selector: ``.MuiDialogContent-root`` (the form body).
        """
        self.wait_for_visible("css selector", ".MuiDialogContent-root")

    def fill_workspace_name(self, name: str) -> None:
        """
        Type into the ``#workspaceName`` text field.

        Parameters
        ----------
        name : str
            The workspace name.
        """
        logger.info('Filling workspace name: "%s".', name)
        self.type_text("css selector", "#workspaceName", name)

    def fill_workspace_description(self, description: str) -> None:
        """
        Type into the workspace description textarea.

        Parameters
        ----------
        description : str
            The description text (supports Markdown).
        """
        logger.info("Filling workspace description.")
        self.type_text(
            "css selector",
            'textarea[class*="section-container input"]',
            description,
        )

    def click_create_workspace_submit(self) -> None:
        """
        Click the ``#create-a-new-workspace-button`` submit button.

        This creates the workspace and closes the dialog.
        """
        logger.info("Clicking 'Create A New Workspace' button.")
        self.click("css selector", "#create-a-new-workspace-button")

    # ==========================================================================
    # Search and filter (workspaces page)
    # ==========================================================================

    def type_search(self, query: str) -> None:
        """
        Type a search query into the search text field.

        Selector: ``#standard-start-adornment``
        """
        logger.info('Searching workspaces for "%s".', query)
        self.type_text("css selector", "#standard-start-adornment", query)

    def open_filter_popover(self) -> None:
        """
        Click the "Filter" button to open the filter popover.

        The filter button contains a ``Badge`` with a ``FilterListIcon``.
        We target the button by its text using XPath.
        """
        logger.info("Opening filter popover.")
        self.click("xpath", '//button[contains(., "Filter")]')

    def wait_for_filter_popover(self) -> None:
        """
        Wait for the filter popover to appear.

        Selector: ``#popover``
        """
        self.wait_for_visible("css selector", "#popover")
