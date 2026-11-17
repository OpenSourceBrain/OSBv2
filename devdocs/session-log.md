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
