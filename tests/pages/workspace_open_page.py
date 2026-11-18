# coding: utf-8
"""
Page object for the OSBv2 workspace-open page.

URL: ``/workspaces/open/:workspaceId/:app``

This is a **protected route** (requires authentication).  When the user
opens a workspace with an application, the browser navigates here.  The
page renders:

- A left :class:`WorkspaceDrawer` sidebar with a resource browser.
- A right-hand panel containing an ``<iframe id="workspace-frame">``
  that loads the Jupyter-based application (NetPyNE, NWB Explorer,
  or JupyterLab).

Interacting with elements *inside* the iframe requires switching the
Selenium context, handled by the base page's
:meth:`~pages.base_page.BasePage.switch_to_app_frame` and
:meth:`~pages.base_page.BasePage.switch_to_main` helpers.
"""

import logging
from typing import Optional

from pages.base_page import BasePage

logger = logging.getLogger(__name__)


class WorkspaceOpenPage(BasePage):
    """
    Workspace-open page (application iframe view).

    Attributes
    ----------
    PAGE_PATH : str
        ``/workspaces/open/`` – the full path includes the workspace id
        and application subdomain.
    """

    PAGE_PATH = "/workspaces/open/"

    # ==========================================================================
    # Page readiness
    # ==========================================================================

    def wait_for_app_frame(
        self, timeout: Optional[int] = None
    ) -> None:
        """
        Wait for the application iframe to be present in the DOM.

        Selector: ``#workspace-frame``

        Parameters
        ----------
        timeout : int or None
            Seconds to wait.  Defaults to
            :data:`config.WORKSPACE_LOAD_TIMEOUT` (10 min).
        """
        logger.info("Waiting for application iframe (#workspace-frame).")
        self.wait_for(
            "css selector",
            "#workspace-frame",
            timeout=timeout,
        )

    # ==========================================================================
    # Inside-iframe interactions
    # ==========================================================================

    # These methods assume the driver has already switched into the
    # iframe via self.switch_to_app_frame().  After use, call
    # self.switch_to_main() to return to the portal page.

    def wait_for_netpyne_ready(self, timeout: Optional[int] = None) -> None:
        """
        Wait for NetPyNE's main container to appear inside the iframe.

        Selector (inside iframe): ``#mainContainer``
        """
        logger.info("Waiting for NetPyNE to be ready.")
        self.wait_for(
            "css selector", "#mainContainer", timeout=timeout
        )

    def wait_for_nwb_explorer_ready(self, timeout: Optional[int] = None) -> None:
        """
        Wait for NWB Explorer's main container.

        Selector (inside iframe): ``#main-container-inner``
        """
        logger.info("Waiting for NWB Explorer to be ready.")
        self.wait_for(
            "css selector", "#main-container-inner", timeout=timeout
        )

    def wait_for_jupyterlab_ready(self, timeout: Optional[int] = None) -> None:
        """
        Wait for JupyterLab's main dock panel.

        Selector (inside iframe): ``#jp-main-dock-panel``
        """
        logger.info("Waiting for JupyterLab to be ready.")
        self.wait_for(
            "css selector", "#jp-main-dock-panel", timeout=timeout
        )

    # ==========================================================================
    # Drawer sidebar interactions
    # ==========================================================================

    def toggle_drawer(self) -> None:
        """
        Click the drawer toggle button (ArrowLeft/ArrowRight icon).

        The drawer can be collapsed to give the application more screen
        real estate.
        """
        logger.info("Toggling workspace drawer.")
        self.click("css selector", ".workspace-tab-header")
