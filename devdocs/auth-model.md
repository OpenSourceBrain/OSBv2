# Cross-service authentication and authorisation

How a request gets an identity in OSBv2, what each layer does with it, and how each
layer fails. Every claim below is tied to a file and symbol; nothing is inferred from
naming alone, and where the code and the intent differ it is called out.

## Actors

- **Browser / SPA** (osb-portal, backoffice): holds the auth cookies and calls the
  APIs through same-origin proxy paths.
- **Gatekeeper** (`/login`, `/oauth/logout`) in front of the portals: performs the
  OAuth round-trip and sets the `kc-access` cookie.
- **Keycloak** (`accounts`): issues the JWT, holds realm roles (`administrator`) and
  answers the AuthClient lookups.
- **accounts-api**: Keycloak user/group administration API.
- **workspaces API**: owns workspaces, resources, repositories and runs; enforces
  per-object authorisation itself.

## Login and token issuance

`applications/osb-portal/src/service/UserService.tsx`:

- `login()` (`:159`) clears stale auth cookies (`clearAuthCookies`, `:92`), remembers
  the current path in `sessionStorage` under `osb-login-redirect` (`LOGIN_REDIRECT_KEY`,
  `:21`) only for same-origin absolute paths (it rejects `//` and `/login`, `:171`), and
  then does `window.location.href = "/login"` (`:182`) -- i.e. it hands over to the
  gatekeeper rather than holding credentials itself.
- `popLoginRedirect()` (`:187`) consumes that stored path once the gatekeeper returns.
- `getToken()` (`:130`) reads the `kc-access` cookie and returns `null` when the token
  is malformed or expired; `isTokenExpired()` (`:102`) applies
  `TOKEN_EXPIRY_LEEWAY_SECONDS = 30` (`:18`) so a just-issued token is not judged
  expired because of clock skew, and `parseJwt()` (`:111`) decodes the payload locally.
- `initApis()` (`:32`) propagates the token: it writes an `accessToken` cookie on
  `getBaseDomain()` for the jupyterhub authenticator (or clears the auth cookies when
  there is no token), and rebuilds the generated clients with
  `new Configuration({ basePath: accountsApiUri, accessToken: token })`.
- The accounts client base path is `/proxy/accounts-api/api` (`:12`); the workspaces
  and accounts proxy targets are declared in `applications/osb-portal/vite.config.ts`
  (`server.proxy`).
- `mapKeycloakUser()` (`:51`) derives the UI's `isAdmin` from
  `userInfo.realm_access?.roles?.includes('administrator')` -- a *display* flag, not
  enforcement.
- `canEditWorkspace()` / `canEditRepository()` (`:234`, `:238`) are likewise UI-only:
  `user.isAdmin || workspace.userId === user.id`.
- `logout()` (`:216`) calls `/oauth/logout` **before** clearing cookies (the gatekeeper
  needs them), then clears them, then navigates to Keycloak's end-session URL built from
  `/keycloak.json` in `getKeycloakLogoutUrl()` (`:201`) so the SSO session actually ends.

backoffice carries the same two proxies: the recorded L3 component diagram documents
`nginxProxy` (`nginx.conf` / `entrypoint.sh`) serving `/proxy/accounts-api/api` and
`/proxy/workspaces/api` (`devdocs/system/c4-level3-backoffice-components.md`, as
summarised in `devdocs/session-log.md`).

## How the workspaces API reads a bearer

`applications/workspaces/server/workspaces/utils.py`, `get_keycloak_data()` (`:11`):

- It reads `request.headers.get("Authorization", None)` (`:12`).
- **Anonymous fallback**: when the header is missing *or* literally
  `"Bearer undefined"` (`:14`) it sets `decoded_token = None` and
  `keycloak_id = -1` (`:16`, comment: "No authorization --> no user --> only publicable
  workspaces"). It does **not** raise and does not return 401.
- Otherwise it splits the header and runs `AuthClient.decode_token(token)` (`:18-19`),
  taking `decoded_token["sub"]` as the keycloak id (`:20`).

A second helper, `keycloak_user_id()` (`applications/workspaces/server/workspaces/service/auth.py:27`),
takes the token from the CloudHarness middleware (`get_authentication_token()`) and
returns its `sub`, or `None` when there is no token or decoding throws -- it logs
`"Failed to decode authentication token"` and swallows the error (`:33-36`). Note that
this is `None`, whereas `get_keycloak_data()` uses `-1` for the same condition: two
sentinel values for "anonymous" in the same server.

`get_auth_client()` (`auth.py:16`) caches one `AuthClient` in `_auth_client` and, if
constructing it throws, raises `Exception("Keycloak not available")` (`:23`).

## The authorisation checks

### Workspaces API

`applications/workspaces/server/workspaces/service/crud_service.py`:

- `WorkspaceService.is_authorized()` (`:329`):
  `workspace.publicable or (workspace.user_id and workspace.user_id == current_user_id) or (get_auth_client().user_has_realm_role(user_id=current_user_id, role="administrator"))`.
  That last term is a **second Keycloak round-trip** for every non-public,
  non-owned workspace -- the check is not decidable from the token alone.
- `WorkspaceService.get()` (`:389`) calls `is_authorized` again after `super().get()`
  and raises `NotAuthorized` (`:392`), and `BaseModelService.get()` (`:138`) already
  checks it once (`:141`).
- `WorkspaceService.search()` (`:335`) filters by identity: for a logged-in user who is
  not an administrator the search is constrained to `user_id=current_user_id` (`:355-357`);
  an administrator searches with `show_all=True` (`:358-360`); an anonymous caller
  (`current_user_id is None`) searches **unfiltered** (`:361-363`), leaving the
  per-object `is_authorized` checks to hide what they may not see.
- `VolumestorageService.is_authorized()` (`:516`) is administrator-only
  (`user_has_realm_role(..., role="administrator")`), no owner path.
- `OsbrepositoryService.is_authorized()` (`:500`) returns `True` ("All osbrepositories
  are public") and `TagService.is_authorized()` (`:612`) returns `True` likewise.
- `WorkspaceresourceService.is_authorized()` (`:590`) delegates: a resource is allowed
  if its workspace is allowed, by calling `self.workspace_service.get(resource.workspace_id)`
  and turning `NotAuthorized` into `False` (`:592-596`).

Controller-level gates: `admin_controller.py:10-13` returns `"User not authorized", 401`
when the caller is not an `administrator`; `workspace_controller.py:127-131` returns
`"Access to the requested resources not authorized", 401`; `workspace_run_controller.py:78-83`
(`_owned_workspace`) rejects a missing `keycloak_user_id()` with 401 and documents that
it deliberately does not reuse `WorkspaceService.is_authorized`, which would also let a
reader of a public workspace start a run.

**Role-name inconsistency worth knowing**: `check_max_num_workspaces_per_user()`
(`crud_service.py:186-199`) tests `role="admin"` (`:191`) while every other check in the
server tests `role="administrator"`. A user holding only `administrator` therefore still
has their workspace quota enforced.

### accounts-api

accounts-api is configured with `harness.secured: false` and its routes are role-mapped
for `administrator` on `/*` with `/api/openapi.json` white-listed
(`applications/accounts-api/deploy/values.yaml`, and the generated app block in
`applications/workspaces/server/test/values.yaml`: `uri_role_mapping` with
`roles: [administrator]`, `uri: /*`, plus the openapi exception). Hard dependency is the
`accounts` Keycloak app (`applications/accounts-api/deploy/values.yaml`,
`harness.dependencies.hard`).

## Who may do what

| Caller | Reads | Writes | Admin-only |
| --- | --- | --- | --- |
| Anonymous (no bearer, or `Bearer undefined`) | public (`publicable`) workspaces, all OSB repositories, all tags; search is unfiltered but each object is authorised | no -- creation stamps `user_id` from `keycloak_user_id()`, which is `None` | 401 |
| Registered user | own workspaces + public ones; resources of an authorised workspace | own workspaces, clones; repositories and tags | 401 |
| `administrator` | all workspaces (`show_all=True` search), volume storage, resource counts | as above, for any workspace | allowed |

Sources for the table: the `is_authorized` / `search` implementations above,
`crud_service.py:211-215` (`post` defaults `user_id` from `keycloak_user_id()`),
`admin_controller.py:10-13`, `crud_service.py:516-518` (volume storage).

## Per-layer failure modes

- **Missing or literal `undefined` bearer**: not an error. `get_keycloak_data()`
  degrades to `keycloak_id = -1` / `decoded_token = None`, so the request proceeds as an
  anonymous reader of public workspaces (`workspaces/utils.py:14-16`). A frontend that
  wrote the string `null` into the token cookie produced exactly this shape; the portal
  now refuses to do so (`UserService.tsx:32-49`, comment "Never write the literal string
  \"null\"").
- **Malformed/expired token in the browser**: `getToken()` clears the auth cookies and
  returns `null` (`UserService.tsx:139-150`), which is the anonymous path above.
- **Undecodable token in the server**: `keycloak_user_id()` logs and returns `None`
  (`auth.py:33-36`); callers then see "no user" rather than a 401.
- **Keycloak unreachable**: `get_auth_client()` raises `Exception("Keycloak not
  available")` (`auth.py:22-23`). This is a bare exception, so it surfaces as a 500 from
  the workspaces server -- only the DANDI upload paths map Keycloak trouble to 503
  (`DandiKeyUnavailable`, `workspaces/service/dandi_credentials.py:16-31`,
  `workspaces/controllers/dandi_controller.py:75-81`). Do not assume a 503 means auth
  trouble: the other 503 in the server is volume readiness
  (`workspace_controller.py:121`, `:135-139`), and `503` is also what a missing DANDI key
  returns.
- **Not authorised (identity known, permission missing)**: `NotAuthorized` from the
  service layer (`crud_service.py:48-49`) becomes 401 at the controller
  (`workspace_controller.py:131`), and the admin endpoints check the role themselves and
  return 401 (`admin_controller.py:11-13`, `workspace_run_controller.py:82-83`).
- **Role check failing because Keycloak is slow/down**: the `user_has_realm_role` term in
  `is_authorized` and the whole of `VolumestorageService.is_authorized` depend on that
  call; an outage there fails the request even for a user whose token is valid.
- **Frontend display vs enforcement**: `isAdmin` from the token
  (`UserService.tsx:57`) and `canEditWorkspace`/`canEditRepository` (`:234`, `:238`) only
  hide or show controls; the server-side checks above are what decide.
