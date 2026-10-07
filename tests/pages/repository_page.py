# coding: utf-8
"""
Page objects for the OSBv2 repository listing and detail pages.

Repository listing
    URL: ``/repositories``
    Shows all discoverable repositories with tabs ("All repositories" /
    "My repositories"), a grid/list toggle, search, and filter.

Repository detail
    URL: ``/repositories/:repositoryId``
    Shows repository metadata, a Markdown description, and a file tree
    for browsing and selecting content.  Provides buttons to create a
    new workspace from selected files or add files to an existing
    workspace.
"""

import logging
from typing import Optional

from pages.base_page import BasePage

logger = logging.getLogger(__name__)


class RepositoriesPage(BasePage):
    """
    Repository listing page.

    Attributes
    ----------
    PAGE_PATH : str
        ``/repositories``
    """

    PAGE_PATH = "/repositories"

    # ==========================================================================
    # Page readiness
    # ==========================================================================

    def wait_for_repositories_list(self, timeout: Optional[int] = None) -> None:
        """
        Wait for the repositories list container to appear.

        Selector: ``#repositories-list``
        """
        self.wait_for_visible(
            "css selector", "#repositories-list", timeout=timeout
        )

    # ==========================================================================
    # Tabs
    # ==========================================================================

    def click_all_repositories_tab(self) -> None:
        """
        Click the "All repositories" tab.

        This tab is always visible.  It shows every public repository.

        Uses XPath to match the button by its text content.
        """
        logger.info("Clicking 'All repositories' tab.")
        self.click("xpath", '//button[contains(., "All repositories")]')

    def click_my_repositories_tab(self) -> None:
        """
        Click the "My repositories" tab.

        This tab is only visible when a user is logged in.  It lists
        repositories owned by the current user.

        Uses XPath to match the button by its text content.
        """
        logger.info("Clicking 'My repositories' tab.")
        self.click("xpath", '//button[contains(., "My repositories")]')

    # ==========================================================================
    # Grid / List toggle
    # ==========================================================================

    def click_grid_view(self) -> None:
        """
        Switch to the grid (card) view of repositories.

        The toggle is a ``ButtonGroup`` with ``aria-label="Disabled elevation buttons"``
        containing two ``IconButton`` children.  The grid button is the
        first child (it shows the ``WindowIcon``).
        """
        logger.info("Switching to grid view.")
        self.click(
            "xpath",
            '(//div[@aria-label="Disabled elevation buttons"]//button)[1]',
        )

    def click_list_view(self) -> None:
        """
        Switch to the list (table) view of repositories.

        The toggle is a ``ButtonGroup`` with ``aria-label="Disabled elevation buttons"``
        containing two ``IconButton`` children.  The list button is the
        second child (it shows the ``ListIcon``).
        """
        logger.info("Switching to list view.")
        self.click(
            "xpath",
            '(//div[@aria-label="Disabled elevation buttons"]//button)[2]',
        )

    # ==========================================================================
    # Add repository (EditRepoDialog)
    # ==========================================================================

    def wait_for_add_repository_dialog(self, timeout: Optional[int] = None) -> None:
        """
        Wait for the "Add repository" dialog (EditRepoDialog) to appear.

        The dialog has CSS class ``repository-edit-modal``.
        """
        logger.info("Waiting for Add repository dialog.")
        self.wait_for(
            "css selector", ".repository-edit-modal", timeout=timeout
        )

    def fill_repository_url(self, url: str) -> None:
        """
        Type a repository URL into the URL field.

        The URL input has class ``repository-url-input-element`` but is
        a MUI ``<div>`` wrapper, not a native ``<input>``.  We find the
        actual ``<input>`` inside it and set the value via JavaScript.
        """
        logger.info('Filling repository URL: "%s".', url)
        parent = self.find("css selector", ".repository-url-input-element")
        input_el = parent.find_element("css selector", "input")
        self.driver.execute_script("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', {bubbles: true}));", input_el, url)

    def fill_repository_name(self, name: str) -> None:
        """
        Type a name into the ``#repo-name`` text field.

        Parameters
        ----------
        name : str
            The repository name (displayed in listings).
        """
        logger.info('Filling repository name: "%s".', name)
        self.type_text("css selector", "#repo-name", name)

    def click_add_repository(self) -> None:
        """
        Click the "Add" button to submit the repository.

        Selector: ``.repository-add-button``.
        """
        logger.info("Clicking 'Add' button.")
        self.click("css selector", ".repository-add-button")

    # ==========================================================================
    # Search and filter
    # ==========================================================================

    def type_search(self, query: str) -> None:
        """
        Type a search query into the repositories search field.

        Selector: ``#standard-start-adornment`` (same id as workspaces search).
        """
        logger.info('Searching repositories for "%s".', query)
        self.type_text("css selector", "#standard-start-adornment", query)

    def open_filter_popover(self) -> None:
        """
        Open the filter popover for repositories.

        Selector: ``button:has-text("Filter")``
        """
        logger.info("Opening repository filter popover.")
        self.click("xpath", '//button[contains(., "Filter")]')

    # ==========================================================================
    # Repository cards / rows
    # ==========================================================================

    def click_first_repository(self) -> None:
        """
        Open the first repository in the listing.

        Finds any link whose ``href`` contains ``/repositories/``
        (skipping the listing page itself).  If no repository links
        are found, raises ``RuntimeError``.
        """
        logger.info("Clicking first repository in the list.")
        links = self.find_all("xpath", "//a[contains(@href, '/repositories/')]")
        for link in links:
            href = link.get_attribute("href") or ""
            # Skip the listing page itself.
            if href.rstrip("/") != self.PAGE_PATH.rstrip("/"):
                link.click()
                return
        raise RuntimeError("No repository links found — API may be down.")

    def click_repository_by_name(self, name: str) -> None:
        """
        Click a repository card with a specific name.

        For list/table view, the name is in a `<Typography>` heading
        inside a `<Link>`.
        """
        logger.info('Clicking repository with name "%s".', name)
        self.click("xpath", f'//a[contains(., "{name}")]')


class RepositoryPage(BasePage):
    """
    Repository detail page.

    Attributes
    ----------
    PAGE_PATH : str
        ``/repositories/`` – the full path includes the repository id.
    repository_id : str or None
    """

    PAGE_PATH = "/repositories/"

    def __init__(self, driver, repository_id: Optional[str] = None):
        super().__init__(driver)
        self.repository_id = repository_id
        if repository_id:
            self.PAGE_PATH = f"/repositories/{repository_id}"

    # ==========================================================================
    # Page readiness
    # ==========================================================================

    def wait_for_page_loaded(self, timeout: Optional[int] = None) -> None:
        """
        Wait for the repository detail page content to load.

        We wait for the "New workspace from selection" button, which is
        always rendered on this page.
        """
        self.wait_for_visible(
            "css selector", "#create-new-workspace-button", timeout=timeout
        )

    # ==========================================================================
    # Repository metadata
    # ==========================================================================

    def get_repository_name(self) -> str:
        """
        Return the repository name (the h1 heading).

        The name is in the repository banner section inside a
        ``<Typography variant="h1">``.
        """
        el = self.wait_for_visible("css selector", "h1")
        return el.text or ""

    # ==========================================================================
    # Selection and workspace creation
    # ==========================================================================

    def click_new_workspace_from_selection(self) -> None:
        """
        Click the "New workspace from selection" button.

        This opens the WorkspaceEditor dialog pre-filled with the
        repository selection.

        Selector: ``#create-new-workspace-button``
        """
        logger.info("Clicking 'New workspace from selection'.")
        self.click("css selector", "#create-new-workspace-button")

    def click_add_to_existing_workspace(self) -> None:
        """
        Click the "Add selection to existing workspace" button.

        This opens a dialog to choose an existing workspace.

        Selector: ``#add-existing-workspace-button``
        """
        logger.info("Clicking 'Add selection to existing workspace'.")
        self.click("css selector", "#add-existing-workspace-button")

    # ==========================================================================
    # File tree
    # ==========================================================================

    def get_file_tree_rows(self):
        """
        Return all rows in the repository file tree table.

        The table has ``aria-label="repository resources"``.

        Returns
        -------
        list[WebElement]
        """
        return self.find_all(
            "css selector",
            'table[aria-label="repository resources"] tbody tr',
        )

    def select_all_files(self) -> None:
        """
        Click the "select all" checkbox in the file tree table header.

        Selector: ``input[aria-label="select all files"]``
        """
        logger.info("Selecting all files in repository tree.")
        self.click("css selector", 'input[aria-label="select all files"]')

    def click_file_by_name(self, filename: str) -> None:
        """
        Click a file or folder checkbox row by its filename inside the tree.

        The file tree is a ``<table aria-label="repository resources">``.
        Each row contains a ``<Typography>`` with the filename.  This method
        locates the row containing the filename and clicks the row (which
        toggles the checkbox).

        Parameters
        ----------
        filename : str
            The name of the file or folder to click.
        """
        logger.info('Clicking file: "%s" in repository tree.', filename)
        self.click(
            "xpath",
            f'//table[@aria-label="repository resources"]//tr[contains(., "{filename}")]',
        )

    def is_file_selected(self, filename: str) -> bool:
        """
        Check whether a specific file is selected in the file tree.

        Parameters
        ----------
        filename : str
            The file name to check.

        Returns
        -------
        bool
        """
        try:
            row = self.find(
                "xpath",
                f'//table[@aria-label="repository resources"]//tr[contains(., "{filename}")]',
            )
            checkbox = row.find_element("css selector", 'input[type="checkbox"]')
            return checkbox.is_selected()
        except Exception:
            return False

    # ==========================================================================
    # Create workspace from repository (dialogs)
    # ==========================================================================

    def wait_for_no_files_dialog(self, timeout: Optional[int] = None) -> None:
        """
        Wait for the "No files selected" confirmation dialog.

        This dialog appears when "New workspace from selection" is clicked
        without selecting any files.  It offers "Cancel" and "OK" buttons.
        """
        logger.info("Waiting for 'No files selected' dialog.")
        self.wait_for(
            "xpath",
            '//h2[contains(., "No files selected")]',
            timeout=timeout,
        )

    def confirm_create_workspace(self) -> None:
        """
        Click "OK" on the "No files selected" confirmation dialog.

        When no files are selected, the system creates a workspace with
        all repository files.
        """
        logger.info("Confirming workspace creation (OK button).")
        self.click(
            "xpath",
            '//button[contains(., "OK")]',
        )

    def wait_for_workspace_created(self, timeout: Optional[int] = None) -> None:
        """
        Wait for a success message after workspace creation.

        The portal shows a success Snackbar or navigates to the new
        workspace page.  Here we wait for the URL to contain
        ``/workspaces/`` (the new workspace detail page).
        """
        logger.info("Waiting for workspace creation to complete.")
        self.wait_for_url_contains("/workspaces/", timeout=timeout)

    # ==========================================================================
    # Navigation
    # ==========================================================================

    def click_back_to_repositories(self) -> None:
        """
        Click the "All repositories" back button to return to the listing.

        The back button text is "All repositories".
        """
        logger.info("Clicking 'All repositories' back button.")
        self.click("xpath", '//button[contains(., "All repositories")]')
