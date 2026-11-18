# AGENTS.md

OSBv2 is the updated Open Source Brain platform, a multi-component monorepo deployed on Kubernetes
via [CloudHarness](https://github.com/MetaCell/cloud-harness) and Helm. Independent web apps live
under `applications/*`, Python libraries/scripts under `libraries/`, and deployment configuration
under `deployment/` and `deployment-configuration/`.

## Project layout

| Path | Purpose |
| --- | --- |
| `applications/osb-portal` | Main frontend: Vite + React 18 + TypeScript 5, `"type": "module"` (ESM only). |
| `applications/backoffice` | Admin frontend: webpack 5 + TypeScript 4 + TSLint. |
| `applications/workspaces` | Workspaces service; `server/` is a Python package (Makefile + tox + requirements.txt), API described by `applications/workspaces/api/openapi.yaml`. |
| `applications/accounts-api` | Accounts/Keycloak API backend. |
| `applications/jupyterhub`, `applications/jupyterlab`, `applications/netpyne`, `applications/nwb-explorer` | Notebook/lab tooling images, each with its own `deploy/values*.yaml` and `build_local.sh`. |
| `applications/argo`, `applications/notifications`, `applications/nfsserver`, `applications/common` | Supporting infrastructure apps. |
| `libraries/client` | Cache-refresh scripts for OSBv1/OSBv2/ModelDB/BioModels/DANDI. |
| `deployment/` | Helm chart (`deployment/helm`) and Codefresh pipelines. |
| `local-scripts/` | Local helper script `osbv2-local.sh`. |

## Commands

### `applications/osb-portal` (Vite + ESLint + Prettier)

```bash
npm run lint        # eslint . --color --fix
npm run build       # prebuild: eslint src --color, then vite build
npm run build-dev   # vite build --mode development
npm run format      # prettier --write src/**/*.ts{,x}
npm start           # local dev server (see package.json for env vars)
```

`npm test` is a placeholder that fails (`exit 1`) — use lint/build instead.

### `applications/backoffice` (webpack + TSLint)

```bash
npm run build       # prebuild: tslint -c tslint.json 'src/**/*.{ts,tsx}', then webpack prod
npm run build-dev   # webpack --mode=development
npm start:local     # dev server against local accounts/workspaces
```

Linting only happens via the `tslint` prebuild hooks; `npm test` is the same failing placeholder.

### `applications/workspaces/server` (Python)

```bash
make deps    # create venv and pip install -r requirements.txt
make run     # python -m wsmgr
make test    # tox -e py3 (or py37 if python3.7 present)
make lint    # tox -e lint and tox -e isort-check
make isort   # tox -e isort-fix
```

### Deployment (run at repo root)

```bash
harness-deployment cloud-harness .                          # generate helm chart
minikube start --memory="6000mb" --cpus=4 --disk-size=60000mb
skaffold dev                                                # build + run images on minikube
helm install osb2 deployment/helm --namespace osb2           # install on a cluster
helm upgrade osb2 deployment/helm --namespace osb2 --install --reset-values
```

Local full deployment needs CloudHarness, skaffold, helm and at least 6GB RAM / 4 CPUs.

### `libraries/client` (cache scripts)

```bash
./info_all.sh -q   # quick check of OSBv1, OSBv2, OSBv2dev, OSB repos + DANDI
./info_all.sh      # also BioModels and ModelDB
python osb_info.py -v2dev   # regenerate cached OSBv2 repo list
```

These scripts need a GitHub token saved in `github.auth`. Outputs go to `cached_info/*.json`.

## Conventions

- Two deliberately different frontend toolchains: osb-portal uses Vite + ESLint + Prettier,
  backoffice uses webpack + TSLint. Use the tooling of the app you are editing; do not port
  lint/format config between them.
- Frontends are TypeScript + React (MUI, Redux Toolkit); osb-portal is ESM only.
- Python components are packaging-based (`setup.py`, `requirements.txt`, tox driven through the
  Makefile) — run tooling through the Makefile targets.
- Per-app CloudHarness deploy config lives in `applications/<app>/deploy/values*.yaml`; the
  environment is chosen with `-e` and loads `values-[ENV].yaml` overrides.

## Documentation

`devdocs/` is the canonical developer documentation for this repository. It is not
commentary that trails the code: **each document below must be updated in the same change
as the code it describes**, and must never be left stale. If a change alters a contract,
a stored value, a security boundary, a deployment field, an API, a storage choice, a flow
or the commands a developer runs, the relevant `devdocs/` file changes in the same commit.

Guides:

| Topic | Document |
| --- | --- |
| Running a service on its own, or the full stack in minikube | `devdocs/local-development.md` |
| Values layering, key fields, the `CH_*` convention, secrets, `values*.yaml` inventory, pipelines | `devdocs/deployment-configuration.md` |
| Login, bearer handling, per-layer checks and failure modes | `devdocs/auth-model.md` |
| Postgres metadata schema, per-workspace PVC, Argo-held state | `devdocs/data-model.md` |
| Authoritative OpenAPI specs, generated copies, client regeneration | `devdocs/api-contracts.md` |

Runtime flows (`devdocs/flows/`): `README.md` (index and rendering notes),
`sequence-authenticated-request.md`, `sequence-workspace-import.md`,
`sequence-notebook-run.md`.

Architecture (C4, `devdocs/system/`): `README.md` (C4 index and rendering notes),
`c4-level1-osb-context.md`, `c4-level2-osb-containers.md`, and the Level 3 component
diagrams `c4-level3-osb-workspaces-components.md`,
`c4-level3-osb-portal-components.md`, `c4-level3-nwb-explorer-components.md`,
`c4-level3-accounts-api-components.md`, `c4-level3-backoffice-components.md`. The
`system/svgs/` files are legacy, unmaintained exports and are not edited.

Decision records (`devdocs/adr/`): `README.md` holds the process, naming and MADR-lite
template, and `NNNN-kebab-case-title.md` holds one decision each. The log is
**forward-only**: a record is written with the change that makes the decision, or once
when an area is first documented (opening with "Recorded retrospectively from the code;
no contemporaneous discussion exists."). A replaced decision gets a **new** ADR and the
old one's `Status` becomes `superseded by NNNN`; existing records are never rewritten.

Topic notes: `devdocs/user-quotas.md`, `devdocs/osb-applications-protocol.md`;
`devdocs/session-log.md` holds dated work notes.

Diagrams are authored inline as fenced `mermaid` blocks in their `.md` sources, and
**rendered SVGs are never committed**. Check a diagram by rendering it, from the
repository root:

```bash
python devdocs/scripts/render_mermaid.py --output-dir /tmp/c4-diagrams --work-dir /tmp/c4-diagrams/src --format svg
```

The render is successful when the CLI exits 0; Mermaid parse errors surface there.

Any new document under `devdocs/` must be added to the index in `devdocs/README.md` and
noted in `devdocs/session-log.md` in the same change, so the index never falls behind the
tree.

## Gotchas

- CI does not run tests or lint. `.github/workflows` only contains `minikube-test.yml`,
  `docker-netpyne.yml`, `docker-nwbe.yml` and `docker-jupyterlab.yml`, which run
  `./local-scripts/osbv2-local.sh`, `./build_local.sh` and `pip_info.sh`; the minikube deploy step
  is commented out with "Skipping for now...".
- `npm test` in both frontends is a failing placeholder — do not rely on it.
- `libraries/client` is not an OpenAPI client: it holds cache-refresh scripts writing
  `cached_info/*.json`.
- The README mentions `npm start:minikube`, but that script exists only in
  `applications/backoffice/package.json`, not in osb-portal.
- Root `openapitools.json` only pins `openapi-generator-cli` 5.2.1; per-app `openapitools.json`
  files exist under `applications/{osb-portal,backoffice,workspaces}`.
- A large (~134MB) `tags` file sits at the repo root — do not read or modify it.
