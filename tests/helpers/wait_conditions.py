# coding: utf-8
"""
Custom expected-conditions for the OSBv2 Selenium test suite.

Selenium's built-in ``expected_conditions`` cover most needs.  The classes
here add OSB-specific conditions such as waiting for a Jupyter application
to signal readiness inside an iframe, or waiting for a workspace resource
status to settle.
"""

from selenium.webdriver.support import expected_conditions as EC  # noqa: F401

# Re-export the built-in conditions so test code can import everything
# from a single place.
__all__ = ["EC"]
