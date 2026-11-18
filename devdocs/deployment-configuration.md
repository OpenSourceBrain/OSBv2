# Deployment and environment configuration

How OSBv2 is configured and deployed: the layered CloudHarness values, the key
fields with real examples, the `CH_*` environment-variable convention and how a
service URL is derived from it, how secrets are (and are not) exposed, the values
files that exist per application, and the pipeline surface.

Everything below is quoted from a file in this repository, cited inline. Where a
mechanism is a CloudHarness convention that the repository itself does not spell
out, it is marked as such rather than presented as a repository fact.

## The values layering

An application's effective configuration is built by merging, in order:

1. **Chart defaults** -- the CloudHarness chart and the templates in
   `deployment-configuration/`:
   - `deployment-configuration/helm/Chart.yaml` (the only file in that chart
     directory: `find deployment-configuration/helm -type f` returns just it)
   - `deployment-configuration/values-template.yaml`
   - `deployment-configuration/values-template-dev.yaml`
   - `deployment-configuration/skaffold-template.yaml`
2. **Per-application values** -- one `deploy/` directory per application, e.g.
   `applications/accounts-api/deploy/values.yaml`:

   ```yaml
   harness:
     subdomain: api.accounts
     secured: false
     service:
       port: 8080
       auto: true
     deployment:
       auto: true
       port: 8080
       requests:
         memory: 120Mi
     livenessProbe:
       path: /api/live
     readinessProbe:
       path: /api/ready
     dependencies:
       hard:
         - accounts
       build:
         - cloudharness-base
         - cloudharness-flask
   ```

3. **Environment override** -- `values-[ENV].yaml` next to the base file, selected
   when the deployment is generated (the CloudHarness harness CLI's `-e <env>`
   switch, which `local-scripts/osbv2-local.sh` drives through its
   `harness_deployment` call). The repository holds these override files for
   `dev`, `local`, `minimal`, `netpyne`, `prod`, `quick` and `test` -- see the
   per-application table below.

The merged result of that layering is a single `apps:` map keyed by application
name. A generated snapshot of it is committed as
`applications/workspaces/server/test/values.yaml`: it contains `apps.accounts`,
`apps.accounts-api`, `apps.argo`, `apps.common`, `apps.events`,
`apps.jupyterhub`, ... each with a full `harness` block plus the app's own keys
(`image`, `port`, `resources`, `task-images`, `webclient`). That file is the best
reference for what the merge produces; read it rather than guessing a field's
final shape.

### Deployment flow at a glance

`local-scripts/osbv2-local.sh` (`deploy_live`) shows the intended order:

```bash
harness_deployment            # renders the values into deployment/helm
helm install -n ${OSB_NAMESPACE} osb deployment/helm
```

with `OSB_NAMESPACE="osblocal"`. Note that `deployment/helm` is **generated and
untracked**: `.gitignore` line 3 is `deployment/helm` (and line 7 `/deployment.yaml`),
which is why `find deployment/helm` fails in a fresh checkout yet the script's
`helm install ... deployment/helm` is correct after `harness_deployment` has run.
The chart that *is* tracked is `deployment-configuration/helm/Chart.yaml`.

The order matters: skaffold builds the per-application images
(`deployment-configuration/skaffold-template.yaml`, `SKAFFOLD_MAX_VERSION="2.14.2"`),
`harness_deployment` merges the values layering above (templates -> per-app
`deploy/values.yaml` -> `values-[ENV].yaml`) into the chart under `deployment/helm`, and
`helm install` then deploys that generated output -- helm consumes generated
configuration; it is not the source of it.

## Key fields, with real examples

### `harness.subdomain`

The ingress host prefix an application is published under. Same value in the base
values and the generated snapshot:

| Application | `harness.subdomain` | Source |
| --- | --- | --- |
| accounts-api | `api.accounts` | `applications/accounts-api/deploy/values.yaml` |
| accounts | `accounts` | `applications/workspaces/server/test/values.yaml` (`apps.accounts.harness.subdomain`) |
| accounts-api | `api.accounts` | same snapshot, `apps.accounts-api.harness.subdomain` |
| osb-portal | `www` | same snapshot, `apps.osb-portal` (`CH_OSB_PORTAL_SUBDOMAIN`) |
| jupyterhub | `hub` | same snapshot, `apps.jupyterhub.harness.subdomain` |
| jupyterlab-minimal | `notebooks` | same snapshot (`CH_JUPYTERLAB_MINIMAL_SUBDOMAIN`) |
| argo | `argo` | same snapshot, `apps.argo.harness.subdomain` |
| common | `common` | same snapshot, `apps.common.harness.subdomain` |
| events | `events` | same snapshot, `apps.events.harness.subdomain` |
| nfsserver | `nfsserver` | derived from `CH_NFSSERVER_SUBDOMAIN` in the snapshot |
| notifications | `notifications` | derived from `CH_NOTIFICATIONS_SUBDOMAIN` in the snapshot |
| workspaces | `workspaces` | derived from `CH_WORKSPACES_SUBDOMAIN` in the snapshot |
| workflows | `workflows` | derived from `CH_WORKFLOWS_SUBDOMAIN` in the snapshot |

### `harness.secured`

Whether the ingress puts the gatekeeper in front of the app. Real values:
`false` for `accounts-api` (`applications/accounts-api/deploy/values.yaml`),
`false` for `accounts` and `common`, `true` for `jupyterhub` and `argo`
(`applications/workspaces/server/test/values.yaml`). This is the switch that
decides whether a browser reaching the app has already been through the OAuth
round-trip (see `devdocs/auth-model.md`).

### `harness.service` and `harness.deployment`

`service` describes the Kubernetes Service, `deployment` the pod. The accounts-api
example above sets both to port `8080` with `auto: true`. `deployment` also carries
optional `image`, `replicas`, `volume` and `resources`, and `service` may be turned
off (`auto: false`) when an app is not exposed -- `argo` and `events` do exactly
that in the snapshot (`apps.argo.harness.service: {auto: false, name: argo-server,
port: 2746}`, `apps.events.harness.service: {auto: false, name: events-ui, port: 80}`)
while their `deployment.auto` is also `false`, i.e. they are expected to come from
elsewhere.

### `harness.dependencies`

Three lists with different meanings:

- `build` -- images that must be built first: `cloudharness-base`,
  `cloudharness-flask` for `accounts-api`
  (`applications/accounts-api/deploy/values.yaml`); `cloudharness-base` for
  `jupyterhub`, `cloudharness-flask` for `common`
  (`applications/workspaces/server/test/values.yaml`).
- `hard` -- services that must be up before this one: `accounts` for
  `accounts-api` (`applications/accounts-api/deploy/values.yaml`); `accounts` for
  `accounts-api` again in the snapshot.
- `soft` -- best-effort dependencies: `accounts` for `jupyterhub`
  (`apps.jupyterhub.harness.dependencies.soft`).

`applications/workspaces/deploy/values.yaml` lists `events`, `workflows`,
`notifications` and `nfsserver` among its dependencies, immediately before a
`hard:` key (`:62-66`) -- i.e. the workspaces API is wired to the event bus, the
workflow engine, notifications and the NFS server, which is why a workspaces-only
local run cannot work without them.

### `resources`

Request/limit pairs, given twice: once under `harness.deployment.resources` (the
pod) and once at the application level (`resources`, re-used by tasks). Real
numbers in the snapshot:

| Application | limits | requests |
| --- | --- | --- |
| accounts | `cpu: 500m, memory: 1024Mi` | `cpu: 10m, memory: 512Mi` |
| accounts-api | `cpu: 500m, memory: 500Mi` | `cpu: 10m, memory: 32Mi` |
| argo | `cpu: 500m, memory: 500Mi` | `cpu: 10m, memory: 32Mi` |
| common | `cpu: 200m, memory: 256Mi` | `cpu: 50m, memory: 128Mi` |
| events | `cpu: 500m, memory: 500Mi` | `cpu: 10m, memory: 32Mi` |
| jupyterhub | `cpu: 500m, memory: 500Mi` | `cpu: 10m, memory: 32Mi` |

(`applications/workspaces/server/test/values.yaml`.) `accounts-api` additionally
overrides only `requests.memory: 120Mi` in its own base values
(`applications/accounts-api/deploy/values.yaml`) -- a good illustration of a small
per-app override on top of chart defaults.

Note that a user's *workspace* resources are not configured here but per user/group
in Keycloak: `jupyterhub` declares `harness.quotas`
(`quota-storage-max: 1.25`, `quota-ws-guaranteecpu: 0.2`, `quota-ws-guaranteemem: 0.5`,
`quota-ws-maxcpu: 1`, `quota-ws-maxmem: 1`, `quota-ws-open: 3`) in
`applications/workspaces/server/test/values.yaml`, and the workspaces server reads
them back with `get_configuration('jupyterhub')`
(`applications/workspaces/server/workspaces/service/user_quota_service.py:27`,
comment: "deployment defaults, overridden per user or group in Keycloak").

### Probes, roles and per-app extras

- `harness.livenessProbe.path` / `harness.readinessProbe.path`: `/api/live` and
  `/api/ready` for `accounts-api` (`applications/accounts-api/deploy/values.yaml`),
  `/auth/realms/master` for `accounts` (snapshot).
- `harness.uri_role_mapping`: role gate per URI prefix, e.g. `accounts` and
  `accounts-api` both map `roles: [administrator]` to `uri: /*` and white-list
  `{uri: /api/openapi.json, white-listed: true}` (snapshot).
- `harness.env`: plain environment, e.g. `accounts` gets `KEYCLOAK_IMPORT`,
  `KEYCLOAK_USER`, `KEYCLOAK_PASSWORD`, `DB_VENDOR`, `DB_ADDR`, `DB_DATABASE`,
  `DB_USER`, `DB_PASSWORD`, `JAVA_OPTS` (snapshot); `common` gets `SENTRY_DSN`.
- `harness.resources`: files mounted into the container, as `{dst, name, src}` --
  `accounts` mounts its realm import as
  `{dst: /tmp/realm.json, name: realm-config, src: realm.json}` (snapshot).
- `harness.database`: a managed database block, e.g. `accounts`' Keycloak Postgres
  (`type: postgres`, `name: keycloak-postgres`, `user: user`, `pass: password`,
  `initialdb: auth_db`, `image: postgres:10.4`, size `2Gi`) (snapshot).
- Application-specific keys sit next to `harness` inside the same app map:
  `applications/workspaces/deploy/values.yaml` is read by the server for
  `notebook_run_image_registries`
  (`applications/workspaces/server/workspaces/controllers/workspace_run_controller.py:59`,
  via `CloudharnessConfig.get_configuration()["apps"]["workspaces"]`).

## The `CH_*` environment-variable convention

CloudHarness materialises every application's coordinates as `CH_<APP>_<FIELD>`
environment variables, and copies them into the pods it administers. The full set
for the test deployment is committed in
`applications/workspaces/server/test/values.yaml` (`:1095-1135`), which is the
only `values*.yaml` under `applications/` containing `CH_` (`grep -rl 'CH_'`).

Real entries:

```yaml
- {name: CH_VERSION, value: 0.0.1}
- {name: CH_CHART_VERSION, value: 0.0.1}
- {name: CH_DOMAIN, value: osb.local}
- {name: CH_IMAGE_REGISTRY, value: ''}
- {name: CH_IMAGE_TAG, value: latest}
- {name: CH_ACCOUNTS_SUBDOMAIN, value: accounts}
- {name: CH_ACCOUNTS_NAME, value: accounts}
- {name: CH_ACCOUNTS_API_SUBDOMAIN, value: api.accounts}
- {name: CH_ACCOUNTS_API_NAME, value: accounts-api}
- {name: CH_OSB_PORTAL_SUBDOMAIN, value: www}
- {name: CH_OSB_PORTAL_NAME, value: osb-portal}
- {name: CH_WORKSPACES_SUBDOMAIN, value: workspaces}
- {name: CH_WORKSPACES_NAME, value: workspaces}
- {name: CH_JUPYTERHUB_SUBDOMAIN, value: hub}
- {name: CH_JUPYTERHUB_NAME, value: jupyterhub}
- {name: CH_JUPYTERLAB_MINIMAL_SUBDOMAIN, value: notebooks}
- {name: CH_JUPYTERLAB_MINIMAL_NAME, value: jupyterlab-minimal}
- {name: CH_ARGO_SUBDOMAIN, value: argo}
- {name: CH_COMMON_SUBDOMAIN, value: common}
- {name: CH_EVENTS_SUBDOMAIN, value: events}
- {name: CH_WORKFLOWS_SUBDOMAIN, value: workflows}
- {name: CH_NFSSERVER_SUBDOMAIN, value: nfsserver}
- {name: CH_NOTIFICATIONS_SUBDOMAIN, value: notifications}
- {name: CH_SECRET, value: <a sentence, quoted from the file>}
```

### How a service URL is resolved

Each app contributes a **subdomain** and a **name**, both with the app-name prefix
upper-cased and dashes turned into underscores:

1. `<APP>_SUBDOMAIN` is the app's `harness.subdomain` (`accounts-api` ->
   `api.accounts`, `osb-portal` -> `www`, `jupyterhub` -> `hub`,
   `jupyterlab-minimal` -> `notebooks`).
2. `<APP>_NAME` is the Kubernetes/deployment name (`accounts-api`, `osb-portal`,
   `jupyterhub`, `jupyterlab-minimal`).
3. `CH_DOMAIN` is the base domain of the deployment (`osb.local` in the test
   snapshot).

So the browser-facing URL of `accounts-api` is
`https://${CH_ACCOUNTS_API_SUBDOMAIN}.${CH_DOMAIN}` = `https://api.accounts.osb.local`,
and the portal is `https://www.osb.local`. Images are referenced with
`${CH_IMAGE_REGISTRY}${app}${CH_IMAGE_TAG}` -- with `CH_IMAGE_REGISTRY` empty the
references are unqualified and default to `latest`.

A service can read the whole graph instead of individual variables:
`CloudharnessConfig.get_configuration()["apps"]` is the merged `apps:` map
(used at `workspace_run_controller.py:59` and `:68-70`,
`CloudharnessConfig.get_applications()` / `get_application_by_filter(...)`), and
`cloudharness.auth.AuthClient` uses the same configuration to reach Keycloak
(`applications/workspaces/server/workspaces/service/auth.py:5`, `:20`).

## Secrets handling

There is no secret store in this repository; secrets are values like any other,
which is exactly why the layering above matters.

- **Per-app secrets** live in `harness.secrets`. `accounts` declares
  `secrets: {api_user_password: password}` and `accounts-api` declares
  `secrets: null` (`applications/workspaces/server/test/values.yaml`). `accounts`
  also carries the Keycloak admin password in plain `harness.env`
  (`KEYCLOAK_PASSWORD`, `DB_PASSWORD`) -- fine for the committed test snapshot, not
  a pattern to copy into a real deployment.
- **`CH_SECRET`** (see above) is one deployment-wide secret, which is why it is one
  of the variables deliberately withheld from untrusted pods (next point).
- **The Keycloak client secrets are exposed to task pods by default.**
  CloudHarness mounts a `cloudharness-kc-accounts` ConfigMap and an
  `cloudharness-allvalues` ConfigMap into every task, and copies the `CH_*`
  environment into each task's containers. `RunNotebooksTask` in
  `applications/workspaces/server/workspaces/service/workflow.py:157-173` removes
  them *because third-party repository code runs in that pod*: it filters
  `("cloudharness-kc-accounts", "cloudharness-allvalues")` out of
  `cloudharness_configmap_spec()` (`:160-166`) and drops every env whose name
  starts with `CH_` (`envs`, `:169-173`). Its comment states the reason plainly:
  "clearing them in run.sh isn't enough, as the repository's code can read run.sh's
  environment (/proc)", with `CH_SECRET` and `CH_ACCOUNTS_CLIENT_SECRET` named.
  The same class also mounts an empty dir over
  `/var/run/secrets/kubernetes.io/serviceaccount` so the run pod has no service
  account token (`:133-135`, `:164-166`). Any new task type that runs third-party
  code needs the same treatment.
- **No credentials in the DANDI path.** The DANDI key is read from a Keycloak user
  attribute at call time and never returned or logged
  (`applications/workspaces/server/workspaces/service/dandi_credentials.py:1-4`).

## Every `values*.yaml` under `applications/`

Collected with `find applications -maxdepth 3 -name 'values*.yaml'`. "Base" is the
file `harness_deployment` picks up automatically; the suffixed files are the
environment overrides selected with `-e`.

| Application | Base | Environment / variant overrides |
| --- | --- | --- |
| accounts | `applications/accounts/deploy/values.yaml` | -- |
| accounts-api | `applications/accounts-api/deploy/values.yaml` | -- |
| backoffice | `applications/backoffice/deploy/values.yaml` | -- |
| common | `applications/common/deploy/values.yaml` | -- |
| jupyterhub | `applications/jupyterhub/deploy/values.yaml` | `values-minimal.yaml`, `values-prod.yaml` |
| jupyterlab | `applications/jupyterlab/deploy/values.yaml` | `values-quick.yaml` |
| jupyterlab-minimal | `applications/jupyterlab-minimal/deploy/values.yaml` | -- |
| netpyne | `applications/netpyne/deploy/values.yaml` | `values-quick.yaml` |
| nfsserver | `applications/nfsserver/deploy/values.yaml` | `values-dev.yaml` |
| notifications | `applications/notifications/deploy/values.yaml` | `values-dev.yaml`, `values-minimal.yaml`, `values-prod.yaml` |
| nwb-explorer | `applications/nwb-explorer/deploy/values.yaml` | `values-minimal.yaml`, `values-quick.yaml` |
| osb-portal | `applications/osb-portal/deploy/values.yaml` | `values-dev.yaml`, `values-local.yaml`, `values-minimal.yaml`, `values-netpyne.yaml`, `values-prod.yaml`, `values-test.yaml` |
| workspaces | `applications/workspaces/deploy/values.yaml` | `values-dev.yaml`, `values-minimal.yaml`, `values-prod.yaml` |

That is 32 files in total. `osb-portal` is the most branched (seven variants,
including `local` and `netpyne`, which have no counterpart elsewhere), and
`workspaces` additionally ships the generated merged snapshot discussed above at
`applications/workspaces/server/test/values.yaml` -- test fixture, not an override,
and the only one of these files containing `CH_*`.

## Deployment pipeline surface

### Tracked paths

`git ls-files deployment deployment-configuration`:

```
deployment-configuration/codefresh-build-template.yaml
deployment-configuration/codefresh-template-dev.yaml
deployment-configuration/codefresh-template-prod.yaml
deployment-configuration/helm/Chart.yaml
deployment-configuration/skaffold-template.yaml
deployment-configuration/values-template-dev.yaml
deployment-configuration/values-template.yaml
deployment/codefresh-dev-quick.yaml
deployment/codefresh-dev.yaml
deployment/codefresh-local-test-minimal.yaml
deployment/codefresh-prod.yaml
deployment/codefresh-test.yaml
deployment/codefresh/codefresh.yaml
deployment/pvc.yaml
```

### What `deployment-configuration/` holds

The **generation inputs**: a minimal Helm chart
(`deployment-configuration/helm/Chart.yaml`), the values templates
(`values-template.yaml`, `values-template-dev.yaml`), a skaffold template
(`skaffold-template.yaml`) and three Codefresh templates
(`codefresh-build-template.yaml`, `codefresh-template-dev.yaml`,
`codefresh-template-prod.yaml`). The `*-template.yaml` naming, and the fact that
`deployment/` holds the concrete pipelines of the same shape, indicate these are
sources rendered into `deployment/` by the harness tooling; the exact generating
command is not in this repository, so treat that mapping as a naming-based reading
rather than a cited fact.

### What `deployment/` holds -- the pipelines

The **concrete pipelines**, one per environment, plus the generated chart directory
and a static volume:

| Path | Role |
| --- | --- |
| `deployment/codefresh-dev.yaml` | full dev pipeline |
| `deployment/codefresh-dev-quick.yaml` | quick dev pipeline |
| `deployment/codefresh-test.yaml` | test pipeline |
| `deployment/codefresh-local-test-minimal.yaml` | local test pipeline, minimal app set |
| `deployment/codefresh-prod.yaml` | production pipeline |
| `deployment/codefresh/codefresh.yaml` | Codefresh configuration shared by the above |
| `deployment/pvc.yaml` | a PersistentVolumeClaim deployed with the app |
| `deployment/helm` | **generated, git-ignored** (`.gitignore:3`); created by `harness_deployment` and consumed by `helm install -n osblocal osb deployment/helm` (`local-scripts/osbv2-local.sh`) |

Skaffold is the other entry point: `local-scripts/osbv2-local.sh` defines
`SKAFFOLD="skaffold"` and `SKAFFOLD_MAX_VERSION="2.14.2"` and uses
`deployment-configuration/skaffold-template.yaml` as the template. The script's own
header describes its purpose as local deployments of OSBv2, run from the repository
root.

### Environment shape, as the pipelines see it

The deployment-side facts that matter when reading these files:

- namespace `osblocal` for local runs (`OSB_NAMESPACE` in
  `local-scripts/osbv2-local.sh`);
- minikube `--kubernetes-version=v1.32 --driver=docker`, 8 CPUs / 10000mb by
  default and 4 CPUs when `CI=true`;
- `ingress` and `metrics-server` addons enabled, then `kubectl create ns osblocal`
  and `kubectl config set-context NAME --namespace=osblocal`;
- Python `3.12` for the CloudHarness tooling (`PY_VERSION="python3.12"`, with the
  comment "Cloud harness doesn't always work on newer versions");
- `port-forward.sh` (namespace as `$1`, e.g. `./port-forward.sh osblocal`) exposes
  `workspaces-postgres-host:5432`, `accounts:8080`, `kafka:9092` and
  `argo-$1-server:2746` -- the same four backends the workspace server depends on.

See `devdocs/local-development.md` for the runnable commands and the pitfalls
(notably that `deployment/helm` and the `cacert.crt` path the READMEs mention sit
under that git-ignored directory).
