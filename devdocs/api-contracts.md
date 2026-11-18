# API contracts and service catalogue

Which OpenAPI document is the source of truth for each OSBv2 service, which copies are
generated from it, who consumes them, and the command that regenerates each client.
Everything here was found by `find applications -name 'openapi.y*ml'`, the two frontend
READMEs and the pinned generator configs; no spec is listed that was not found.

## The catalogue

| Service | Authoritative spec | Generated copy in the repo | Consumer(s) | Client regeneration (run from the frontend directory) |
| --- | --- | --- | --- | --- |
| workspaces API (`wsapi`) | `applications/workspaces/api/openapi.yaml` | `applications/workspaces/server/workspaces/openapi/openapi.yaml` | `applications/osb-portal/src/apiclient/workspaces`, `applications/backoffice/src/apiclient/workspaces` | `openapi-generator-cli generate -i ../workspaces/api/openapi.yaml -g typescript-fetch -o src/apiclient/workspaces` |
| accounts-api (`accountsapi`) | `applications/accounts-api/api/openapi.yaml` | `applications/accounts-api/backend/accounts_api/openapi/openapi.yaml` | `applications/osb-portal/src/apiclient/accounts`, `applications/backoffice/src/apiclient/accounts` | `openapi-generator-cli generate -i ../accounts-api/api/openapi.yaml -g typescript-fetch -o src/apiclient/accounts` |

Those are the only four OpenAPI files in the repository and the only two contracts. Neither
`applications/notifications`, `applications/common`, `applications/nwb-explorer` nor the
frontends themselves carry a spec of their own.

### Which copy is authoritative

- **The `api/` file is hand-maintained and is the contract.** It is the input to every
generator invocation above.
- **The in-server copy is generated.** `applications/workspaces/server/workspaces/openapi/openapi.yaml`
  and `applications/accounts-api/backend/accounts_api/openapi/openapi.yaml` are emitted from
  the `api/` document by the server-side generator step. The corresponding generated Python
  models are recognisable by their generator formatting (e.g. the `widget`/`rtype` docstrings
  and `# noqa: E501` line in `applications/workspaces/server/workspaces/models/*.py`), which is
  why the schema in those files must not be edited directly — change `api/openapi.yaml` and
  regenerate. `devdocs/data-model.md` relies on this: the ORM entities are OpenAlchemy output
  derived from the workspaces spec.
- **The TypeScript clients are generated too**, one directory per service under
  `src/apiclient/` in each frontend, and are committed. They are private to the frontend that
  owns them.

## Pinned generator versions

`openapitools.json` pins the generator CLI per project, and the pins are **not uniform**:

| File | `generator-cli.version` |
| --- | --- |
| `openapitools.json` (repository root) | `5.2.1` |
| `applications/osb-portal/openapitools.json` | `5.1.0` |
| `applications/backoffice/openapitools.json` | `5.1.0` |
| `applications/workspaces/openapitools.json` | `5.1.0` |

The `generate` commands above are run *inside* `applications/osb-portal` or
`applications/backoffice`, so the `5.1.0` pin of that directory is the one that applies to
the committed TypeScript clients. Regenerating from the repository root would use `5.2.1`
and can produce a different diff.

## How a client is regenerated

Documented identically in `applications/osb-portal/README.md` and
`applications/backoffice/README.md` (section "Rest client generate"):

```bash
npm install @openapitools/openapi-generator-cli -g
openapi-generator-cli generate -i ../workspaces/api/openapi.yaml -g typescript-fetch -o src/apiclient/workspaces
openapi-generator-cli generate -i ../accounts-api/api/openapi.yaml -g typescript-fetch -o src/apiclient/accounts
```

Then a **manual post-generation fix is required**, quoted from the same READMEs: in the
`runtime.ts` that was generated, replace

```typescript
export type FetchAPI = GlobalFetch['fetch'];
```

with

```typescript
export type FetchAPI = WindowOrWorkerGlobalScope['fetch'];
```

Skipping that edit is what breaks the generated client in the browser build, so it is part
of regeneration, not an optional cleanup.

There is **no npm script** wrapping this: searching `applications/osb-portal/package.json`
and `applications/backoffice/package.json` for `openapi` returns no match, so generation is
run by hand exactly as the READMEs show.

## How the generated clients are wired in

- Base paths, not hard-coded hosts: the portal's accounts client is constructed with
  `new Configuration({ basePath: accountsApiUri, accessToken: token })` where
  `accountsApiUri = "/proxy/accounts-api/api"`
  (`applications/osb-portal/src/service/UserService.tsx:12`, `:24-26`, `:45-47`). The
  workspaces client is wired the same way in `initApis` (`:42-44`).
- Same-origin proxies stand in front of each API. In development
  `applications/osb-portal/vite.config.ts` (`server.proxy`, `:28-41`) maps
  `/proxy/workspaces` → the workspaces service and `/proxy/accounts-api` → the accounts API,
  rewriting the prefix away (`rewrite` for each). In a deployment the same two paths are
  served by the frontend's proxy container; for backoffice that is `nginxProxy`
  (`nginx.conf` / `entrypoint.sh`) serving `/proxy/accounts-api/api` and
  `/proxy/workspaces/api` — recorded in
  `devdocs/system/c4-level3-backoffice-components.md`. The contract is therefore always
  "same-origin path prefix", never an absolute service URL.
- Authentication is a bearer token on those clients, described end to end in
  `devdocs/auth-model.md` and `devdocs/flows/sequence-authenticated-request.md`.

## Access rules attached to the contracts

Both specs are served behind CloudHarness' role mapping, not only by their handlers:
`applications/accounts-api/deploy/values.yaml` declares `harness.secured: false`, service
port `8080`, liveness `/api/live`, readiness `/api/ready` and the hard dependency `accounts`;
in the generated app block (`applications/workspaces/server/test/values.yaml`) the
`uri_role_mapping` is `roles: [administrator]` on `/*` with `/api/openapi.json` white-listed.
The workspaces API's finer-grained rules (owner, `publicable`, administrator) are in the
handlers — see `devdocs/auth-model.md`.

## Related architecture documents

- `devdocs/system/c4-level3-osb-workspaces-components.md` — components of the service that
  owns the workspaces spec.
- `devdocs/system/c4-level3-accounts-api-components.md` — components of the service that owns
  the accounts spec.
- `devdocs/system/c4-level3-osb-portal-components.md` — the portal's components, including
  its two `src/apiclient/` trees.
- `devdocs/system/c4-level3-backoffice-components.md` — backoffice, whose `apiClients`
  component is the generated client pair plus the nginx proxy in front of them.
- `devdocs/data-model.md` — what the workspaces spec's schema becomes in the database.
