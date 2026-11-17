# Workspace import flow

How a workspace is created, how its resources are copied onto its volume, how the
portal polls until the copy finishes, and what happens when the workspace is deleted
mid-import. Every hop below is traced to a file and symbol in this repository; where a
step is **not** evidenced by the code it is marked `INFERRED` and called out rather
than drawn as fact.

Source of the diagram: the fenced `mermaid` block below. `devdocs/scripts/render_mermaid.py`
renders it with `mmdc`; a render is successful when the CLI exits 0.

```mermaid
sequenceDiagram
    autonumber
    participant SPA as osb-portal SPA
    participant API as workspaces API
    participant SVC as WorkspaceService
    participant DB as PostgreSQL
    participant K8S as Kubernetes API
    participant ARGO as Argo Workflows
    participant PVC as workspace PVC
    participant SCAN as scan task
    participant KAFKA as Kafka queue osb-update-workspace-resources

    Note over SPA,KAFKA: 1. Create
    SPA->>API: POST /workspace body
    API->>SVC: WorkspaceService.post(body)
    SVC->>SVC: if user_id not in body then user_id = keycloak_user_id()
    SVC->>SVC: check_max_num_workspaces_per_user(user_id)
    SVC->>SVC: user_has_realm_role(user_id, admin)
    alt non-admin and quota reached
        SVC-->>API: NotAllowed
        API-->>SPA: error response
    end
    SVC->>DB: repository.post(to_dao(body))
    DB-->>SVC: workspace with id
    SVC->>SVC: ensure_volume(workspace)
    SVC->>SVC: get_workspace_volume_size then get_pvc_size(keycloak_user_id())
    SVC->>K8S: create_volume(name=workspace-id, size=quota)
    K8S-->>PVC: create if missing, idempotent
    loop each workspace resource with status p and an origin
        SVC->>SVC: WorkspaceresourceService.handle_resource_data(resource)
        SVC->>SVC: copy_workspace_resource then copy_origins(workspace_id, origins, folder)
        alt origin has osbrepository_id
            SVC->>SVC: osbrepository_service.create_copy_task
        else download origin
            SVC->>SVC: workflow.create_copy_task image workflows-extract-download
        end
    end
    SVC->>ARGO: workflow.run_copy_tasks(workspace_id, tasks)
    Note right of ARGO: SimpleDagOperation osb-copy-tasks-job, shared_directory workspace-id:/project_download:rwx, tasks plus create_scan_task(workspace_id)
    ARGO->>PVC: copy task writes the resources
    ARGO->>SCAN: scan task, image workspaces-scan-workspace
    SCAN->>KAFKA: publish resource listing
    KAFKA->>DB: events.update_workspace_resources persist resource rows
    SVC-->>API: workspace DTO
    API-->>SPA: 200 with workspace, resources still pending

    Note over SPA,ARGO: 2. Poll
    SPA->>API: GET /workspace/id
    API->>SVC: WorkspaceService.get(id)
    SVC->>SVC: BaseModelService.get then is_authorized(workspace)
    alt a resource still has status p
        SVC->>SVC: append synthetic resource id -1, Importing resources into workspace
    else
        SVC->>ARGO: get_workspace_workflows(workspace_id) status Running
        ARGO-->>SVC: workflows whose template label workspace equals id
        SVC->>SVC: append synthetic resource, Importing resources, progress N of M
    end
    SVC-->>API: workspace DTO
    API-->>SPA: 200, portal re-polls

    Note over ARGO,DB: 3. Rescan
    ARGO->>SCAN: scan task as a step of the same DAG
    alt copy succeeded
        SCAN->>KAFKA: published resource listing
    else copy failed or pod killed
        Note over SCAN,KAFKA: no scan output from a failed step, so the workspace stays p or stale
    end
    KAFKA->>DB: update_workspace_resources(workspace_id, resources)
    SPA->>API: next GET /workspace/id shows the scanned resources

    Note over SPA,ARGO: 4. Cancel by delete
    SPA->>API: DELETE /workspace/id
    API->>SVC: WorkspaceService.delete(id)
    SVC->>DB: delete each resource, then the workspace
    SVC->>K8S: delete_persistent_volume_claim(workspace-id)
    SVC->>SVC: remove the workspace files under STATIC_DIR
    Note over SVC,ARGO: INFERRED gap, no Argo terminate call on this path, so an already-submitted import is not cancelled by delete
```

## Hop table

| # | Hop | Evidence (file:symbol / line) | Notes |
| --- | --- | --- | --- |
| 1 | SPA -> API `POST /workspace` | `applications/workspaces/api/openapi.yaml` (route/collection), handler reached through `applications/workspaces/server/workspaces/controllers/workspace_controller.py` | The sibling run route is documented as `POST /workspace/{id}/run` (`workspace_run_controller.py:107`), which fixes the collection style. |
| 2 | API -> `WorkspaceService.post` | `applications/workspaces/server/workspaces/service/crud_service.py:211-224` | Decorated `@send_event(message_type="workspace", operation="create")`, so creation also emits a Kafka workspace event. |
| 3 | default `user_id` | `crud_service.py:213-214` | `body['user_id'] = keycloak_user_id()` only when absent. |
| 4 | quota check | `crud_service.py:186-199` (`check_max_num_workspaces_per_user`) | Searches the user's workspaces (`repository.search(user_id=...).total`) against `get_max_workspaces_for_user` (`workspaces/service/user_quota_service.py`), raising `NotAllowed` past the limit. It gates on `role="admin"` (`:191`) while every other check uses `role="administrator"` -- see the inconsistency noted in `devdocs/auth-model.md`. |
| 5 | DB insert | `crud_service.py:217`, `BaseModelService.post` at `:132-136` | `to_dao` validates through the model (`WorkspaceService.to_dao`, `:378-387`) and resolves tags. |
| 6 | volume sizing | `crud_service.py:230-244` (`get_workspace_volume_size`, `ensure_volume`), `workspaces/service/user_quota_service.py` (`get_pvc_size`) | Sized from the **calling** user's quota, not the workspace owner's. `create_volume` is idempotent, so a migrated workspace without a volume is repaired here. |
| 7 | per-resource dispatch | `crud_service.py:221-222`, `workspaces/helpers/etl_helpers.py:48-53` (`copy_workspace_resource`), `:15-45` (`copy_origins`) | Only resources with `status == ResourceStatus.P` and an `origin` are copied (`etl_helpers.py:49`). |
| 8 | OSB-repository origin | `etl_helpers.py:20-34` -> `osbrepository_service.create_copy_task` (`workspaces/service/osbrepository.py`) | Uses `origins[0].osbrepository_id`; the result may be a task or a list of tasks. |
| 9 | download origin | `etl_helpers.py:35-44` -> `workflow.create_copy_task` (`workspaces/service/workflow.py:75-82`) | Default image is `workflows-extract-download`; folder is the resource's parent folder (`etl_helpers.py:56-61`). |
| 10 | workflow submission | `workspaces/service/workflow.py:48-60` (`run_copy_tasks`) | `SimpleDagOperation("osb-copy-tasks-job", tasks, (create_scan_task(workspace_id),), shared_directory="<pvc>:/project_download:rwx", pod_context=PodExecutionContext("workspace", workspace_id, required=True))`. |
| 11 | scan task | `workflow.py:63-72` (`create_task`), `:85-91` (`create_scan_task`) | Image `workspaces-scan-workspace`, `queue=events.UPDATE_WORKSPACES_RESOURCE_QUEUE`. |
| 12 | scan consumer | `applications/workspaces/server/workspaces/controllers/events.py:8-9`, `:12-27` (`update_workspace_resources`, `_consumer_queues`), `:30-36` (`start_kafka_consumers`) | Queue name is `osb-update-workspace-resources`, group `workspaces`; the handler strips the `/project_download/` mount prefix before persisting (`events.py:15-17`). |
| 13 | polling read | `crud_service.py:389-439` (`WorkspaceService.get`), `:138-143` (`BaseModelService.get`) | `is_authorized` is evaluated twice: in `BaseModelService.get` and again in `WorkspaceService.get`. |
| 14 | pending resource | `crud_service.py:395-406` | Any resource with `ResourceStatus.P` short-circuits to a synthetic `id: -1` resource named "Importing resources into workspace". |
| 15 | running-workflow progress | `crud_service.py:408-437` -> `:201-209` (`get_workspace_workflows`) | Lists Argo workflows with `status="Running", limit=9999` and keeps those whose `spec.templates[0].metadata.labels["workspace"]` equals the workspace id; the synthetic resource reads `workflow.raw.status.progress` and replaces `/` with " of " (`:414-415`). Attribute errors are swallowed so a non-import workflow does not fail the read (`:428-437`). |
| 16 | rescan on success | `workflow.py:48-60` + `events.py:12-27` | The scan is a normal step of the copy DAG, so it runs after the copy tasks succeed. |
| 17 | rescan on failure / kill | **INFERRED gap**: `run_copy_tasks` (`workflow.py:48-60`) uses `SimpleDagOperation`, not an `onExit` handler | The exit-handler variant exists only for notebook runs (`PipelineScannedOnExit`, `workflow.py:138-154`, used by `RunNotebooksPipeline`, `:176-183`, `:225-234`). For workspace import, a failed copy step therefore produces no scan output and statuses can stay `p`; treat the failed-import rescan as unverified, not as designed behaviour. |
| 18 | cancel by delete | `crud_service.py:445-464` (`WorkspaceService.delete`) | Deletes each workspace resource (`:449-452`), the workspace row (`:454`), the PVC via `delete_persistent_volume_claim(f"workspace-{id}")` (`:457`) and the static folder (`:460-464`). |
| 19 | cancellation of a running import | **INFERRED gap**: no Argo terminate/delete call appears in `WorkspaceService.delete` or anywhere in `workspaces/service/workflow.py` (235 lines, read in full) | Cancelling a running import workflow is not implemented on the delete path as far as this repository's code shows; do not document a `delete_workflow` hop without a symbol to cite. |

## Notes on the edges of this flow

- **Two "anonymous" sentinels.** The import flow is owner-scoped (the resources belong to
the workspace), but the identity helpers differ: `workspaces/utils.py:11-21`
(`get_keycloak_data`) yields `keycloak_id = -1` with no bearer, while
`workspaces/service/auth.py:27-36` (`keycloak_user_id`) yields `None`. A workspace
created without a valid bearer therefore gets `user_id = None`.
- **Volume readiness is checked elsewhere.** The import path creates the PVC
(`ensure_volume`); the blocking "is it bound?" check is on the run path
(`ensure_volume_ready`, `crud_service.py:282-303`, surfaced as
`{"error": "volume_not_ready"}`, 503 by `workspace_controller.py:135-139`). Note that
503 is *not* an auth signal.
- **The event is emitted before the work is done.** `post` carries
`@send_event(message_type="workspace", operation="create")`, so the workspace-create
event fires around the same call that submits the copy workflow; consumers must not
assume the volume is already populated when they see it.
- **Polling cost.** Each poll of a workspace with no pending resource costs one Argo
list (`get_workflows(status="Running", limit=9999)`) plus one Keycloak role lookup in
`is_authorized` (for non-public, non-owned workspaces).
