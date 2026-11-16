# OSB system diagrams

These are C4 diagrams of the OSB (Open Source Brain, OSBv2) platform, built from evidence in this repository (README, Helm/deploy values, OpenAPI specs and task definitions) rather than from assumption.

## C4 Level 1 — System Context

- Source: `c4-level1-osb-context.mmd` (Mermaid `C4Context`, editable and diffable)
- Rendered: `c4-level1-osb-context.svg`

Regenerate the SVG with Mermaid CLI from the repository root:

```bash
mmdc -i devdocs/system/c4-level1-osb-context.mmd -o devdocs/system/c4-level1-osb-context.svg
```

## Note on legacy diagrams

The SVGs in `devdocs/system/svgs/` (`OSB-NetPyNE Architecture - *.svg`) are legacy material: they are older, hand-made architecture exports that may be outdated and are not maintained by this index. The diagrams here (`c4-level1-osb-context.*`) are the current, source-controlled versions; update the `.mmd` file and re-run the command above instead of editing the rendered SVG.
