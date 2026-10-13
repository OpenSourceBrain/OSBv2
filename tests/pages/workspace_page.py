# coding: utf-8
"""
Page object for the OSBv2 workspace detail page.

URL: ``/workspaces/:workspaceId``

This page shows the details of a single workspace — name, description
(Markdown), thumbnail, resources sidebar, tag chips, and author/date
metadata.  From here the user can:

- **Open** the workspace with a Jupyter-based application (NetPyNE,
  NWB Explorer, JupyterLab) via the split button.
- **Edit** metadata (name, description, tags, thumbnail, visibility).
- **Clone** an existing workspace.
- **Delete** the workspace (via the actions menu).

The workspace-open page (``/workspaces/open/:id/:app``) is modeled by
:class:`WorkspaceOpenPage`.
"""

import logging
from typing import Optional

from pages.base_page import BasePage

logger = logging.getLogger(__name__)


class WorkspacePage(BasePage):
    """
    Workspace detail page.

    Attributes
    ----------
    workspace_id : str or None
        The ID of the workspace currently being viewed.  Set after
        navigation to a specific workspace.
    """

    PAGE_PATH = "/workspaces/"  # suffix is the workspace id

    def __init__(self, driver, workspace_id: Optional[str] = None):
        super().__init__(driver)
        self.workspace_id = workspace_id
        if workspace_id:
            self.PAGE_PATH = f"/workspaces/{workspace_id}"

    # ==========================================================================
    # Page structure
    # ==========================================================================

    def wait_for_page_loaded(self, timeout: Optional[int] = None) -> None:
        """
        Wait for the workspace detail content to be visible.

        Selector: ``#workspace-detail-content``
        """
        self.wait_for_visible(
            "css selector", "#workspace-detail-content", timeout=timeout
        )

    def get_workspace_name(self) -> str:
        """
        Return the workspace name displayed in the heading.

        Selector: ``.workspace-name`` (h1 element).
        """
        el = self.wait_for_visible("css selector", ".workspace-name")
        return el.text or ""

    def get_workspace_description(self) -> str:
        """
        Return the workspace description rendered as Markdown.

        There is no dedicated selector for the description container;
        it lives inside ``#workspace-detail-content``.
        """
        content = self.find("css selector", "#workspace-detail-content")
        return content.text or ""

    # ==========================================================================
    # Open-with split button
    # ==========================================================================

    def click_open_with_dropdown(self) -> None:
        """
        Click the dropdown arrow on the split button to reveal application
        choices.

        Selector: ``.split-button-control`` (the arrow part of the split button).
        """
        logger.info("Clicking open-with dropdown arrow.")
        self.click("css selector", ".split-button-control")

    def select_application(self, app_name: str) -> None:
        """
        Select an application from the split-button menu.

        The menu (``#split-button-menu``) contains ``<li>`` items whose
        text includes the application name.  This method clicks the
        matching item, then clicks the main "Open with X" button.

        Parameters
        ----------
        app_name : str
            The application display name, e.g. "NetPyNE", "NWB Explorer",
            or "JupyterLab".

        Raises
        ------
        RuntimeError
            If no menu item matches the given application name.
        """
        logger.info('Selecting application "%s" from split-button menu.', app_name)

        # Open the dropdown.
        self.click_open_with_dropdown()

        # Find and click the matching menu item.
        menu_items = self.find_all("css selector", "#split-button-menu li")
        for item in menu_items:
            if app_name.lower() in (item.text or "").lower():
                item.click()
                logger.info('Selected "%s" from menu.', app_name)
                # Now click the main "Open with" button to navigate.
                self.click("css selector", ".open-workspace")
                return

        raise RuntimeError(
            f'Could not find application "{app_name}" in split-button menu.'
        )

    # ==========================================================================
    # Actions menu (three-dot button)
    # ==========================================================================

    def open_actions_menu(self) -> None:
        """
        Click the three-dot actions button to open the workspace actions
        menu.

        Selector: ``.btn-actions``
        """
        logger.info("Opening workspace actions menu.")
        self.click("css selector", ".btn-actions")

    def click_delete_workspace(self) -> None:
        """
        Click the "Delete" action in the workspace actions menu.

        Precondition: the actions menu must be open.
        """
        logger.info("Clicking 'Delete workspace' action.")
        self.click("css selector", ".delete-workspace")

    def click_edit_workspace(self) -> None:
        """
        Click the "Edit" action in the workspace actions menu.

        Precondition: the actions menu must be open.
        """
        logger.info("Clicking 'Edit workspace' action.")
        self.click("css selector", ".edit-workspace")

    def click_clone_workspace(self) -> None:
        """
        Click the "Clone workspace" action in the actions menu.

        Precondition: the actions menu must be open.

        Notes
        -----
        Cloning starts immediately without a confirmation dialog.
        After cloning, a success Snackbar appears with "Workspace cloned"
        and an "Open" button.
        """
        logger.info("Clicking 'Clone workspace' action.")
        self.click("xpath", '//li[contains(., "Clone workspace")]')

    def click_make_public(self) -> None:
        """
        Click the "Make public" action in the workspace actions menu.

        Precondition: the actions menu must be open and the workspace
        must currently be private.
        """
        logger.info("Clicking 'Make public' action.")
        self.click("css selector", ".make-public-workspace")

    def click_make_private(self) -> None:
        """
        Click the "Make private" action in the workspace actions menu.

        Precondition: the actions menu must be open and the workspace
        must currently be public.
        """
        logger.info("Clicking 'Make private' action.")
        self.click("css selector", ".make-private-workspace")

    # ==========================================================================
    # Clone success / failure dialogs
    # ==========================================================================

    def wait_for_clone_snackbar(self, timeout: Optional[int] = None) -> None:
        """
        Wait for the clone-success Snackbar to appear.

        The Snackbar shows the text "Workspace cloned" and an "Open"
        button that navigates to the cloned workspace.
        """
        logger.info("Waiting for clone success message.")
        self.wait_for("xpath", '//*[contains(., "Workspace cloned")]', timeout=timeout)

    def click_open_cloned_workspace(self) -> None:
        """
        Click the "Open" button on the clone success Snackbar.

        This navigates to the cloned workspace's detail page.
        """
        logger.info("Clicking 'Open' on clone snackbar.")
        self.click("xpath", '//button[contains(., "Open")]')

    # ==========================================================================
    # WorkspaceEditor (edit form)
    # ==========================================================================

    def wait_for_workspace_editor(self, timeout: Optional[int] = None) -> None:
        """
        Wait for the WorkspaceEditor dialog to appear.

        The dialog title contains either "Create new workspace" or
        "Edit workspace".
        """
        logger.info("Waiting for workspace editor dialog.")
        self.wait_for("css selector", 'div[role="dialog"]', timeout=timeout)

    def fill_workspace_name_in_editor(self, name: str) -> None:
        """
        Type a new name into the ``#workspaceName`` field inside the editor.

        Parameters
        ----------
        name : str
            The new workspace name.
        """
        logger.info('Setting workspace name to "%s".', name)
        self.type_text("css selector", "#workspaceName", name)

    def set_workspace_visibility(self, visibility: str) -> None:
        """
        Change workspace visibility using the editor's Select control.

        Parameters
        ----------
        visibility : str
            One of ``"Private"``, ``"Public"``, or ``"Featured"``.

        Notes
        -----
        The visibility Select has no ID.  We locate it by clicking a
        ``<div class="MuiSelect-root">`` descendant of the dialog that
        shows the current value text, then pick the matching menu item.
        """
        logger.info('Setting workspace visibility to "%s".', visibility)

        # The Select renders as a div with role="button" and text showing
        # the current selection (Private / Public / Featured).
        select = self.find(
            "xpath",
            '//div[@role="dialog"]//div[contains(@class, "MuiSelect")]',
        )
        select.click()

        # Pick the matching option from the dropdown menu that appears.
        self.click(
            "xpath",
            f'//li[contains(@class, "MuiMenuItem") and contains(., "{visibility}")]',
        )

    def click_save_workspace(self) -> None:
        """
        Click the "Save" button in the workspace editor.

        Selector: ``#create-a-new-workspace-button``.
        """
        logger.info("Clicking 'Save' button in workspace editor.")
        self.click("css selector", "#create-a-new-workspace-button")

    # ==========================================================================
    # Delete confirmation dialog
    # ==========================================================================

    def confirm_delete(self) -> None:
        """
        Click the "DELETE" button in the confirmation dialog.

        After this click the workspace is deleted and the browser returns
        to the workspaces listing page.
        """
        logger.info("Confirming workspace deletion.")
        self.click("xpath", '//button[contains(., "DELETE")]')

    # ==========================================================================
    # Navigation
    # ==========================================================================

    def click_back_to_workspaces(self) -> None:
        """
        Click the "All workspaces" back button to return to the listing.

        The back button is a NavbarButton with a ChevronLeftIcon and
        the text "All workspaces".
        """
        logger.info("Clicking 'All workspaces' back button.")
        self.click("xpath", '//button[contains(., "All workspaces")]')
