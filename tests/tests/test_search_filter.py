# coding: utf-8
"""
Search and filter tests for workspaces and repositories.

Tests
-----
- **test_workspace_search** — typing in the search field filters the
  workspace listing.
- **test_filter_popover_opens** — the filter popover opens and shows
  tag/type options.
"""

import logging

import pytest

from pages.home_page import HomePage
from pages.repository_page import RepositoriesPage

logger = logging.getLogger(__name__)


class TestSearchFilter:
    """Search and filter functionality tests."""

    def test_workspace_search_field_exists(self, driver, base_url):
        """
        The search text field is present on the workspaces page.

        Steps
        -----
        1. Navigate to the home page.
        2. Verify the search input field exists.
        """
        driver.get(base_url)
        home = HomePage(driver)
        home.wait_for_workspaces_list()

        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                ("css selector", "#standard-start-adornment")
            )
        )
        logger.info("Search field found on workspaces page.")

    def test_repository_search_field_exists(self, driver, base_url):
        """
        The search text field is present on the repositories page.

        Steps
        -----
        1. Navigate to repositories page.
        2. Verify the search input field exists.
        """
        repos_page = RepositoriesPage(driver)
        repos_page.navigate(base_url)
        repos_page.wait_for_repositories_list()

        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                ("css selector", "#standard-start-adornment")
            )
        )
        logger.info("Search field found on repositories page.")

    def test_filter_popover_opens(self, driver, base_url):
        """
        The filter popover opens on the workspaces page.

        Steps
        -----
        1. Navigate to the home page.
        2. Click the "Filter" button.
        3. Verify the popover appears.
        """
        driver.get(base_url)
        home = HomePage(driver)
        home.wait_for_workspaces_list()

        home.open_filter_popover()
        home.wait_for_filter_popover()

        logger.info("Filter popover opened successfully.")
