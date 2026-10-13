# coding: utf-8
"""
Configuration loader for OSBv2 Selenium tests.

Reads settings from environment variables, with a .env file fallback for
local development.  Keys mirror the environment variables the OSB portal
frontend itself uses (vite.config.ts), plus test-specific variables.

Examples
--------
    export APP_URL=https://www.v2dev.opensourcebrain.org/
    export USERNAME=your-user
    export PASSWORD=your-password
    export AUTH_METHOD=ui
    pytest tests/
"""

import os
from pathlib import Path

from dotenv import load_dotenv

# Load the .env file from the tests/ directory (relative to this file).
_env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(_env_path, override=True)


# -- application-under-test ---------------------------------------------------

APP_URL = os.getenv(
    "APP_URL",
    "https://v2dev.opensourcebrain.org/",
)
"""Base URL of the OSBv2 instance to test against."""


# -- test credentials ---------------------------------------------------------

OSB_USERNAME = os.getenv("OSB_USERNAME", "")
"""Keycloak username for the test account."""

OSB_PASSWORD = os.getenv("OSB_PASSWORD", "")
"""Keycloak password for the test account."""


# -- authentication strategy --------------------------------------------------

AUTH_METHOD = os.getenv("AUTH_METHOD", "ui")
"""
How to authenticate before tests run.

``"ui"``     – drive the Keycloak login form with Selenium (realistic, slow).
``"cookie"`` – bypass the login form by setting the ``kc-access`` cookie
               directly (fast, requires a valid JWT obtained externally).
"""


# -- timeouts (seconds) -------------------------------------------------------

IMPLICIT_WAIT = 15
"""Seconds to wait for elements before raising TimeoutException."""

PAGE_LOAD_TIMEOUT = 120
"""Maximum seconds to wait for a full page navigation."""

WORKSPACE_LOAD_TIMEOUT = 600
"""Maximum seconds to wait for a workspace application (iframe) to be ready."""

CAPTURE_SCREENSHOTS = os.getenv("CAPTURE_SCREENSHOTS", "0") == "1"
"""If truthy, take a screenshot on test failure and save to tests/screenshots/."""


# -- worker count for parallel execution --------------------------------------

PARALLEL_WORKERS = int(os.getenv("PARALLEL_WORKERS", "2"))
"""
Number of parallel pytest-xdist workers.
Keep low (2) to avoid rate-limiting the staging API.
"""
