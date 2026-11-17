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

## Rendering the diagrams

All three levels follow the sibling Klea project's convention: each diagram is a Mermaid `flowchart` with `layout: elk` (orthogonal edge routing) rather than Mermaid's `C4Context` / `C4Container` types, whose fixed two-column grid and straight `Rel` lines overlap boxes at this density.  The source is the fenced `mermaid` block inside the `.md` file listed above, so rendering extracts that block to a temporary `.mmd` file in `/tmp` and renders it there.  Rendered SVGs are not committed; only the `.md` sources are version controlled.  From the repository root:

```bash
awk '/^```mermaid$/{f=1;next} f&&/^```$/{f=0} f' devdocs/system/c4-level1-osb-context.md > /tmp/c4-level1-osb-context.mmd && mmdc -i /tmp/c4-level1-osb-context.mmd -o /tmp/c4-level1-osb-context.svg --scale 2 --backgroundColor transparent

awk '/^```mermaid$/{f=1;next} f&&/^```$/{f=0} f' devdocs/system/c4-level2-osb-containers.md > /tmp/c4-level2-osb-containers.mmd && mmdc -i /tmp/c4-level2-osb-containers.mmd -o /tmp/c4-level2-osb-containers.svg --scale 2 --backgroundColor transparent

awk '/^```mermaid$/{f=1;next} f&&/^```$/{f=0} f' devdocs/system/c4-level3-osb-workspaces-components.md > /tmp/c4-level3-osb-workspaces-components.mmd && mmdc -i /tmp/c4-level3-osb-workspaces-components.mmd -o /tmp/c4-level3-osb-workspaces-components.svg --scale 2 --backgroundColor transparent
awk '/^```mermaid$/{f=1;next} f&&/^```$/{f=0} f' devdocs/system/c4-level3-osb-portal-components.md > /tmp/c4-level3-osb-portal-components.mmd && mmdc -i /tmp/c4-level3-osb-portal-components.mmd -o /tmp/c4-level3-osb-portal-components.svg --scale 2 --backgroundColor transparent
```

A render is successful when the CLI exits 0; Mermaid parse errors surface there.

## Note on legacy diagrams

The SVGs in `devdocs/system/svgs/` (`OSB-NetPyNE Architecture - *.svg`) are legacy material: they are older, hand-made architecture exports that may be outdated and are not maintained by this index. They are not the artefact of any diagram documented here. The diagrams here (`c4-level1-osb-context.*`, `c4-level2-osb-containers.*`, `c4-level3-osb-workspaces-components.*`) are the current, source-controlled versions, and each is authored inline as the fenced `mermaid` block in its own `.md` file; no rendered SVG is committed for them. Update that `.md` source and re-run the commands above instead of editing or adding a rendered SVG.
