# AGENTS.md — AI Agent Instructions for OSBv2 Selenium Test Suite

## Overview

This directory contains end-to-end browser tests for the OSBv2 portal
(`https://v2dev.opensourcebrain.org/`). Stack: **Python + Selenium 4 +
pytest + Firefox/Chrome (headless by default)**. Architecture: **Page
Object Model**.

Tests target the **staging instance** (v2dev). Keycloak credentials
required for login-dependent tests.

**Key env vars** (set in `tests/.env`):
- `OSB_USERNAME` / `OSB_PASSWORD` — Keycloak credentials (NOT `USERNAME`/`PASSWORD` — those clash with Linux system env vars)
- `APP_URL` — `https://v2dev.opensourcebrain.org/`
- `AUTH_METHOD` — `ui` (default) or `cookie`
- `BROWSER` — `chrome` (default, falls back to `firefox` if Chrome not found)

## Running Tests

```bash
# First time
cp tests/.env.example tests/.env   # then edit with your credentials

# Install deps
uv pip install -r tests/requirements.txt

# Collect / list all tests
pytest tests/ --collect-only

# Run fast smoke tests
pytest tests/ -m smoke -n 2

# Run everything except slow app-open tests
pytest tests/ -m "not slow" -n 2

# Single file
pytest tests/tests/test_auth.py -v

# Single test
pytest tests/tests/test_auth.py::TestAuth::test_login -v

# Show browser window
PUPPETEER_DISPLAY=1 pytest tests/tests/test_auth.py

# Run with Firefox explicitly
BROWSER=firefox pytest tests/
```

## File Map

| File | Role |
|---|---|
| `config.py` | Env-var config. Uses `Path(__file__)` to find `.env`. **Uses `OSB_USERNAME`/`OSB_PASSWORD` — not `USERNAME`/`PASSWORD`.** |
| `css_selectors.py` | CSS / XPath selectors. **Renamed from `selectors.py` to avoid shadowing Python stdlib `selectors`.** |
| `conftest.py` | Fixtures: `driver` (Chrome or Firefox), `base_url`, `authenticated_user`. Firefox fallback if Chrome missing. |
| `helpers/auth.py` | `login()`, `logout()`, `ensure_logged_in()`. `AUTH_METHOD=ui` drives Keycloak form via JS; `AUTH_METHOD=cookie` sets `kc-access` JWT cookie. |
| `helpers/wait_conditions.py` | Custom expected conditions placeholder. |
| **Page Objects** | |
| `pages/base_page.py` | `BasePage` — `wait_for`, `click` (with JS fallback for obscured elements), `type_text`, `switch_to_app_frame`, `switch_to_main`. |
| `pages/home_page.py` | Workspaces listing, tabs, sidebar nav (About/Workspaces/Repositories), create-new menu, templates, search/filter, about dialog open/close. |
| `pages/workspace_page.py` | Workspace detail, open-with split button, actions menu (delete/clone/edit/make-public/make-private), clone snackbar handling, workspace editor form (name, visibility select, save). |
| `pages/workspace_open_page.py` | `/workspaces/open/:id/:app` — application iframe view. |
| `pages/repository_page.py` | `RepositoriesPage` (listing, tabs, grid/list toggle, add-repository dialog, search/filter) + `RepositoryPage` (detail, file tree, select-all, individual file click, workspace creation dialogs). |
| `pages/user_page.py` | User profile, tabs, groups, edit profile dialog (picture URL, save, cancel). |
| `pages/auth_page.py` | Keycloak login form page object. |
| **Test Files** | |
| `tests/test_auth.py` | Home page load, login, logout, round-trip, **protected route redirect**. |
| `tests/test_about_dialog.py` | About dialog open and close. |
| `tests/test_workspaces.py` | View public, create, view detail, delete, **clone, edit, make public, make private**. |
| `tests/test_applications.py` | Open with NetPyNE / NWB Explorer / JupyterLab (iframe, **`@slow`**). |
| `tests/test_repositories.py` | Listing, detail, **add repository, grid/list toggle, file tree browsing, create workspace from repo (with/without selection)**. |
| `tests/test_user_profile.py` | Profile load, tabs, edit button, **edit profile dialog**. |
| `tests/test_search_filter.py` | Search fields, filter popover. |

## Conventions

### When adding a new test

1. **Add selectors to `css_selectors.py`** — never inline them. Prefer `id` attrs over MUI classes. Use XPath (`//button[contains(., "text")]`) for text-based matching — `:has-text()` pseudo-selectors are NOT valid CSS and fail in Selenium.
2. **Use page objects** — add methods to the relevant page class.
3. **Document flows** — every test function must have a docstring with numbered steps.
4. **Mark slow tests** `@pytest.mark.slow` (JupyterHub server spawn, >1 min).
5. **Mark smoke tests** `@pytest.mark.smoke` (fast, always-pass).
6. **Use `pytest.skip()`** for optional/missing data, not hard failures.
7. **Use unique names** — prefix with `selenium-test-{uuid_suffix}` for parallel safety.
8. **Clean up** — creation tests should delete what they create.
9. **Use the click() with JS fallback** — `base_page.py`'s `click()` catches `ElementClickInterceptedException` and falls back to `execute_script("arguments[0].click()")`.

### Auth

- **`OSB_USERNAME` / `OSB_PASSWORD`** — not `USERNAME`/`PASSWORD` (which is a standard Linux env var).
- `authenticated_user` fixture (session-scoped, once per worker). Calls `ensure_logged_in()`.
- `AUTH_METHOD=ui`: drives real Keycloak form via `execute_script()` to set field values + dispatch `input` events.
- `AUTH_METHOD=cookie`: sets `kc-access` JWT cookie directly.
- **Error detection**: The auth helper checks for "Invalid username or password" and other Keycloak error messages and raises a clear `RuntimeError`.
- The `.env` path is resolved explicitly via `Path(__file__).resolve().parent / ".env"`.

### Iframes

- `<iframe id="workspace-frame">` holds the Jupyter application.
- Use `page.switch_to_app_frame()` / `page.switch_to_main()`.

### Timeouts (config.py)

| Setting | Default | Meaning |
|---|---|---|
| `IMPLICIT_WAIT` | 15s | Element wait fallback |
| `PAGE_LOAD_TIMEOUT` | 120s | Full page navigation |
| `WORKSPACE_LOAD_TIMEOUT` | 600s | Application iframe readiness |
| Auth helper waits | 120s (Keycloak), 60s (post-login redirect) | Hardcoded for slow clusters |

### Parallel execution

- `pytest-xdist` with `-n 2`. Session-scoped `driver` per worker.
- Workspace names use `uuid.uuid4().hex[:8]` suffix.

## Known Issues / Gotchas

- **`css_selectors.py` naming**: Don't rename to `selectors.py` — shadows Python stdlib `selectors`.
- **`:has-text()` is NOT valid CSS**: Selenium WebDriver doesn't support jQuery pseudo-selectors. Use XPath `//button[contains(., "text")]` instead.
- **Element click intercepted**: MUI overlays obscure buttons. Fixed in `base_page.py` with JS fallback.
- **Stale JupyterHub servers**: Clean up at `/hub/home` before running `@slow` app tests.
- **Firefox fallback**: `conftest.py` auto-detects missing Chrome and switches to Firefox.
- **Slow cluster**: All timeouts are set generously (120s+). If running on a faster instance, reduce `PAGE_LOAD_TIMEOUT`.
- **Staging API (503)**: The workspace/repository/user APIs on staging may return 503 when under load. Tests that need API data gracefully `pytest.skip()`.
- **Selenium 4 API only**: `find_element("css selector", ...)`, not the legacy `find_element_by_css_selector(...)`.
