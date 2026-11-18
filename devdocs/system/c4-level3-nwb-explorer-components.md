# C4 model: Level 3 -- Component diagram (nwb-explorer)

Status: architecture documentation. This is the C4 Level 3 view of the
`nwb-explorer` application, built from evidence in this repository (the
application's Dockerfile, requirements, deploy values, Geppetto configuration
and the vendored `dependencies/nwb-explorer/` source) rather than from
assumption.  The containers it sits among are in
`c4-level2-osb-containers.md`; the sibling L3 views are
`c4-level3-osb-workspaces-components.md` and
`c4-level3-osb-portal-components.md`.

## Scope and intent

A component diagram zooms into one container from Level 2 and shows the
components inside it and how they collaborate.  Here the container in scope is
`notebook` ("JupyterLab single-user server") in its `nwb-explorer` spawn-image
variant: the OSB-specific NWB Explorer application image.

Note on scope: first-party OSB code in `applications/nwb-explorer/` is thin --
it is OSB packaging (Dockerfile, requirements.txt, `geppetto/GeppettoConfiguration.json`,
`deploy/values*.yaml`, build/run/stop/rebuild/pip_info scripts) wrapped around a
vendored upstream clone at
`applications/nwb-explorer/dependencies/nwb-explorer/` (MetaCell nwb-explorer
0.6.2, carrying its own `.git`), which is the code that actually runs.  The
components therefore follow the vendored package's real modules, not invented
ones.  They are shown inside a single `nwbExplorer` boundary; the Level 2 nodes
they interact with are kept outside it and reuse the Level 2 aliases and labels
verbatim.

The diagram is rendered as a Mermaid `flowchart` with `layout: elk` instead of
Mermaid's `C4Component`, following the convention of the sibling Klea project
and the other OSB L3 diagrams: Mermaid's C4 diagram types use a fixed 2-column
grid with straight `Rel` lines that overlap boxes at this density, while `elk`
routes edges orthogonally around nodes.  This is a documentation-notation
choice, not an architecture decision.

## Component diagram -- nwb-explorer components (flowchart, elk)

```mermaid
%%{init: {"flowchart": {"layout": "elk"}, "elk": {"mergeEdges": false, "nodeSpacing": 40, "rankSpacing": 60}}}%%
flowchart TB

    %% C4 Level 3 - Component diagram for nwb-explorer (nwbExplorer boundary)
    %% External aliases and labels are reused verbatim from the Level 2 source
    %%   (devdocs/system/c4-level2-osb-containers.md).
    %% EVIDENCE: components are the real modules of the vendored package at
    %%   applications/nwb-explorer/dependencies/nwb-explorer/ plus the OSB
    %%   packaging files and k8s/auth.py.
    %% EXCLUDED (see notes): test/, test_compatibility.py,
    %%   utilities/install.py, utilities/update.py,
    %%   k8s/hot_fix_for_eventsource.js -- dev/test/tooling, not runtime.
    %% NOT CONNECTED (no evidence in code): dandi, figshare, biomodels,
    %%   smtp, keycloak, administrator, anonymousVisitor.

    %% Persons / external containers from Level 2 (verbatim aliases)
    registeredUser["Registered user<br/>Researcher with an OSB account who builds<br/>and runs workspaces and notebooks"]
    hub["JupyterHub<br/>JupyterHub hub + configurable-http-proxy (proxy-public :80), KubeSpawner"]
    nfs["NFS server<br/>NFS server, 240Gi, export at /exports"]
    github["GitHub<br/>Source code hosting"]
    portal["OSB Portal<br/>React SPA served by nginx :80"]
    wsapi["Workspaces API<br/>Python gunicorn/Flask/Connexion REST API :8080"]
    kubernetes["Kubernetes cluster (INFERRED)<br/>Container platform providing ingress,<br/>scheduling and storage"]

    subgraph nwbExplorer ["nwb-explorer"]
        direction TB
        imageBuild["Image build and wiring<br/>Dockerfile, requirements.txt, build_local.sh,<br/>run_local.sh, stop_local.sh, rebuild_local.sh"]
        deployValues["Deployment values<br/>deploy/values.yaml, values-quick.yaml,<br/>values-minimal.yaml (Helm / spawn image config)"]
        geppettoConfig["Geppetto client configuration<br/>geppetto/GeppettoConfiguration.json"]
        notebookApp["Notebook/Jupyter app bootstrap<br/>run.py (NotebookApp, default_url=/geppetto,<br/>--library=nwb_explorer), nwb_explorer/nwb_main.py main()"]
        tornadoApi["NWB REST handlers<br/>nwb_explorer/api.py (@get /api/load, /api/importvalue,<br/>/api/retrievevalue, /api/image, /notebook<br/>via jupyter_geppetto.webapi)"]
        nwbReader["NWB file reader and namespace setup<br/>nwb_model_interpreter/nwb_reader.py,<br/>nwb_explorer/__init__.py init_extensions()"]
        nwbModelInterpreter["NWB -> Geppetto model interpreter<br/>nwb_model_interpreter/nwb_model_interpreter.py<br/>(NWBModelInterpreter), nwb_geppetto_mappers.py, settings.py"]
        nwbDataManager["Geppetto data manager<br/>nwb_explorer/nwb_data_manager.py<br/>(NWBDataManager(GeppettoDataManager))"]
        plotsManager["Plot manager<br/>nwb_explorer/plots_manager.py<br/>(PlotManager, holoviews_plots, nwb_explorer/public/plots)"]
        webappUi["React web application<br/>webapp/Main.js, components/* (NWBListViewer, ImageViewer,<br/>NWBPlot, FileSampleSelector, WelcomePage), redux store"]
        nwbFileService["NWB file client service<br/>webapp/services/NWBFileService.js<br/>(fetch of the /api/* endpoints)"]
        geppettoClient["Geppetto client runtime<br/>GEPPETTO global, webapp/services/NWBGeppettoManager.js,<br/>webapp/redux/middleware/nwbMiddleware.js (MessageSocket)"]
        hubAuthAdapter["JupyterHub authenticator overlay<br/>k8s/auth.py (TmpAuthenticateHandler)"]
    end

    %% Evidenced runtime relationships (solid)
    registeredUser -->|"Uses in browser -- HTTPS"| webappUi
    notebookApp -->|"Registers handlers -- jupyter_geppetto, --library=nwb_explorer"| tornadoApi
    tornadoApi -->|"Handles load/importvalue/retrievevalue -- api.py @get"| nwbModelInterpreter
    tornadoApi -->|"Serves plot images -- /api/image, public_plots_path"| plotsManager
    nwbModelInterpreter -->|"Reads NWB files -- pynwb"| nwbReader
    nwbDataManager -->|"Opened projects -- GeppettoDataManager"| nwbModelInterpreter
    webappUi -->|"Calls NWB file service"| nwbFileService
    nwbFileService -->|"HTTP fetch -- /api/load, /api/importvalue, /api/retrievevalue"| tornadoApi
    webappUi -->|"GEPPETTO calls -- MessageSocket"| geppettoClient
    geppettoClient -->|"WebSocket Geppetto messages -- resolve_import_value"| notebookApp
    hubAuthAdapter -->|"Authenticator API -- jupyterhub.auth.Authenticator"| hub
    hub -->|"Spawns/proxies single-user server -- KubeSpawner, port 8000"| notebookApp
    webappUi -->|"Loads sample NWB files -- raw.githubusercontent.com/OpenSourceBrain/NWBShowcase"| github

    %% Inferred / unverified relationships (dotted, marked INFERRED)
    nwbFileService -.->|"Sample URL default -- github, INFERRED"| github
    nwbReader -.->|"Loads NWB from remote URL -- source_url not traced to a fetch, INFERRED"| github
    notebookApp -.->|"Workspace home / PVC -- INFERRED from L2 notebook->nfs"| nfs
    webappUi -.->|"Embedded in workspace iframe, nwbfile URL param, INFERRED"| portal
    webappUi -.->|"nwbfile URL supplied by workspace open, INFERRED"| wsapi
    notebookApp -.->|"Served through ingress -- INFERRED"| kubernetes
    notebookApp -.->|"Geppetto client config read at startup -- INFERRED"| geppettoConfig
    imageBuild -.->|"Packages the server -- Dockerfile content not inspected, INFERRED"| notebookApp
    deployValues -.->|"Selects spawn image/values -- INFERRED"| imageBuild
```

*Notes:* Solid `-->` = an evidenced runtime dependency traced to a direct
import, handler registration, `fetch` call or Level 2 edge; dotted `-.->` with
`INFERRED` in its label = an unverified or externally implied link.  The
evidenced edges rest on: `run.py` (NotebookApp, `--library=nwb_explorer`) and
`nwb_explorer/api.py` (`from jupyter_geppetto.webapi import get`, the `/api/*`
handlers); `nwb_model_interpreter/nwb_model_interpreter.py`
(`NWBModelInterpreter`) with `nwb_reader.py`; `nwb_data_manager.py`
(`NWBDataManager(GeppettoDataManager)`); `plots_manager.py` (`public_plots_path`);
`webapp/services/NWBFileService.js` (the `/api/load`, `/api/importvalue`,
`/api/retrievevalue` fetches), `webapp/components/ImageViewer.js` (`api/image`),
`NWBGeppettoManager.js` and `redux/middleware/nwbMiddleware.js`
(`GEPPETTO.MessageSocket.send`); `webapp/components/FileSampleSelector.js` (the
`raw.githubusercontent.com/OpenSourceBrain/NWBShowcase` sample links);
`k8s/auth.py` (`jupyterhub.auth.Authenticator`, `TmpAuthenticateHandler`); and
the Level 2 edges `hub --> notebook` transcribed here as `hub --> notebookApp`.

*Weakest links:* edges 16 to 21 above are the least certain.  The runtime
hand-off from `osb-portal`/`wsapi` to this image is **not** evidenced in code:
it is taken from Level 2 plus the `nwbfile` URL-parameter convention
(`NWBFileService.js`, `const NWB_FILE_URL_PARAM = 'nwbfile'`), and the
`nwbFileService -> github` default link rests only on a commented-out
`NWB_FILE_DEFAULT_URL` constant.  `nwbReader -> github` follows the
`NWBModelInterpreter.__init__(nwb_file_or_filename, source_url=None)` signature,
but no fetch for `source_url` was traced.  `imageBuild -> notebookApp` is
inferred because the Dockerfile content was not inspected; `notebookApp ->
geppettoConfig` because the Geppetto configuration is read at client startup
rather than by a traced server call; `notebookApp -> nfs` and `notebookApp ->
kubernetes` are carried over from Level 2.

*Excluded from the diagram:* `test/`, `test_compatibility.py`,
`utilities/install.py`, `utilities/update.py` and
`k8s/hot_fix_for_eventsource.js` are development/test/tooling artefacts, not
runtime components.  `yarn.lock` and `webapp/package-lock.json` GitHub URLs are
dependency metadata, not edges.  `dandi`, `figshare`, `biomodels`, `smtp`,
`keycloak`, `administrator` and `anonymousVisitor` appear in the Level 2 view
but have no code evidence in this application, so they are deliberately left
unconnected rather than guessed at.

## Rendering the diagram

As with the other OSB C4 diagrams, the source is the fenced `mermaid` block in
this file, so rendering extracts that block to a temporary `.mmd` file in
`/tmp` and renders it there; no rendered image is committed.  From the
repository root:

```bash
python devdocs/scripts/render_mermaid.py --output-dir /tmp/c4-diagrams --work-dir /tmp/c4-diagrams/src --format svg
```

A render is successful when the CLI exits 0; Mermaid parse errors surface
there.  Update this `.md` source and re-run the command above instead of
editing or committing a rendered image.
