# OSBv2 Selenium Test Suite

End-to-end browser tests for the [Open Source Brain v2](https://www.v2dev.opensourcebrain.org/) web portal, built with **Python**, **Selenium 4**, **pytest**, and **Chrome**.

These tests port and expand upon the existing Puppeteer e2e suite in `applications/osb-portal/test/e2e/`. The architecture follows the Page Object Model pattern for readability and maintainability.

---

## Quick Start

```bash
# 1. Create and activate a virtual environment
uv venv .venv --python 3.12
source .venv/bin/activate

# 2. Install test dependencies
uv pip install -r tests/requirements.txt

# 3. Set credentials
cp tests/.env.example tests/.env
# Edit tests/.env with your Keycloak username and password.

# 4. Run the smoke tests (no auth needed)
pytest tests/tests/test_auth.py::TestAuth::test_home_page_loads

# 5. Run all fast tests
pytest tests/ -m smoke -n 2

# 6. Run everything (including slow application-open tests)
pytest tests/ -n 2
```

---

## Configuration

All settings come from environment variables. Create a `tests/.env` file for local development (this file is gitignored).

| Variable | Default | Description |
|---|---|---|
| `APP_URL` | `https://www.v2dev.opensourcebrain.org/` | Instance under test. Must include the trailing slash. |
| `USERNAME` | (empty) | Keycloak username for UI login. |
| `PASSWORD` | (empty) | Keycloak password for UI login. |
| `AUTH_METHOD` | `ui` | `ui` to drive the login form, `cookie` to bypass it. |
| `KC_ACCESS_TOKEN` | (empty) | Pre-obtained JWT token for `AUTH_METHOD=cookie`. |
| `PUPPETEER_DISPLAY` | (unset) | Set to any value to see the browser window (not headless). |
| `CAPTURE_SCREENSHOTS` | `0` | Set to `1` to save screenshots of failures under `tests/screenshots/`. |
| `PARALLEL_WORKERS` | `2` | Number of `pytest-xdist` parallel workers. |

---

## Directory Layout

```
tests/
├── README.md                     # This file
├── requirements.txt              # Python dependencies
├── .env.example                  # Template for credentials (copy to .env)
├── .gitignore                   # Ignores .env, caches, screenshots
├── config.py                     # Configuration loader (env vars → Python)
├── css_selectors.py              # CSS selectors (ported from Puppeteer suite + new ones)
├── conftest.py                   # Pytest fixtures: driver, base_url, authenticated_user
├── pages/                        # Page Object Model
│   ├── base_page.py              # BasePage: WebDriverWait, click, type, iframe helpers
│   ├── auth_page.py              # Keycloak login form
│   ├── home_page.py              # Workspaces listing, sidebar, create-workspace dialog
│   ├── workspace_page.py         # Workspace detail, open-with, actions menu
│   ├── workspace_open_page.py    # Workspace-open page (application iframe)
│   ├── repository_page.py        # RepositoriesPage + RepositoryPage (listing & detail)
│   └── user_page.py              # User profile, tabs, groups
├── helpers/                      # Utility modules
│   ├── auth.py                   # login(), logout(), ensure_logged_in()
│   └── wait_conditions.py        # Re-exports Selenium EC for convenience
└── tests/                        # Test cases (one file per feature area)
    ├── test_auth.py              # Home page, login, logout, round-trip
    ├── test_workspaces.py        # Create, view, delete workspaces
    ├── test_applications.py      # Open workspace with NetPyNE/NWB/JupyterLab (slow)
    ├── test_repositories.py      # Repository listing, detail, navigation
    ├── test_user_profile.py      # Profile page, tabs, edit button
    └── test_search_filter.py     # Search fields, filter popover
```

---

## Test Selection

```bash
# Run everything (2 parallel workers)
pytest tests/ -n 2

# Run a specific file
pytest tests/tests/test_auth.py

# Run a specific test class
pytest tests/tests/test_auth.py::TestAuth

# Run a specific test function
pytest tests/tests/test_auth.py::TestAuth::test_login

# Run smoke-only tests (fast, header-level checks)
pytest tests/ -m smoke

# Skip slow tests (application-open flows need minutes)
pytest tests/ -m "not slow"

# Extra verbose output
pytest tests/ -v -s

# See the browser while it runs
PUPPETEER_DISPLAY=1 pytest tests/tests/test_auth.py
```

---

## Authentication Modes

### UI Login (`AUTH_METHOD=ui`, default)

The test clicks "Sign in" on the portal header, fills the Keycloak `#username` and `#password` fields, and submits. This is the most realistic option.

```bash
USERNAME=myuser PASSWORD=mypass AUTH_METHOD=ui pytest tests/
```

### Cookie Login (`AUTH_METHOD=cookie`)

Bypasses the login form entirely. Faster for iterative development, but requires a valid JWT token. Obtain one from Keycloak or your browser's DevTools (Application → Cookies → `kc-access`).

```bash
KC_ACCESS_TOKEN=eyJhbGci... AUTH_METHOD=cookie pytest tests/
```

---

## Page Object Model

Every page in the portal has a corresponding page object class. They all inherit from `BasePage`, which provides:

| Method | What it does |
|---|---|
| `wait_for(by, value)` | Wait for element to be present in the DOM |
| `wait_for_visible(by, value)` | Wait for element to be visible |
| `wait_for_clickable(by, value)` | Wait for element to be clickable |
| `click(by, value)` | Wait for clickable, then click |
| `type_text(by, value, text)` | Wait for element, optionally clear, then type |
| `switch_to_app_frame()` | Enter the `#workspace-frame` iframe |
| `switch_to_main()` | Return from iframe to main page context |

### Example: Adding a new test

```python
import pytest
from pages.home_page import HomePage

def test_my_new_feature(self, driver, base_url, authenticated_user):
    """Descriptive docstring that explains the flow in steps."""
    # Navigate to home
    driver.get(base_url)
    home = HomePage(driver)
    home.wait_for_workspaces_list()

    # Interact with the page through the page object
    home.click_featured_tab()
    cards = home.get_workspace_cards()
    assert len(cards) >= 1, "Expected at least one workspace card"

    # Page object methods document themselves
    # Use selectors.py constants instead of hardcoded strings
    from css_selectors import WORKSPACES
    assert home.find("css selector", WORKSPACES) is not None
```

---

## Pre-existing Test Data

The test suite assumes certain data already exists on the staging instance:

- **Smoke Test Workspace**: A workspace with `aria-label="Smoke Test Workspace"` on the "Featured" tab, used by the application-open tests.
- **Test user account**: A Keycloak user with at least one workspace. The existing Puppeteer suite uses `simao-osb`.

If these don't exist, the tests may skip or fail. Ask a team member for credentials to the staging test account.

---

## Troubleshooting

### Tests fail with `TimeoutException` on element waits

- Make sure `APP_URL` is correct and the instance is reachable.
- Check that your test user has the expected workspaces/repositories.
- The staging instance may be restarting or under load — retry.
- Increase the timeout value in `config.py` if needed.

### `webdriver-manager` can't find Chrome

Install Chrome or Chromium on your system. If you're running in CI (GitHub Actions, etc.), use the `setup-chrome` action or equivalent.

### "No workspace cards found"

The home page loads differently for authenticated vs. anonymous users. Make sure the `authenticated_user` fixture runs if your test needs private workspaces.

### Application-open tests timeout (10+ minutes)

JupyterHub server spawning is slow. This is expected. Check that the user has no stale servers running by visiting the JupyterHub control panel (`/hub/home`) before running tests.

### Stale servers blocking new sessions

If the user has the maximum number of notebook servers already running, the application-open tests will fail. Visit the JupyterHub hub page and stop/delete old servers manually.

---

## Writing New Tests

1. **Add selectors** to `selectors.py` rather than hardcoding CSS strings in test files.
2. **Use page objects** — add new methods to existing page classes, or create new page classes under `pages/`.
3. **Document flows** — every test function should have a docstring listing its step-by-step flow. Comment non-obvious Selenium interactions.
4. **Mark slow tests** with `@pytest.mark.slow` so they can be filtered out for fast smoke runs.
5. **Be tolerant of missing data** — use `pytest.skip()` rather than hard-failing when optional data isn't present.
6. **Use unique names** for test-created workspaces (e.g. `selenium-test-{uuid}`) so parallel workers don't collide.
7. **Clean up** — test workspace creation tests should also delete created workspaces.
