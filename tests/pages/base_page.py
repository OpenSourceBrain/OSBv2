# coding: utf-8
"""
Base page object for the OSBv2 Selenium test suite.

Every page class inherits from ``BasePage``, which provides common
Selenium operations — waiting for elements, clicking, typing, switching
into iframes — with sensible OSB-specific timeouts taken from ``config.py``.
"""

import logging
from typing import Optional

from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from config import WORKSPACE_LOAD_TIMEOUT
from css_selectors import APPLICATION_FRAME

logger = logging.getLogger(__name__)


class BasePage:
    """
    Selenium Page Object base class.

    Parameters
    ----------
    driver : WebDriver
        The active Selenium WebDriver instance.
    """

    # The default timeout for most element waits.
    DEFAULT_TIMEOUT = 30

    # The URL path (or full URL) of this page.  Set by subclasses.
    PAGE_PATH: str = "/"

    def __init__(self, driver: WebDriver) -> None:
        self.driver = driver
        self._wait = WebDriverWait(driver, self.DEFAULT_TIMEOUT)

    # -- navigation -----------------------------------------------------------

    def navigate(self, base_url: str = "") -> None:
        """
        Navigate the browser to this page.

        Parameters
        ----------
        base_url : str
            Root URL to prepend (e.g. ``https://www.v2dev.opensourcebrain.org``).
        """
        url = base_url.rstrip("/") + self.PAGE_PATH
        logger.info("Navigating to %s", url)
        self.driver.get(url)

    def current_url(self) -> str:
        """Return the browser's current URL."""
        return self.driver.current_url

    def page_title(self) -> str:
        """Return the page title."""
        return self.driver.title

    # -- element lookup helpers -----------------------------------------------

    def find(self, by: str, value: str) -> WebElement:
        """
        Find a single element on the page.

        Parameters
        ----------
        by : str
            Selenium ``By`` strategy (``"css selector"``, ``"id"``, etc.).
        value : str
            The selector string.
        """
        return self.driver.find_element(by, value)

    def find_all(self, by: str, value: str) -> list[WebElement]:
        """Find all matching elements."""
        return self.driver.find_elements(by, value)

    def find_by_id(self, element_id: str) -> WebElement:
        """Shortcut for finding an element by its HTML ``id``."""
        return self.find("id", element_id)

    # -- waiting helpers ------------------------------------------------------

    def wait_for(self, by: str, value: str, timeout: Optional[int] = None):
        """
        Wait for an element to be present in the DOM.

        Parameters
        ----------
        timeout : int or None
            Seconds to wait.  Falls back to :attr:`DEFAULT_TIMEOUT`.
        """
        return WebDriverWait(
            self.driver, timeout or self.DEFAULT_TIMEOUT
        ).until(EC.presence_of_element_located((by, value)))

    def wait_for_visible(self, by: str, value: str, timeout: Optional[int] = None):
        """Wait for an element to be *visible* (not just present)."""
        return WebDriverWait(
            self.driver, timeout or self.DEFAULT_TIMEOUT
        ).until(EC.visibility_of_element_located((by, value)))

    def wait_for_clickable(self, by: str, value: str, timeout: Optional[int] = None):
        """Wait for an element to be clickable."""
        return WebDriverWait(
            self.driver, timeout or self.DEFAULT_TIMEOUT
        ).until(EC.element_to_be_clickable((by, value)))

    def wait_until_gone(self, by: str, value: str, timeout: Optional[int] = None):
        """Wait for an element to disappear from the DOM."""
        return WebDriverWait(
            self.driver, timeout or self.DEFAULT_TIMEOUT
        ).until_not(EC.presence_of_element_located((by, value)))

    def wait_for_text(
        self, by: str, value: str, text: str, timeout: Optional[int] = None
    ):
        """Wait until the element's text *contains* ``text``."""
        return WebDriverWait(
            self.driver, timeout or self.DEFAULT_TIMEOUT
        ).until(EC.text_to_be_present_in_element((by, value), text))

    def wait_for_url_contains(self, substring: str, timeout: Optional[int] = None):
        """Wait until ``driver.current_url`` contains ``substring``."""
        return WebDriverWait(
            self.driver, timeout or self.DEFAULT_TIMEOUT
        ).until(EC.url_contains(substring))

    # -- interaction helpers --------------------------------------------------

    def click(self, by: str, value: str, timeout: Optional[int] = None) -> None:
        """Wait for an element to be clickable, then click it.

        Falls back to a JavaScript click if the element is obscured by
        another element (common with MUI overlays and slow pages).
        """
        el = self.wait_for_clickable(by, value, timeout)
        try:
            el.click()
        except Exception:
            logger.debug("Native click failed, using JavaScript click.")
            self.driver.execute_script("arguments[0].click();", el)

    def type_text(self, by: str, value: str, text: str, clear: bool = True) -> None:
        """Wait for an element to be present, optionally clear it, then type."""
        el = self.wait_for(by, value)
        if clear:
            el.clear()
        el.send_keys(text)

    # -- iframe helpers -------------------------------------------------------

    def switch_to_app_frame(self, timeout: Optional[int] = None) -> None:
        """
        Switch the driver's context into the application iframe
        (``#workspace-frame``).

        The application iframe hosts Jupyter-based tools (NetPyNE, NWB
        Explorer, JupyterLab) and requires separate Selenium context.

        Parameters
        ----------
        timeout : int or None
            Override the wait timeout.  Defaults to
            :data:`config.WORKSPACE_LOAD_TIMEOUT` (10 min) because
            JupyterHub server spawning can be slow.
        """
        logger.info("Switching to application iframe...")
        frame = self.wait_for(
            "css selector",
            APPLICATION_FRAME,
            timeout=timeout or WORKSPACE_LOAD_TIMEOUT,
        )
        self.driver.switch_to.frame(frame)
        logger.info("Now inside application iframe.")

    def switch_to_main(self) -> None:
        """Switch back from the iframe to the main page context."""
        self.driver.switch_to.default_content()
        logger.info("Switched back to main page context.")
