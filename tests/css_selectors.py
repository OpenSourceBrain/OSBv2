# coding: utf-8
"""
CSS selectors for the OSBv2 portal.

Ported from ``applications/osb-portal/test/e2e/selectors.ts`` and extended
with additional selectors found by inspecting the React component tree.

Prefer element ``id`` attributes over CSS class names wherever possible;
MUI generates unstable class names at build time.
"""


# ============================================================================
# Home / Workspaces listing page
# ============================================================================

# Outer container of the workspaces list view.
WORKSPACES = "#workspaces-list"

# Tabs on the workspaces page.
PUBLIC_WORKSPACES_TAB = "#public-tab"
FEATURED_WORKSPACES_TAB = "#featured-tab"
ALL_YOUR_WORKSPACES_TAB = "#your-all-workspaces-tab"

# Individual workspace card link – anchors on the listing page.
WORKSPACE_PAGE_LINK = ".workspace-page-link"

# Name heading on a workspace card.
WORKSPACE_CARD = "a.MuiCardActionArea-root"


# ============================================================================
# Workspace detail page
# ============================================================================

# Outer container div for the workspace detail view.
WORKSPACE_DETAILS = "#workspace-details"

# Sections of the workspace detail page.
WORKSPACE_DETAIL_CONTAINER = "#workspace-detail-container"
WORKSPACE_DETAIL_TOP = "#workspace-detail-top"
WORKSPACE_DETAIL_SIDEBAR = "#workspace-detail-sidebar"
WORKSPACE_DETAIL_CONTENT = "#workspace-detail-content"

# Workspace name heading (h1.workspace-name).
WORKSPACE_NAME_HEADING = ".workspace-name"

# Three-dot actions menu trigger.
WORKSPACE_OPTIONS_BTN = ".btn-actions"

# The actions dropdown menu itself.
WORKSPACE_OPTIONS_LIST = 'ul[class*="MuiMenu-list"]'

# Open-with split button (the left/main part).
SELECT_APPLICATION = ".split-button-control"

# Opens the application (the main button, not the dropdown arrow).
OPEN_WITH_APPLICATION = ".open-workspace"

# Application selection dropdown menu.
SPLIT_BUTTON_MENU = "#split-button-menu"

# Delete action in the actions menu.
DELETE_WORKSPACE = ".delete-workspace"

# Clone workspace action in the actions menu.
CLONE_WORKSPACE = ".clone-workspace"

# Edit workspace action in the actions menu.
EDIT_WORKSPACE = ".edit-workspace"

# Make-public / make-private actions.
MAKE_PUBLIC_WORKSPACE = ".make-public-workspace"
MAKE_PRIVATE_WORKSPACE = ".make-private-workspace"


# ============================================================================
# Workspace open page (application iframe)
# ============================================================================

# The iframe that hosts the Jupyter-based application.
APPLICATION_FRAME = "#workspace-frame"

# NetPyNE application — once loaded inside the iframe.
NETPYNE_MAIN_CONTAINER = "#mainContainer"
NETPYNE_CELL_BUTTON = "#selectCellButton"

# NWB Explorer — once loaded inside the iframe.
NWB_APP = "#main-container-inner"

# JupyterLab — once loaded inside the iframe.
JUPYTER_CONTENT = "#jp-main-dock-panel"


# ============================================================================
# Workspace creation form (WorkspaceEditor dialog)
# ============================================================================

# Text field for the workspace name.
WORKSPACE_NAME = "#workspaceName"

# The dialog box that contains the workspace creation form.
WORKSPACE_CREATION_BOX = ".MuiDialogContent-root"

# Workspace description textarea.
WORKSPACE_DESCRIPTION = 'textarea[class*="section-container input"]'

# Tags input inside the workspace editor.
WORKSPACE_TAGS = (
    'input[class*="MuiInputBase-input"]'
    '[class*="MuiFilledInput-input"]'
    '[class*="MuiAutocomplete-input"]'
)

# Submit / "Create A New Workspace" button.
CREATE_NEW_WORKSPACE = "#create-a-new-workspace-button"


# ============================================================================
# Workspace templates (NewWorkspaceToolBox)
# ============================================================================

# Each template card in the "Create new workspace" dialog.
TEMPLATE_COMPUTATIONAL_MODELING = "#computational-modeling"
TEMPLATE_DATA_ANALYSIS = "#data-analysis"
TEMPLATE_INTERACTIVE_DEVELOPMENT = "#interactive-development"
TEMPLATE_WORKSPACE_FROM_REPOSITORY = "#workspace-from-repository"


# ============================================================================
# Sidebar / MainDrawer
# ============================================================================

# "Create new" button in the left sidebar.
CREATE_NEW_WORKSPACE_REPOSITORY = "#create-new-workspace-repository"

# Dropdown menu that appears after clicking "Create new".
CREATE_NEW_MENU = "#create-new-workspace-repository-menu"


# ============================================================================
# Repository pages
# ============================================================================

# Outer container for the repository listing.
REPOSITORIES_LIST = "#repositories-list"

# "Add selection to existing workspace" button on repository detail.
ADD_EXISTING_WORKSPACE_BTN = "#add-existing-workspace-button"

# "New workspace from selection" button on repository detail.
CREATE_NEW_WORKSPACE_BTN = "#create-new-workspace-button"


# ============================================================================
# Header / AppBar
# ============================================================================

# Sign-in button (visible when logged out).
SIGN_IN = ".sign-in"

# User menu button (visible when logged in – shows username).
USER_MENU_BTN = ".user-menu-btn"

# The user menu dropdown list.
USER_MENU = ".user-menu"

# "My account" menu item.
MY_ACCOUNT_MENU_ITEM = ".my-account-menu-item"

# "Logout" menu item.
LOGOUT_MENU_ITEM = ".logout-menu-item"

# OSB logo / home link.
OSB_LOGO = (
    'a[class*="MuiTypography-root"]'
    '[class*="MuiLink-root"]'
    '[class*="MuiLink-underlineAlways"]'
)


# ============================================================================
# Keycloak login form
# ============================================================================

# Username field.
USERNAME_FIELD = "#username"

# Password field.
PASSWORD_FIELD = "#password"

# Submit / "Sign In" button on the Keycloak login page.
LOGIN_BUTTON = "#kc-login"

# Sign-in button text on the portal header.
LOGIN_BTN = 'button.sign-in'


# ============================================================================
# Smoke-test workspace (used by pre-existing Puppeteer suite)
# ============================================================================

SMOKE_TEST_WORKSPACE = 'a[aria-label="Smoke Test Workspace"]'


# ============================================================================
# User profile page
# ============================================================================

# Profile info sidebar on the user page.
PROFILE_INFO = "#profile-info"

# User name heading on profile.
PROFILE_NAME = ".name"

# "Edit My Profile" button. Use with XPath: //button[contains(., "Edit My Profile")]
EDIT_PROFILE_BTN = '//button[contains(., "Edit My Profile")]'

# Group chips.
GROUP_CHIP = ".first-chip"

# Tab panels on user page.
TAB_PANEL_0 = "#tabpanel-0"      # Public Workspaces
TAB_PANEL_1 = "#tabpanel-1"      # Private Workspaces
TAB_PANEL_2 = "#tabpanel-2"      # Repositories

# Tab buttons.
TAB_0 = "#tab-0"
TAB_1 = "#tab-1"
TAB_2 = "#tab-2"


# ============================================================================
# Search / filter widget
# ============================================================================

# Search text field (id reused across pages).
SEARCH_FIELD = "#standard-start-adornment"

# Filter popover.
FILTER_POPOVER = "#popover"


# ============================================================================
# Shared / generic
# ============================================================================

# MUI dialog root.
DIALOG = 'div[role="dialog"]'

# MUI dialog title.
DIALOG_TITLE = "h2.MuiDialogTitle-root"

# Cancel button (XPath for generality).
CANCEL_BTN = '//button[contains(., "Cancel")]'

# Delete confirmation button.
DELETE_CONFIRM_BTN = '//button[contains(., "DELETE")]'
