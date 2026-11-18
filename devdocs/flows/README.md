# OSB application flows

These are sequence diagrams of the OSB (Open Source Brain, OSBv2) platform's cross-service flows, built from evidence in this repository (the services' source, Helm/deploy values and OpenAPI specs) rather than from assumption.

## Authenticated request

- Source: `sequence-authenticated-request.md` (Mermaid `sequenceDiagram`, editable and diffable)
- Rendered: not committed (render to a temporary path, see below)

## Workspace creation and resource import

- Source: `sequence-workspace-import.md` (Mermaid `sequenceDiagram`, editable and diffable)
- Rendered: not committed (render to a temporary path, see below)

## Notebook run submission

- Source: `sequence-notebook-run.md` (Mermaid `sequenceDiagram`, editable and diffable)
- Rendered: not committed (render to a temporary path, see below)

## Rendering the diagrams

The source is the fenced `mermaid` block inside each `.md` file listed above; `devdocs/scripts/render_mermaid.py` discovers every `mermaid` block under `devdocs/`, extracts each one to a `.mmd` file and renders it with `mmdc`, writing both the extracted sources and the images to a temporary directory (never into the repository).  Rendered SVGs are never committed; only the `.md` sources are version controlled.  From the repository root:

```bash
python devdocs/scripts/render_mermaid.py --output-dir /tmp/c4-diagrams --work-dir /tmp/c4-diagrams/src --format svg
```

A render is successful when the CLI exits 0; Mermaid parse errors surface there.

## Note on `layout: elk`

`devdocs/system/` diagrams carry a `layout: elk` directive; it is omitted here because it is a flowchart-only directive and these documents are `sequenceDiagram`s, which do not accept it.
