# Session log

First entry: no prior session log or log convention existed in this repository.

## 2025-06-11 — C4 L3 Workspaces repaired; osb-portal next

- `devdocs/system/c4-level3-osb-workspaces-components.md`: the L3 Workspaces diagram is restored as an inline Mermaid `flowchart` fenced block (elk layout directive, single `wsapi` boundary, 13 backend components, L2 externals kept outside); no `.svg` image reference remains and `mmdc` parse/render exits 0.
- Committed as `docs(c4): restore inline Mermaid L3 Workspaces diagram and update devdocs index` (commit `9c2b55e9`).
- `devdocs/system/README.md` updated: "All three levels" wording, the L3 index entry, the `awk | mmdc` render line for the new file, and the legacy-SVG note reworded to state that diagrams are authored inline and no rendered SVG is committed. The four legacy `devdocs/system/svgs/OSB-NetPyNE Architecture - *.svg` files were left untouched.
- Next, in priority order: `osb-portal` L3 component diagram, then `nwb-explorer`, then `accounts-api`, then `backoffice`.
- Deferred: `jupyterhub` / `jupyterlab` — embedded third-party images, not code developed in this repository; revisit later.
- Note: `devdocs/scripts/render_mermaid.py` already exists and can render every Mermaid block under `devdocs/` in bulk.

## 2025-11-17 — C4 L3 osb-portal and nwb-explorer added

- `devdocs/system/c4-level3-osb-portal-components.md`: osb-portal L3 component diagram completed earlier in this session (inline Mermaid `flowchart` fenced block, elk layout, L2 externals kept outside the boundary).
- `devdocs/system/c4-level3-nwb-explorer-components.md`: new L3 nwb-explorer component diagram added as an inline Mermaid `flowchart` fenced block (elk layout, single `nwbExplorer` boundary with 13 components, L2 aliases/labels reused verbatim outside it). Components follow the vendored upstream package at `applications/nwb-explorer/dependencies/nwb-explorer/` (MetaCell nwb-explorer 0.6.2) plus the OSB packaging files and `k8s/auth.py`; evidence split into solid (traced import/handler/fetch/L2 edge) and dotted `INFERRED` links. `test/`, `test_compatibility.py`, `utilities/install.py`, `utilities/update.py` and `k8s/hot_fix_for_eventsource.js` are excluded as dev/test/tooling; `dandi`, `figshare`, `biomodels`, `smtp`, `keycloak`, `administrator` and `anonymousVisitor` are left unconnected for lack of code evidence.
- Render check: extracted the fenced block with `awk` to `/tmp/c4-level3-nwb-explorer-components.mmd` and rendered with `mmdc -o /tmp/c4-level3-nwb-explorer-components.svg --scale 2 --backgroundColor transparent`; `mmdc` exit 0, no parse errors. No rendered SVG is committed.
- `devdocs/system/README.md` updated: new L3 nwb-explorer index entry and its `awk | mmdc` render line.
- Next, in priority order: `accounts-api` L3 component diagram, then `backoffice`.
- Deferred: `jupyterhub` / `jupyterlab` — embedded third-party images, not code developed in this repository; revisit later.

## 2025-11-17 — Diagrams rendered with `devdocs/scripts/render_mermaid.py`

- `devdocs/scripts/render_mermaid.py` is now the single documented way to render the C4 diagrams: it discovers every fenced `mermaid` block under `devdocs/` (plus every `.mmd` file in the repository), extracts each source to a `.mmd` file and renders it with `mmdc`. Invocation used and verified: `python devdocs/scripts/render_mermaid.py --output-dir /tmp/c4-diagrams --work-dir /tmp/c4-diagrams/src --format svg` (the script defaults `--scale 2.0` and `--background transparent` match the previous `--scale 2 --backgroundColor transparent`). `mmdc` exit 0; 5 diagrams rendered to `/tmp/c4-diagrams` (level 1 context, level 2 containers, L3 workspaces, osb-portal and nwb-explorer) and nothing was written inside the repository.
- Old `awk | mmdc` one-liners removed: in `devdocs/system/README.md` the five per-file render lines collapsed into the single script command, and the rendering intro sentence plus the legacy-SVG closing note were reworded to refer to "the render command above"; the per-file snippets in `devdocs/system/c4-level3-osb-workspaces-components.md`, `devdocs/system/c4-level3-osb-portal-components.md` (its snippet previously wrote a `.png`) and `devdocs/system/c4-level3-nwb-explorer-components.md` were replaced by the same command.
- `devdocs/system/c4-level1-osb-context.md` and `devdocs/system/c4-level2-osb-containers.md` contain no render snippet and were left untouched, as were `devdocs/scripts/render_mermaid.py` and the four legacy `devdocs/system/svgs/OSB-NetPyNE Architecture - *.svg` files.
- Pending queue unchanged, in priority order: `accounts-api` L3 component diagram, then `backoffice`. Deferred: `jupyterhub` / `jupyterlab` — embedded third-party images, not code developed in this repository; revisit later.

## 2025-11-17 — C4 L3 accounts-api added

- `devdocs/system/c4-level3-accounts-api-components.md`: new L3 accounts-api component diagram added as an inline Mermaid `flowchart` fenced block (elk layout, single `accountsApi` boundary with 12 components, L2 aliases/labels reused verbatim outside it). L2 externals reused: `registeredUser`, `administrator`, `portal`, `backoffice`, `wsapi`, `keycloak` and `kubernetes` (INFERRED).
- Evidence split: solid links traced to import/handler/L2 edges, dotted `INFERRED` for `appBootstrap -> openapiSpec` and `backoffice -> groupsController`.
- Deliberate exclusions: the generated security stub, `resourceModels` collapsed into its owning controller, and no datastore — accounts-api is stateless and stores nothing.
- Render check: `python devdocs/scripts/render_mermaid.py --output-dir /tmp/c4-diagrams --work-dir /tmp/c4-diagrams/src --format svg` exited 0 with `Rendered 6 diagram(s).` No rendered SVG is committed.
- `devdocs/system/README.md` updated: new L3 accounts-api index entry and the new document added to the legacy-note file list.
- Pending queue, in priority order: `backoffice` L3 component diagram. Deferred: `jupyterhub` / `jupyterlab` — embedded third-party images, not code developed in this repository; revisit later.
