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
