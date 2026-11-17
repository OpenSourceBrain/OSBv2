# Local development

How to run OSBv2 locally: one service on its own, or the whole stack in minikube.
Every command below is quoted from a file in this repository and the file is cited
inline; where a documented command could not be verified it is called out instead
of being invented.

## Prerequisites

- Node 13, installed under `/usr/local/bin`, plus `nvm` symlinks:

  ```bash
  nvm install 13
  nvm use 13
  sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/node" "/usr/local/bin/node"
  sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/npm" "/usr/local/bin/npm"
  ```

  Source: `applications/osb-portal/README.md` ("Make sure the correct node version
  (for now 13) is installed in /usr/local/bin"). The same block appears in
  `applications/backoffice/README.md`.
- CloudHarness: both frontend READMEs state "Cloudharness must be installed"
  (`applications/osb-portal/README.md`, `applications/backoffice/README.md`).
- For the full stack: docker, minikube, helm, skaffold and a `cloud-harness`
  checkout next to this repository -- `local-scripts/osbv2-local.sh` clones
  `https://github.com/MetaCell/cloud-harness.git` into `../cloud-harness`
  (`CLOUD_HARNESS_URL`, `CLOUD_HARNESS_DIR_LOCATION`, `CLOUD_HARNESS_DEFAULT="develop"`),
  and pins `SKAFFOLD_MAX_VERSION="2.14.2"`, `PY_VERSION="python3.12"` and the
  namespace `OSB_NAMESPACE="osblocal"`.
- For the workspaces server: a Python 3 interpreter. `applications/workspaces/server/Makefile`
  uses `python3.7` when it is on the PATH and `python3` otherwise (`PYTHON_VERSION`).

## Running a single service alone

### osb-portal

From `applications/osb-portal`:

```bash
sudo npm run start:dev                      # no backend
npm run start:test                          # use the test deployment applications (v2.opensourcebrain.org)
npm run start:minikube                      # use the local minikube deployment applications (osb.local)
USE_MOCKS=true npm run start:dev            # workspace mock responses
```

Source: `applications/osb-portal/README.md`, "Development". The README adds that
"the webpack-dev-server will reroute the proxy /proxy/workspaces to the given
backend instead of the workspace manager app", and that the local dev server reads
`src/assets/keycloak_dev.json` for the Keycloak connection -- check its domain
against your setup.

Note the port: the README describes the *webpack* dev server on https port 443
("Because port 443 lays in the 'protected' area ... it is needed to run it as a
SuperUser"). The portal as currently tracked is served by **Vite**, whose dev server
is `host: '0.0.0.0'`, `port: 3000`, with `/proxy/workspaces` and
`/proxy/accounts-api` proxies -- `applications/osb-portal/vite.config.ts`
(`server.port`, `server.proxy`). Read that file, not the README, for where the dev
server listens and which backend each proxy path reaches.

### backoffice

From `applications/backoffice`, the commands documented in
`applications/backoffice/README.md` ("Development") are:

```bash
sudo npm run start:dev                      # no backend
npm run start:test                          # use the test deployment applications
npm run start:minikube                      # use the local minikube deployment applications
USE_MOCKS=true npm run start:dev            # workspace mock responses
```

No `start:local` script is documented in any source consulted for this guide, so
none is given here; use the three environment variants above, as the backoffice
README lists them.

### workspaces server

From `applications/workspaces/server`, the Makefile targets
(`applications/workspaces/server/Makefile`) are:

```bash
make deps     # create venv and pip install -r requirements.txt --no-cache-dir
make run      # $(VENV)/bin/python -m wsmgr
make test     # $(VENV)/bin/tox -e py3 (or py37 when python3.7 is installed)
make lint     # tox -e lint && tox -e isort-check
make isort    # tox -e isort-fix
make clean    # pyclean + docsclean + rm -rf venv
```

`make deps` builds the virtualenv at `venv/` from `DEPS:=requirements.txt`; every
other target depends on it. The server itself is started as `python -m wsmgr`
(the `run` target), and the deployment declares build and hard dependency lists in
`applications/workspaces/deploy/values.yaml` -- which is why the full-stack path
below, rather than a bare `make run`, is the supported way to have the services it
talks to running locally.

### accounts-api

No build, lint or test command for `applications/accounts-api` is recorded in the
sources consulted for this guide (its `deploy/values.yaml` configures the container:
`subdomain: api.accounts`, `service.port: 8080`, `deployment.port: 8080`,
liveness `/api/live`, readiness `/api/ready`; hard dependency `accounts`). Treat it
as part of the full stack below rather than as a standalone local build.

## The full local stack

`local-scripts/osbv2-local.sh` is the driver. Its header says "To be executed from
the root folder of the OSBv2 repository", so:

```bash
./local-scripts/osbv2-local.sh
```

The `deploy_live` function of that script is what the local deployment does, and it
refuses to continue when `helm` or `harness-deployment` is missing (it prints the
helm install page and says cloud-harness installation is covered by its `-u`/`-U`
options). The steps it runs, all from `local-scripts/osbv2-local.sh`:

1. `start_minikube`: start docker if needed on Linux, then
   `minikube start --memory="$MEMORY" --cpus="$CPUS" --disk-size="60000mb" --kubernetes-version=v1.32 --driver=docker`
   (8 CPUs / 10000mb by default, 4 CPUs when `CI=true`; an already-running minikube
   is left alone).
2. `minikube addons enable ingress` and `minikube addons enable metrics-server`.
3. `kubectl create ns osblocal` and `kubectl config set-context NAME --namespace=osblocal`.
4. `eval $(minikube docker-env)`.
5. `harness_deployment`, then `helm install -n osblocal osb deployment/helm`.

Its `show_deployment_status` function prints `minikube status`,
`kubectl -n osblocal get pods`, `kubectl -n osblocal top node` and
`kubectl -n osblocal top pods` -- that is how the script suggests you check what came up.

Related files:

- `port-forward.sh` -- forwards the in-cluster services to localhost; the namespace is
  its first argument (`./port-forward.sh osblocal`). It forwards
  `deployment/workspaces-postgres-host 5432:5432`, `deployment/accounts 8080:8080`,
  `statefulset/kafka 9092:9092` and `deployment/argo-$1-server 2746:2746`.
- `deployment/codefresh-local-test-minimal.yaml` -- the "local test minimal" pipeline
  definition, alongside `deployment/codefresh-dev-quick.yaml`,
  `deployment/codefresh-dev.yaml`, `deployment/codefresh-test.yaml` and
  `deployment/codefresh-prod.yaml`.
- `deployment-configuration/helm/Chart.yaml` -- the helm chart tracked in the repository
  (see the pitfall about the script's `deployment/helm` path below), with
  `deployment-configuration/values-template.yaml` / `values-template-dev.yaml` and
  `deployment-configuration/skaffold-template.yaml` beside it.

## Lint, build and test per app

- **osb-portal** and **backoffice** (TypeScript/React frontends): the scripts in
  `applications/osb-portal/package.json` and `applications/backoffice/package.json`
  are the source of truth -- the `start:*` variants quoted above come from their
  READMEs, and the generated clients are produced by `openapi-generator-cli` (below).
- **`npm test` is a failing placeholder in both frontends**: the `test` script in
  `applications/osb-portal/package.json` and `applications/backoffice/package.json`
  is a placeholder, not a working suite, so a red `npm test` is expected and is not
  a regression signal. Do not wire it into a check.
- **workspaces server**: `make test`, `make lint`, `make isort` -- i.e. tox
  environments `py3`/`py37`, `lint`, `isort-check`, `isort-fix`
  (`applications/workspaces/server/Makefile`).
- **accounts-api**: no command recorded; see above.

## Regenerating the API clients

Both frontends consume generated TypeScript clients. From the frontend directory,
as documented in `applications/osb-portal/README.md` (and identically in
`applications/backoffice/README.md`):

```bash
npm install @openapitools/openapi-generator-cli -g
openapi-generator-cli generate -i ../workspaces/api/openapi.yaml -g typescript-fetch -o src/apiclient/workspaces
openapi-generator-cli generate -i ../accounts-api/api/openapi.yaml -g typescript-fetch -o src/apiclient/accounts
```

After generation the README asks you to fix `runtime.ts`: replace
`export type FetchAPI = GlobalFetch['fetch'];` with
`export type FetchAPI = WindowOrWorkerGlobalScope['fetch'];`.

## Known pitfalls

- **Dev-server port mismatch.** `applications/osb-portal/README.md` documents the
  webpack dev server on https 443 (hence `sudo`); the tracked Vite config
  (`applications/osb-portal/vite.config.ts`) serves on port 3000 and binds
  `0.0.0.0`. The `sudo` in the README is only needed for the protected-port webpack flow.
- **`deployment/helm` does not exist.** `local-scripts/osbv2-local.sh` deploys with
  `helm install -n osblocal osb deployment/helm`, but that directory is absent from the
  repository; the chart that is tracked is `deployment-configuration/helm/Chart.yaml`.
  Check the path before trusting the script's helm step.
- **`port-forward.sh` kills existing forwards.** Its first line is `pkill -9 kubectl`,
  so running it tears down every `kubectl port-forward` you have open, not just its own.
- **Self-signed certificates on minikube.** Import the generated cacert (typically
  `./deployment/helm/resources/certs/cacert.crt`) into your browser's Authorities store,
  per `applications/osb-portal/README.md` ("Self Signed Certificates"). That path sits
  next to the `deployment/helm` path noted above.
- **Keycloak domain.** The local dev server reads `src/assets/keycloak_dev.json`;
  the README tells you to change its domain to match your setup
  (`applications/osb-portal/README.md`, `applications/backoffice/README.md`).
- **502 on registration** is an ingress proxy buffer problem, not an app bug: the READMEs
  say to set `proxy-buffer-size: "16k"` on the nginx ingress configmap.
- **Node version.** Both frontend READMEs require node 13 in `/usr/local/bin`; a newer
  node is not what they document.
