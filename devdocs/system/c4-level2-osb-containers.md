# C4 model: Level 2 -- Container diagram

Status: architecture documentation. This is the C4 Level 2 view of the OSB
(Open Source Brain, OSBv2) platform, built from evidence in this repository
(README, Helm/deploy values, OpenAPI specs and task definitions) rather than
from assumption.  The Level 1 system context is in
`c4-level1-osb-context.md`.

## Scope and intent

A container diagram zooms into the system in scope (OSB) and shows the
*containers* -- the independently deployable applications, services and
datastores -- plus how they interact with each other and how they connect to
the external systems from Level 1.  Per the C4 standard
(https://c4model.com/diagrams/container) containers are things that can be
deployed/run independently.

The diagram is rendered as a Mermaid `flowchart` with `layout: elk` instead of
Mermaid's `C4Container`, following the convention of the sibling Klea project:
Mermaid's C4 diagram types use a fixed 2-column grid with straight `Rel` lines
that overlap boxes at this density, while `elk` routes edges orthogonally
around nodes.  This is a documentation-notation choice, not an architecture
decision.

Elements and relationships are unchanged from the previous `C4Container`
source (`c4-level2-osb-containers.mmd`, now superseded by this file): the same
12 containers with their technology and responsibility text, the Level 1
persons and external systems, and the same labelled relationships.

## Container diagram -- OSB containers (flowchart, elk)

```mermaid
---
config:
  layout: elk
  elk:
    mergeEdges: false
    nodeSpacing: 40
    rankSpacing: 60
---
flowchart TB

    %% C4 Level 2 - Container diagram for OSB (OSBv2)
    %% Aliases and external systems are reused verbatim from the Level 1 source
    %%   (devdocs/system/c4-level1-osb-context.md).
    %% INFERRED: `kubernetes` (the Kubernetes cluster / ingress platform) is
    %%   inferred from deployment-configuration/values-template.yaml (mainapp
    %%   osb-portal, tls true) and the nginx CORS ingress annotations in
    %%   values-template-dev.yaml.
    %% OUT OF SCOPE: the `events` and `workflows` dependencies listed by the
    %%   workspaces app exist only as dependency names (no directory under
    %%   applications/); they are upstream CloudHarness-provided and are
    %%   therefore NOT modelled as containers here.  The event flow is
    %%   expressed only as: notifications <- wsapi (CloudHarness events CDC).

    %% Persons
    registeredUser["Registered user<br/>Researcher with an OSB account who builds<br/>and runs workspaces and notebooks"]
    anonymousVisitor["Anonymous visitor<br/>Unauthenticated visitor browsing open<br/>workspaces and notebooks"]
    administrator["Administrator<br/>Staff user administering workspaces,<br/>accounts and repositories"]

    subgraph OSB ["OSB"]
        direction TB
        portal["OSB Portal<br/>React SPA (Vite build) served by nginx :80<br/>Public web UI to browse repositories/workspaces and run notebooks;<br/>secured subdomain www, keycloak.json mounted, use_services<br/>workspaces + accounts-api, uri_role_mapping whitelists<br/>/login and /workspaces/open/*"]
        wsapi["Workspaces API<br/>Python gunicorn/Flask/Connexion REST API :8080<br/>Manages workspaces and repositories and orchestrates copy jobs;<br/>postgres host, quotas, secrets github-user/github-token,<br/>depends on argo and accounts"]
        wsdb["Workspaces database<br/>PostgreSQL 18<br/>Persistence for workspaces and repositories<br/>(host workspaces-postgres-host, database workspaces)"]
        accountsapi["Accounts API<br/>Python Flask REST API :8080<br/>User/group/account queries for the frontends; subdomain api.accounts,<br/>/api/live and /api/ready, hard dependency on accounts"]
        keycloak["Identity provider (accounts)<br/>Keycloak identity provider with its own PostgreSQL<br/>Authentication and authorisation, realms and tokens; only its database<br/>sizing is configured in-repo (harness.database resources); Keycloak role<br/>also evidenced by authenticator_class ch and portal keycloak.json"]
        hub["JupyterHub<br/>JupyterHub hub + configurable-http-proxy (proxy-public :80), KubeSpawner<br/>Authenticates users and spawns/manages per-user notebook servers;<br/>subdomain hub, hard dependency on accounts, concurrent_spawn_limit 10,<br/>active_server_limit 40, spawner port 8000,<br/>storageClass {{namespace}}-nfs-client RWX, pvcNameTemplate osb-user-{userid}"]
        notebook["JupyterLab single-user server<br/>JupyterLab image quay.io/jupyter/base-notebook:python-3.12,<br/>port 8000, home /opt/workspace<br/>The user's interactive notebook environment; subdomain lab<br/>(alias notebooks), service proxy-public:80, hard dependency on<br/>jupyterhub; alternative spawn images exist in-repo (netpyne,<br/>nwb-explorer, jupyterlab-minimal) as variants of this container"]
        workers["Task worker images<br/>Short-lived container images run as Argo job pods:<br/>github-copy, dandi-copy, biomodels-copy,<br/>figshare-copy, scan-workspace<br/>Execute one-off data operations (clone/copy/scan)<br/>for workspaces and repositories"]
        argo["Argo Workflows controller<br/>Argo Workflows controller (bundled chart values)<br/>Schedules and runs the task job pods with TTL and user-node scheduling<br/>defaults; workflowDefaults nodeAffinity hub.jupyter.org/node-purpose,<br/>tolerations, ttlStrategy 84600s; hard dependency of the workspaces app<br/>(ships only this chart values file)"]
        notifications["Notifications service<br/>Python (cloudharness-base) service<br/>Sends notification email on workspace/repository creation;<br/>events.cdc subscription on app workspaces (workspace create,<br/>osbrepository create), channels admins/log, from-to<br/>info@opensourcebrain.org, secrets email-user/email-password"]
        nfs["NFS server<br/>NFS server, 240Gi, export at /exports<br/>Shared RWX storage for user workspaces and notebook PVCs"]
        backoffice["Backoffice<br/>Admin SPA served by nginx :80<br/>Admin UI over the workspaces and accounts APIs;<br/>subdomain admin, secured, use_services<br/>workspaces + accounts-api"]
    end

    %% External systems
    github["GitHub<br/>Source code hosting"]
    dandi["DANDI Archive<br/>Neuroscience data archive"]
    figshare["Figshare<br/>Research data repository"]
    biomodels["BioModels (EBI)<br/>Model repository"]
    smtp["SMTP mail server<br/>Outbound email"]
    kubernetes["Kubernetes cluster (INFERRED)<br/>Container platform providing ingress,<br/>scheduling and storage"]

    %% Relationships (transcribed from the previous C4Container source)
    registeredUser -->|"Uses -- HTTPS"| portal
    anonymousVisitor -->|"Uses open workspaces/notebooks -- HTTPS"| portal
    administrator -->|"Administers via -- HTTPS"| backoffice

    portal -->|"Calls -- REST, use_services"| wsapi
    portal -->|"Calls -- REST, use_services"| accountsapi
    portal -->|"Logs in users -- OpenID Connect, keycloak.json"| keycloak
    portal -.->|"Embeds notebook UI -- soft dependency jupyterhub/jupyterlab"| hub
    portal -.->|"Served through ingress -- nginx, INFERRED"| kubernetes

    backoffice -->|"Calls -- REST, use_services"| wsapi
    backoffice -->|"Calls -- REST, use_services"| accountsapi

    wsapi -->|"Reads/writes -- SQL"| wsdb
    wsapi -->|"Submits workflows -- hard dependency"| argo
    wsapi -->|"Reads/writes shared images volume -- workspaces-images, RWX"| nfs

    argo -->|"Runs as job pods -- container image"| workers

    accountsapi -->|"Queries/manages users -- admin API, hard dependency"| keycloak

    hub -->|"Authenticates via -- authenticator_class ch"| keycloak
    hub -->|"Spawns and proxies -- KubeSpawner, port 8000"| notebook

    notebook -->|"Mounts per-user home -- PVC osb-user-{userid}, storageClass {{namespace}}-nfs-client, RWX"| nfs

    notifications -->|"Receives change events -- CloudHarness events CDC, app workspaces"| wsapi
    notifications -->|"Sends email -- SMTP port 587"| smtp

    workers -->|"Clones repositories -- git, token"| github
    workers -->|"Downloads/uploads dandiset assets -- DANDI API"| dandi
    workers -->|"Copies figshare resources -- figshare API"| figshare
    workers -->|"Copies BioModels models -- BioModels API"| biomodels
```

*Notes:* Solid `-->` = an evidenced runtime dependency; dotted `-.->` = a
soft/inferred link (`portal -> hub` soft dependency `jupyterhub/jupyterlab`,
`portal -> kubernetes` served through ingress and INFERRED).  The `kubernetes`
node is marked INFERRED both in its label and in the `%%` comment inside the
diagram (inferred from `deployment-configuration/values-template.yaml`
mainapp osb-portal with tls true, and the nginx CORS ingress annotations in
`deployment-configuration/values-template-dev.yaml`).  Per the `%%` OUT OF
SCOPE note, the `events` and `workflows` dependencies exist only as dependency
names (no directory under `applications/`), are upstream CloudHarness-provided
and are not modelled as containers; the event flow appears only as
`notifications <- wsapi` (CloudHarness events CDC).
