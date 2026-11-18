"""Sphinx configuration for the osbv2-api documentation.

The client package (``osbv2_api``) is added to ``sys.path`` directly from the
repository root so the docs build without installing the package first.
"""

import os
import sys

# -- Path setup --------------------------------------------------------------

# Repository root (the directory that contains ``osbv2_api/``). The conf.py
# lives in ``docs/``, so the root is one level up.
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.abspath(".."))
sys.path.insert(0, REPO_ROOT)
# The generated client modules use top-level absolute imports
# (e.g. ``from workspaces.api_client import ApiClient``), so the
# package subdirectory must be importable as well.
sys.path.insert(0, os.path.join(REPO_ROOT, "osbv2_api"))

# -- Project information -----------------------------------------------------

project = "osbv2-api"
author = "OpenSourceBrain"
copyright = "OpenSourceBrain, MIT License"

# The version is intentionally not imported from the package (executing
# generated modules at build time is unnecessary and fragile).
version = ""
release = ""

# -- General configuration ---------------------------------------------------

extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.autosummary",
    "sphinx.ext.napoleon",
    "sphinx.ext.viewcode",
    "myst_parser",
]

# Support reStructuredText and Markdown sources side by side.
source_suffix = {
    ".rst": "restructuredtext",
    ".md": "markdown",
}

master_doc = "index"

# Patterns, relative to this directory, to ignore when looking for sources.
exclude_patterns = [
    "_build",
    "_build/*",
    "Thumbs.db",
    ".DS_Store",
]

# Files copied verbatim into the output (only if the directory exists).
if os.path.isdir(os.path.join(os.path.dirname(__file__), "_static")):
    html_static_path = ["_static"]

pygments_style = "sphinx"

# -- MyST (Markdown) configuration ------------------------------------------

# Core table syntax is supported out of the box; only optional conveniences
# that ship with myst-parser itself are enabled here.
myst_enable_extensions = [
    "deflist",
    "fieldlist",
]

myst_heading_anchors = 3

# -- autodoc / autosummary / napoleon ---------------------------------------

autodoc_default_options = {
    "members": True,
    "undoc-members": False,
    "show-inheritance": True,
}

autodoc_member_order = "bysource"
autodoc_typehints = "description"

autosummary_generate = True

napoleon_google_docstring = True
napoleon_numpy_docstring = True
napoleon_include_init_with_doc = False
napoleon_use_rtype = True

# -- Options for HTML output -------------------------------------------------

html_theme = "sphinx_rtd_theme"

html_theme_options = {
    "navigation_depth": 4,
}

html_title = "osbv2-api documentation"

# -- Options for warnings ---------------------------------------------------

# Generated model modules carry long inherited signatures; keep the build log
# focused on genuine problems.
suppress_warnings = [
    "misc.highlighting_failure",
]
