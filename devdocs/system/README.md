# OSB system diagrams

These are C4 diagrams of the OSB (Open Source Brain, OSBv2) platform, built from evidence in this repository (README, Helm/deploy values, OpenAPI specs and task definitions) rather than from assumption.

## C4 Level 1 — System Context

- Source: `c4-level1-osb-context.md` (Mermaid `flowchart` with `layout: elk`, editable and diffable)
- Rendered: not committed (render to a temporary path, see below)

## C4 Level 2 — Container diagram

- Source: `c4-level2-osb-containers.md` (Mermaid `flowchart` with `layout: elk`, editable and diffable)
- Rendered: not committed (render to a temporary path, see below)

## C4 Level 3 — Component diagram (Workspaces API)

- Source: `c4-level3-osb-workspaces-components.md` (Mermaid `flowchart` with `layout: elk`, editable and diffable)
- Rendered: not committed (render to a temporary path, see below)

## C4 Level 3 — Component diagram (osb-portal)

- Source: `c4-level3-osb-portal-components.md` (Mermaid `flowchart` with `layout: elk`, editable and diffable)
- Rendered: not committed (render to a temporary path, see below)

## C4 Level 3 — Component diagram (nwb-explorer)

- Source: `c4-level3-nwb-explorer-components.md` (Mermaid `flowchart` with `layout: elk`, editable and diffable)
- Rendered: not committed (render to a temporary path, see below)

## Rendering the diagrams

All three levels follow the sibling Klea project's convention: each diagram is a Mermaid `flowchart` with `layout: elk` (orthogonal edge routing) rather than Mermaid's `C4Context` / `C4Container` types, whose fixed two-column grid and straight `Rel` lines overlap boxes at this density.  The source is the fenced `mermaid` block inside each `.md` file listed above; `devdocs/scripts/render_mermaid.py` discovers every `mermaid` block under `devdocs/`, extracts each one to a `.mmd` file and renders it with `mmdc`, writing both the extracted sources and the images to a temporary directory (never into the repository).  Rendered SVGs are not committed; only the `.md` sources are version controlled.  From the repository root:

```bash
python devdocs/scripts/render_mermaid.py --output-dir /tmp/c4-diagrams --work-dir /tmp/c4-diagrams/src --format svg
```

A render is successful when the CLI exits 0; Mermaid parse errors surface there.

## Note on legacy diagrams

The SVGs in `devdocs/system/svgs/` (`OSB-NetPyNE Architecture - *.svg`) are legacy material: they are older, hand-made architecture exports that may be outdated and are not maintained by this index. They are not the artefact of any diagram documented here. The diagrams here (`c4-level1-osb-context.*`, `c4-level2-osb-containers.*`, `c4-level3-osb-workspaces-components.*`) are the current, source-controlled versions, and each is authored inline as the fenced `mermaid` block in its own `.md` file; no rendered SVG is committed for them. Update that `.md` source and re-run the render command above instead of editing or adding a rendered SVG.
