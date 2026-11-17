# OSB developer documentation

This directory holds OSBv2's developer-facing documentation. Every document present under
`devdocs/` is listed below with its relative path, grouped by kind. The entries describe what is
actually in the tree; nothing is listed that does not exist, and nothing that exists is left out.

## Architecture (C4)

Structural views of the platform, built from evidence in this repository (READMEs, Helm/deploy
values, OpenAPI specs, task definitions). `system/README.md` is the **C4-only index** for this
section and stays the entry point for the diagrams; it is not a general devdocs index.

| Document | Path |
| --- | --- |
| C4 index and rendering notes | [system/README.md](system/README.md) |
| C4 Level 1 -- System Context | [system/c4-level1-osb-context.md](system/c4-level1-osb-context.md) |
| C4 Level 2 -- Containers | [system/c4-level2-osb-containers.md](system/c4-level2-osb-containers.md) |
| C4 Level 3 -- Workspaces API components | [system/c4-level3-osb-workspaces-components.md](system/c4-level3-osb-workspaces-components.md) |
| C4 Level 3 -- osb-portal components | [system/c4-level3-osb-portal-components.md](system/c4-level3-osb-portal-components.md) |
| C4 Level 3 -- nwb-explorer components | [system/c4-level3-nwb-explorer-components.md](system/c4-level3-nwb-explorer-components.md) |
| C4 Level 3 -- accounts-api components | [system/c4-level3-accounts-api-components.md](system/c4-level3-accounts-api-components.md) |
| C4 Level 3 -- backoffice components | [system/c4-level3-backoffice-components.md](system/c4-level3-backoffice-components.md) |

Legacy, hand-made exports live in `system/svgs/` (`OSB-NetPyNE Architecture - *.svg`). They are
older, unmaintained material and not the artefact of any diagram above; see
`system/README.md`, "Note on legacy diagrams".

## Runtime flows

Sequence diagrams of cross-service flows, one document per flow, plus the section index.

| Document | Path |
| --- | --- |
| Flows index and rendering notes | [flows/README.md](flows/README.md) |
| Authenticated request | [flows/sequence-authenticated-request.md](flows/sequence-authenticated-request.md) |
| Workspace creation and resource import | [flows/sequence-workspace-import.md](flows/sequence-workspace-import.md) |
| Notebook run submission | [flows/sequence-notebook-run.md](flows/sequence-notebook-run.md) |

## Guides

| Topic | Document | Path |
| --- | --- | --- |
| Local development -- running one service, or the full stack in minikube | Local development | [local-development.md](local-development.md) |
| Deployment and environment configuration -- values layering, key fields, `CH_*` convention, secrets, `values*.yaml` inventory, pipelines | Deployment and environment configuration | [deployment-configuration.md](deployment-configuration.md) |
| Authentication and authorisation -- login, bearer handling, per-layer checks and failure modes | Cross-service auth model | [auth-model.md](auth-model.md) |
| Data and storage -- the Postgres metadata schema, the per-workspace PVC, Argo-held state | Data and storage model | [data-model.md](data-model.md) |
| API contracts -- authoritative OpenAPI specs, generated copies, client regeneration | API contracts and service catalogue | [api-contracts.md](api-contracts.md) |

## Architecture decision records

Forward-only log of decisions; one file per decision, with the process rules and template in the
section index.

| Document | Path |
| --- | --- |
| ADR index, rules and template | [adr/README.md](adr/README.md) |
| 0001. Record architecture decisions | [adr/0001-record-architecture-decisions.md](adr/0001-record-architecture-decisions.md) |

## Topic notes and history

| Document | Path |
| --- | --- |
| User quotas | [user-quotas.md](user-quotas.md) |
| OSB applications protocol | [osb-applications-protocol.md](osb-applications-protocol.md) |
| Session log -- dated work notes | [session-log.md](session-log.md) |

`session-log.md` records what was done and when; decisions live in `adr/`, structure in
`system/`, and behaviour in `flows/`.

## Tooling

| Item | Path |
| --- | --- |
| Mermaid renderer -- discovers every fenced `mermaid` block under `devdocs/`, extracts it to a `.mmd` file and renders it with `mmdc` to a temporary directory | [scripts/render_mermaid.py](scripts/render_mermaid.py) |

From the repository root:

```bash
python devdocs/scripts/render_mermaid.py --output-dir /tmp/c4-diagrams --work-dir /tmp/c4-diagrams/src --format svg
```

Rendered images are never committed; only the `.md` sources are version controlled. A render is
successful when the CLI exits 0 -- Mermaid parse errors surface there.
