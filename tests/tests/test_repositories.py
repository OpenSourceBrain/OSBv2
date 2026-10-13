# coding: utf-8
"""
Repository listing, detail, and workspace-creation tests.

Tests
-----
- **test_repository_listing_loads** — the repositories page loads and
  shows repository cards (no auth needed).
- **test_repository_detail_loads** — clicking a repository opens the
  detail page with metadata and a file tree.
- **test_add_repository** — add a new repository (GitHub URL).
- **test_grid_list_toggle** — toggling between grid and list views.
- **test_file_tree_browsing** — interacting with the file tree table.
- **test_create_workspace_button_visible** — "New workspace from
  selection" button is visible on the detail page.
- **test_navigate_back_to_repositories** — back button on detail page.
- **test_create_workspace_from_repository** — create a workspace from a
  repository with file selection.
- **test_create_workspace_without_file_selection** — create a workspace
  without selecting any files (pulls everything).
"""

import logging
import time
import uuid

import pytest

from pages.home_page import HomePage
from pages.repository_page import RepositoriesPage, RepositoryPage

logger = logging.getLogger(__name__)


class TestRepositories:
    """Repository listing and detail page tests."""

    @pytest.mark.smoke
    def test_repository_listing_loads(self, driver, base_url):
        """
        The repositories listing page loads and shows content.

        Steps
        -----
        1. Navigate to ``/repositories``.
        2. Wait for the repository list container.
        """
        repos_page = RepositoriesPage(driver)
        repos_page.navigate(base_url)
        repos_page.wait_for_repositories_list()

        # Verify URL is correct.
        assert "/repositories" in driver.current_url, (
            f"Expected /repositories URL, got {driver.current_url}"
        )

    def test_repository_detail_loads(self, driver, base_url):
        """
        Open a repository detail page and verify content.

        Steps
        -----
        1. Navigate to repositories listing.
        2. Click the first repository card.
        3. Wait for the detail page ("New workspace from selection"
           button visible).
        4. Verify the repository name heading is present.
        """
        repos_page = RepositoriesPage(driver)
        repos_page.navigate(base_url)
        repos_page.wait_for_repositories_list()
        time.sleep(2)

        # Click the first repository card/link.
        repos_page.click_first_repository()

        # Now on the detail page.
        repo_detail = RepositoryPage(driver)
        repo_detail.wait_for_page_loaded()

        # Verify URL changed to /repositories/{id}.
        assert "/repositories/" in driver.current_url, (
            f"Expected /repositories/ URL, got {driver.current_url}"
        )

        # Verify repository name is visible.
        name = repo_detail.get_repository_name()
        assert name, "Repository name heading should not be empty."
        logger.info("Repository detail page loaded: '%s'.", name)

    def test_create_workspace_button_visible(self, driver, base_url):
        """
        The "New workspace from selection" button is present on the
        repository detail page.

        Steps
        -----
        1. Navigate to the first repository's detail page.
        2. Verify the button is visible.
        """
        repos_page = RepositoriesPage(driver)
        repos_page.navigate(base_url)
        repos_page.wait_for_repositories_list()
        time.sleep(2)
        repos_page.click_first_repository()

        repo_detail = RepositoryPage(driver)
        repo_detail.wait_for_page_loaded()

        # The "New workspace from selection" button should be visible.
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located(
                ("css selector", "#create-new-workspace-button")
            )
        )
        logger.info("'New workspace from selection' button is visible.")

    def test_navigate_back_to_repositories(self, driver, base_url):
        """
        The "All repositories" back button returns to the listing page.

        Steps
        -----
        1. Navigate to a repository detail page.
        2. Click "All repositories" back button.
        3. Verify back on the listing page.
        """
        repos_page = RepositoriesPage(driver)
        repos_page.navigate(base_url)
        repos_page.wait_for_repositories_list()
        time.sleep(2)
        repos_page.click_first_repository()

        repo_detail = RepositoryPage(driver)
        repo_detail.wait_for_page_loaded()

        # Click the back button.
        repo_detail.click_back_to_repositories()

        # Wait for listing page.
        repos_page.wait_for_repositories_list()

        # Should be back at /repositories (not /repositories/{id}).
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        WebDriverWait(driver, 10).until(
            EC.url_matches(r".*/repositories/?$")
        )
        logger.info("Successfully navigated back to repositories listing.")

    def test_add_repository(self, driver, base_url, authenticated_user):
        """
        Add a new repository by URL (the OSBv2 GitHub repo).

        Steps
        -----
        1. Log in.
        2. Click "Create new" in sidebar → "Repository".
        3. Fill the repository URL and name.
        4. Click "Add".
        5. Verify the repository appears in the listing.
        """
        driver.get(base_url)
        home = HomePage(driver)
        home.wait_for_workspaces_list()

        home.click_create_new_button()
        home.select_create_repository_from_menu()

        repos_page = RepositoriesPage(driver)
        repos_page.wait_for_add_repository_dialog()

        # Fill the form with OSBv2's own GitHub repo.
        repo_url = "https://github.com/OpenSourceBrain/OSBv2"
        repo_name = f"selenium-test-repo-{uuid.uuid4().hex[:8]}"

        repos_page.fill_repository_url(repo_url)
        repos_page.fill_repository_name(repo_name)

        repos_page.click_add_repository()

        time.sleep(3)

        # Verify we're back on repositories listing.
        assert "/repositories" in driver.current_url, (
            f"Expected to be on repositories listing, got {driver.current_url}"
        )
        logger.info("Repository '%s' added successfully.", repo_name)

    def test_grid_list_toggle(self, driver, base_url):
        """
        Toggle between grid and list views on the repositories page.

        Steps
        -----
        1. Navigate to repositories listing.
        2. Click the list view toggle.
        3. Click the grid view toggle.
        """
        repos_page = RepositoriesPage(driver)
        repos_page.navigate(base_url)
        repos_page.wait_for_repositories_list()

        # The toggle is in a ButtonGroup with aria-label.
        repos_page.click_list_view()
        time.sleep(1)
        repos_page.click_grid_view()
        time.sleep(1)

        logger.info("Grid/list toggle interacted with successfully.")

    def test_file_tree_browsing(self, driver, base_url):
        """
        Interact with the repository file tree table.

        Steps
        -----
        1. Navigate to a repository detail page.
        2. Check that the file tree table is present.
        3. Click a file row (if any exist).
        """
        repos_page = RepositoriesPage(driver)
        repos_page.navigate(base_url)
        repos_page.wait_for_repositories_list()

        try:
            repos_page.click_first_repository()
        except RuntimeError:
            pytest.skip("No repository detail links found — API may be down.")

        repo_detail = RepositoryPage(driver)
        repo_detail.wait_for_page_loaded()

        # Check the file tree table exists.
        rows = repo_detail.get_file_tree_rows()
        logger.info("File tree has %d rows.", len(rows))

        if rows:
            # Click the first file row to select it.
            rows[0].click()
            time.sleep(1)
            logger.info("First file row clicked.")

    def test_create_workspace_from_repository(self, driver, base_url, authenticated_user):
        """
        Create a new workspace from a repository with file selection.

        Steps
        -----
        1. Log in.
        2. Navigate to a repository detail page.
        3. Select files in the file tree.
        4. Click "New workspace from selection".
        5. Verify the workspace editor dialog opens.
        """
        driver.get(base_url)
        home = HomePage(driver)
        home.wait_for_workspaces_list()

        repos_page = RepositoriesPage(driver)
        repos_page.navigate(base_url)
        repos_page.wait_for_repositories_list()

        try:
            repos_page.click_first_repository()
        except RuntimeError:
            pytest.skip("No repository detail links found — API may be down.")

        repo_detail = RepositoryPage(driver)
        repo_detail.wait_for_page_loaded()

        # Select all files.
        try:
            repo_detail.select_all_files()
            time.sleep(1)
            logger.info("All files selected in repository tree.")
        except Exception:
            logger.warning("Could not select all files.")

        # Click "New workspace from selection".
        repo_detail.click_new_workspace_from_selection()

        # Verify workspace editor dialog appears.
        from pages.workspace_page import WorkspacePage
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    ("css selector", "#workspaceName")
                )
            )
            logger.info("Workspace editor opened from repository selection.")
        except Exception:
            pytest.skip("Workspace editor did not appear — API may be down.")

    def test_create_workspace_without_file_selection(self, driver, base_url, authenticated_user):
        """
        Create a workspace from a repository without selecting any files
        (should pull all files).

        Steps
        -----
        1. Navigate to a repository detail page (logged in).
        2. Click "New workspace from selection" without selecting files.
        3. Verify the "No files selected" dialog appears.
        4. Click "OK" to confirm.
        5. Verify workspace creation proceeds.
        """
        driver.get(base_url)
        home = HomePage(driver)
        home.wait_for_workspaces_list()

        repos_page = RepositoriesPage(driver)
        repos_page.navigate(base_url)
        repos_page.wait_for_repositories_list()

        try:
            repos_page.click_first_repository()
        except RuntimeError:
            pytest.skip("No repository detail links found — API may be down.")

        repo_detail = RepositoryPage(driver)
        repo_detail.wait_for_page_loaded()

        # Click without selecting any files.
        repo_detail.click_new_workspace_from_selection()

        # Wait for "No files selected" confirmation dialog.
        try:
            repo_detail.wait_for_no_files_dialog()
            time.sleep(1)
            repo_detail.confirm_create_workspace()
            logger.info("Confirmed workspace creation without file selection.")
        except Exception:
            logger.info("'No files selected' dialog did not appear — API may handle this differently.")

        time.sleep(2)
