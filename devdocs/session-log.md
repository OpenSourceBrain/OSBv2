# Session log

First entry: no prior session log or log convention existed in this repository.

## 2025-06-11 — C4 L3 Workspaces repaired; osb-portal next

- `devdocs/system/c4-level3-osb-workspaces-components.md`: the L3 Workspaces diagram is restored as an inline Mermaid `flowchart` fenced block (elk layout directive, single `wsapi` boundary, 13 backend components, L2 externals kept outside); no `.svg` image reference remains and `mmdc` parse/render exits 0.
- Committed as `docs(c4): restore inline Mermaid L3 Workspaces diagram and update devdocs index` (commit `9c2b55e9`).
- `devdocs/system/README.md` updated: "All three levels" wording, the L3 index entry, the `awk | mmdc` render line for the new file, and the legacy-SVG note reworded to state that diagrams are authored inline and no rendered SVG is committed. The four legacy `devdocs/system/svgs/OSB-NetPyNE Architecture - *.svg` files were left untouched.
- Next, in priority order: `osb-portal` L3 component diagram, then `nwb-explorer`, then `accounts-api`, then `backoffice`.
- Deferred: `jupyterhub` / `jupyterlab` — embedded third-party images, not code developed in this repository; revisit later.
- Note: `devdocs/scripts/render_mermaid.py` already exists and can render every Mermaid block under `devdocs/` in bulk.
