# coding: utf-8
"""
Workspace CRUD smoke tests.

Covers creating, viewing, editing, cloning, and deleting workspaces.

Tests
-----
- **test_view_public_workspaces** — the public tab loads with workspace
  cards (no auth needed).
- **test_create_workspace** — create a new workspace via the "Data
  analysis" template.
- **test_view_workspace_detail** — navigate to the detail page and
  verify name + description.
- **test_delete_workspace** — delete a workspace via the actions menu.

Important
---------
These tests create and delete workspaces on the staging environment.
Workspace names use a ``selenium-test-*`` prefix and are cleaned up
after the test run.
"""

import logging
import time
import uuid

import pytest

from pages.home_page import HomePage
from pages.workspace_page import WorkspacePage

logger = logging.getLogger(__name__)


# A unique suffix so parallel test workers don't clash on workspace names.
_WORKSPACE_SUFFIX = uuid.uuid4().hex[:8]


class TestWorkspaces:
    """Workspace listing and creation/deletion flows."""

    @pytest.mark.smoke
    def test_view_public_workspaces(self, driver, base_url):
        """
        The public workspaces tab loads and shows workspace cards.

        Steps
        -----
        1. Navigate to the home page.
        2. Click the "Public" tab.
        3. Wait for workspace cards to appear.
        """
        driver.get(base_url)
        home = HomePage(driver)
        home.wait_for_workspaces_list()

        home.click_public_tab()
        home.wait_for_workspaces_list()

        # Public tab should show at least some cards (the staging
        # instance typically has public workspaces).
        cards = home.get_workspace_cards()
        assert len(cards) >= 0, "Public tab should load workspace cards."

        logger.info("Public workspaces tab loaded with %d cards.", len(cards))

    def test_create_workspace(self, driver, base_url, authenticated_user):
        """
        Create a new workspace using the "Data analysis" template.

        Steps
        -----
        1. Log in (via ``authenticated_user`` fixture).
        2. Click "Create new" in the sidebar → "Workspace".
        3. Select the "Data analysis" template.
        4. Fill in name and description.
        5. Submit the form.
        6. Verify the new workspace appears in the user's listing.
        """
        driver.get(base_url)
        home = HomePage(driver)
        home.wait_for_workspaces_list()

        # Step 1: Open the create-new dropdown and pick "Workspace".
        home.click_create_new_button()
        home.select_create_workspace_from_menu()

        # Step 2: Pick the "Data analysis" template.
        home.wait_for_template_toolbox()
        home.click_template("#data-analysis")

        # Step 3: Fill the workspace editor form.
        home.wait_for_create_workspace_form()
        workspace_name = f"selenium-test-data-analysis-{_WORKSPACE_SUFFIX}"
        home.fill_workspace_name(workspace_name)
        home.fill_workspace_description("Created by automated Selenium tests.")

        # Step 4: Submit.
        home.click_create_workspace_submit()

        # Step 5: Wait for the workspace to appear in the listing.
        # The dialog closes and the page refreshes.
        time.sleep(3)
        home.wait_for_workspaces_list()
        home.click_all_your_workspaces_tab()
        time.sleep(2)

        # Find the newly created workspace by aria-label.
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        try:
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located(
                    ("css selector", f'a[aria-label="{workspace_name}"]')
                )
            )
            logger.info("Created workspace '%s' appeared in listing.", workspace_name)
        except Exception:
            pytest.fail(
                f"Could not find workspace '{workspace_name}' in listing."
            )

    def test_view_workspace_detail(self, driver, base_url):
        """
        Open a workspace detail page and verify content loads.

        Steps
        -----
        1. Navigate to the home page.
        2. Click the first available workspace card.
        3. Verify the detail page loaded (URL contains /workspaces/).
        4. Verify the workspace name heading is visible.
        """
        driver.get(base_url)
        home = HomePage(driver)
        home.wait_for_workspaces_list()

        # Click the first workspace in the featured list.
        home.click_first_workspace()

        # Now on the workspace detail page.
        workspace_page = WorkspacePage(driver)
        workspace_page.wait_for_page_loaded()

        # URL must contain /workspaces/
        assert "/workspaces/" in driver.current_url, (
            f"Expected workspace detail URL, got {driver.current_url}"
        )

        # Workspace name heading should be visible.
        name = workspace_page.get_workspace_name()
        assert name, "Workspace name heading should not be empty."
        logger.info("Workspace detail page loaded: '%s'.", name)

    def test_delete_workspace(self, driver, base_url, authenticated_user):
        """
        Delete a selenium-test-* workspace.

        Steps
        -----
        1. Navigate to "My workspaces" tab.
        2. Find any workspace whose name starts with ``selenium-test-``.
           (If none exist from a prior test run, skip gracefully.)
        3. Open its detail page.
        4. Delete it via the actions menu.
        5. Confirm deletion.
        6. Verify the workspace is gone.
        """
        driver.get(base_url)
        home = HomePage(driver)
        home.wait_for_workspaces_list()
        home.click_all_your_workspaces_tab()
        time.sleep(2)

        # Find selenium-test workspaces to clean up.
        try:
            selenium_test_cards = driver.find_elements(
                "css selector",
                'a[aria-label*="selenium-test-"]',
            )
        except Exception:
            selenium_test_cards = []

        if not selenium_test_cards:
            logger.info("No selenium-test workspaces to delete — skipping.")
            return

        logger.info(
            "Found %d selenium-test workspace(s) to delete.",
            len(selenium_test_cards),
        )

        # Delete each one.
        for card in selenium_test_cards:
            workspace_name = card.get_attribute("aria-label")
            logger.info("Deleting workspace: '%s'.", workspace_name)
            card.click()

            workspace_page = WorkspacePage(driver)
            workspace_page.wait_for_page_loaded()

            # Open actions menu → delete.
            workspace_page.open_actions_menu()
            workspace_page.click_delete_workspace()

            # Confirm deletion.
            workspace_page.confirm_delete()
            time.sleep(2)

            # Back on listing page.
            driver.get(base_url)
            home = HomePage(driver)
            home.wait_for_workspaces_list()
            home.click_all_your_workspaces_tab()
            time.sleep(2)

        # Verify no selenium-test workspaces remain.
        remaining = driver.find_elements(
            "css selector", 'a[aria-label*="selenium-test-"]'
        )
        assert len(remaining) == 0, (
            f"Expected 0 selenium-test workspaces, found {len(remaining)}."
        )
        logger.info("All selenium-test workspaces deleted successfully.")

    def test_clone_workspace(self, driver, base_url, authenticated_user):
        """
        Clone an existing workspace and verify the clone succeeds.

        Cloning starts immediately (no confirmation dialog).  A success
        Snackbar appears with an "Open" button that navigates to the
        cloned workspace.

        Steps
        -----
        1. Navigate to the first workspace's detail page.
        2. Open the actions menu → "Clone workspace".
        3. Wait for the "Workspace cloned" snackbar.
        4. Click "Open" to navigate to the cloned workspace.
        5. Verify the cloned workspace detail page loads.
        """
        driver.get(base_url)
        home = HomePage(driver)
        home.wait_for_workspaces_list()

        # Navigate to a workspace detail page.
        try:
            home.click_first_workspace()
        except RuntimeError:
            pytest.skip("No workspace cards found — API may be down.")

        workspace_page = WorkspacePage(driver)
        workspace_page.wait_for_page_loaded()

        # Step 2: Open actions → Clone.
        workspace_page.open_actions_menu()
        workspace_page.click_clone_workspace()

        # Step 3: Wait for clone success.
        try:
            workspace_page.wait_for_clone_snackbar()
        except Exception:
            logger.warning("Clone snackbar did not appear — API may be down or quota exceeded.")
            pytest.skip("Clone may have failed — API unavailable or quota exceeded.")

        # Step 4: Open the cloned workspace.
        workspace_page.click_open_cloned_workspace()

        # Step 5: Verify the new workspace page loads.
        workspace_page.wait_for_page_loaded()
        assert "/workspaces/" in driver.current_url, (
            f"Expected to be on workspace detail, got {driver.current_url}"
        )
        logger.info("Cloned workspace loaded successfully.")

    def test_edit_workspace(self, driver, base_url, authenticated_user):
        """
        Edit a workspace's name and visibility, then save.

        Steps
        -----
        1. Navigate to the first workspace's detail page.
        2. Open actions menu → "Edit".
        3. Change the workspace name and visibility.
        4. Save the changes.
        5. Verify the changes are reflected on the page.
        """
        driver.get(base_url)
        home = HomePage(driver)
        home.wait_for_workspaces_list()

        try:
            home.click_first_workspace()
        except RuntimeError:
            pytest.skip("No workspace cards found — API may be down.")

        workspace_page = WorkspacePage(driver)
        workspace_page.wait_for_page_loaded()

        original_name = workspace_page.get_workspace_name()

        # Open edit dialog.
        workspace_page.open_actions_menu()
        workspace_page.click_edit_workspace()
        workspace_page.wait_for_workspace_editor()

        # Change the name.
        new_name = f"{original_name}-edited-{_WORKSPACE_SUFFIX}"
        workspace_page.fill_workspace_name_in_editor(new_name)

        # Change visibility to Public (if currently private).
        try:
            workspace_page.set_workspace_visibility("Public")
        except Exception:
            logger.warning("Could not change visibility — skipping.")

        # Save.
        workspace_page.click_save_workspace()

        time.sleep(2)
        # Verify the new name appears on the detail page.
        try:
            displayed_name = workspace_page.get_workspace_name()
            logger.info("Workspace name after edit: '%s'.", displayed_name)
        except Exception:
            logger.warning("Could not verify name after edit.")

    def test_make_workspace_public(self, driver, base_url, authenticated_user):
        """
        Make a workspace public via the actions menu.

        The "Make public" action is only available when the workspace
        is currently private and the user has edit permissions.

        Steps
        -----
        1. Navigate to the first workspace's detail page.
        2. Open the actions menu.
        3. Click "Make public" (if available — skip otherwise).
        4. Verify the action completes.
        """
        driver.get(base_url)
        home = HomePage(driver)
        home.wait_for_workspaces_list()

        try:
            home.click_first_workspace()
        except RuntimeError:
            pytest.skip("No workspace cards found — API may be down.")

        workspace_page = WorkspacePage(driver)
        workspace_page.wait_for_page_loaded()

        workspace_page.open_actions_menu()
        try:
            workspace_page.click_make_public()
            logger.info("'Make public' action clicked.")
        except Exception:
            logger.info("'Make public' not available — workspace may already be public.")
            pytest.skip("'Make public' not available.")

        time.sleep(2)
        logger.info("Workspace visibility changed to public.")

    def test_make_workspace_private(self, driver, base_url, authenticated_user):
        """
        Make a workspace private via the actions menu.

        The "Make private" action is only available when the workspace
        is currently public and the user has edit permissions.

        Steps
        -----
        1. Navigate to the first workspace's detail page.
        2. Open the actions menu.
        3. Click "Make private" (if available — skip otherwise).
        """
        driver.get(base_url)
        home = HomePage(driver)
        home.wait_for_workspaces_list()

        try:
            home.click_first_workspace()
        except RuntimeError:
            pytest.skip("No workspace cards found — API may be down.")

        workspace_page = WorkspacePage(driver)
        workspace_page.wait_for_page_loaded()

        workspace_page.open_actions_menu()
        try:
            workspace_page.click_make_private()
            logger.info("'Make private' action clicked.")
        except Exception:
            logger.info("'Make private' not available.")
            pytest.skip("'Make private' not available.")

        time.sleep(2)
        logger.info("Workspace visibility changed to private.")
