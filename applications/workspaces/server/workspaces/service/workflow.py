import uuid

from cloudharness import log as logger

import workspaces.persistence as repos
import workspaces.controllers.events as events
from workspaces.service.crud_service import WorkspaceService

try:
    from cloudharness.workflows import operations, tasks
    from cloudharness.workflows.argo_service import get_workflows
except Exception as e:
    logger.error(
        "Cannot start workflows module. Probably this is related some problem with the kubectl configuration", e
    )

ttl_strategy: dict = {
    'secondsAfterCompletion': 60 * 60,
    'secondsAfterSuccess': 60 * 20,
    'secondsAfterFailure': 60 * 60 * 24 * 7  # one week
}


def delete_resource(workspace_resource, pvc_name, resource_path: str):
    logger.info(
        f"Delete workspace resource with id: {workspace_resource.id}, path: {resource_path}")
    shared_directory = f"{pvc_name}:/project_download"

    delete_task = tasks.CommandBasedTask(
        name="osb-delete-resource", command=["rm", "-Rf", "project_download/" + resource_path]
    )
    scan_task = create_scan_task(workspace_resource.workspace_id)

    op = operations.PipelineOperation(
        basename="osb-delete-resource-job",
        tasks=(
            delete_task,
            scan_task,
        ),
        shared_directory=shared_directory,
        ttl_strategy=ttl_strategy,
        pod_context=operations.PodExecutionContext(
            "workspace", workspace_resource.workspace_id, True),
    )
    workflow = op.execute()


def run_copy_tasks(workspace_id, tasks):
    pvc_name = WorkspaceService.get_pvc_name(workspace_id)
    shared_directory = f"{pvc_name}:/project_download:rwx"
    op = operations.SimpleDagOperation(
        f"osb-copy-tasks-job",
        tasks,
        (create_scan_task(workspace_id),),
        shared_directory=shared_directory,
        ttl_strategy=ttl_strategy,
        pod_context=operations.PodExecutionContext(
            "workspace", workspace_id, required=True),
    )
    workflow = op.execute()


def create_task(image_name, workspace_id, **kwargs):
    pvc_name = WorkspaceService.get_pvc_name(workspace_id)
    shared_directory = f"{pvc_name}:/project_download:rwx"
    return tasks.CustomTask(
        name=f"{image_name}-{str(uuid.uuid4())[:8]}",
        image_name=image_name,
        shared_directory=shared_directory,
        workspace_id=workspace_id,
        **kwargs,
    )


def create_copy_task(workspace_id, folder, image_name="workflows-extract-download", **kwargs):
    if not kwargs.get("url", None):
        kwargs["url"] = kwargs["path"]
    return create_task(
        image_name=image_name, 
        workspace_id=workspace_id, 
        folder=folder or '',
        **kwargs)


def create_scan_task(workspace_id, **kwargs):
    return create_task(
        image_name="workspaces-scan-workspace",
        workspace_id=workspace_id,
        queue=events.UPDATE_WORKSPACES_RESOURCE_QUEUE,
        **kwargs,
    )

def clone_workspaces_content(source_ws_id, dest_ws_id):
    source_pvc_name = WorkspaceService.get_pvc_name(source_ws_id)
    dest_pvc_name = WorkspaceService.get_pvc_name(dest_ws_id)
    source_volume = f"{source_pvc_name}:/source"
    dest_volume = f"{dest_pvc_name}:/project_download:rwx"

    copy_task = tasks.BashTask(
        name=f"clone-workspace-data",
        source="sleep 1 && cp -R /source/* /project_download && chown -R 1000:1000 /project_download"
    )

    scan_task = create_scan_task(dest_ws_id)

    op = operations.PipelineOperation(
        basename="osb-clone-workspace-job",
        tasks=(
            copy_task,
            scan_task,
        ),
        ttl_strategy=ttl_strategy,
        pod_context=operations.PodExecutionContext(
            "workspace", dest_ws_id, True),
    )
    op.volumes=(source_volume, dest_volume)
    workflow = op.execute()

# ── Notebook runs ────────────────────────────────────────────────────────
# A run executes the notebooks it is given, in order, with papermill in an Argo pod that mounts the
# workspace volume. Submitted like the copy tasks, with the same `workspace` pod context: next to the
# workspace's lab pod if one runs, and without one otherwise.
#
# The pod runs in OSB's JupyterLab image (chosen by the controller), so the notebooks get its environment;
# the script that runs them, the one the request picks (checked by the controller), isn't in that
# image but mounted from its ConfigMap, workspaces-<script> (deploy/templates/run-notebook-configmap.yaml).

RUN_NOTEBOOKS_BASENAME = "osb-run-notebooks-job"
RUN_NOTEBOOKS_SCRIPT_VOLUME = "run-notebooks-script"
RUN_NOTEBOOKS_SCRIPT_DIR = "/opt/run-notebooks"


class PipelineScannedOnExit(operations.PipelineOperation):
    """A pipeline whose workspace scan is Argo's exit handler: it runs however the pipeline ended
    (failed, or its pod killed, included), and the workflow keeps the pipeline's own phase."""

    def __init__(self, basename, tasks, scan_task, *args, **kwargs):
        self.scan_task = scan_task
        super().__init__(basename, tasks, *args, **kwargs)

    def task_list(self):
        # Listed with the tasks (not a step of the pipeline) so its template is defined and gets the
        # shared directory's volume and `shared_directory` variable like theirs.
        return list(self.tasks) + [self.scan_task]

    def spec(self):
        spec = super().spec()
        spec["onExit"] = self.scan_task.instance()["template"]
        return spec


def run_notebooks(workspace_id, run: dict) -> str:
    """Submits the run and returns at once with the workflow name, which is the run id. `run` holds
    the checked request (workspace_run_controller.run_notebooks); paths are the caller's."""

    class RunNotebooksTask(tasks.CustomTask):
        # Third-party code runs here: leave out the Keycloak secret and allvalues mounts CloudHarness
        # adds to every task (a mounted file can't be hidden from inside the pod). run.sh clears
        # the CH_* variables. Mount run.sh instead.
        def cloudharness_configmap_spec(self):
            return [m for m in super().cloudharness_configmap_spec()
                    if m["name"] not in ("cloudharness-kc-accounts", "cloudharness-allvalues")] + [
                {"name": RUN_NOTEBOOKS_SCRIPT_VOLUME, "mountPath": RUN_NOTEBOOKS_SCRIPT_DIR, "readOnly": True}]

    class RunNotebooksPipeline(PipelineScannedOnExit):
        # The workflow declares the volumes its tasks mount; CloudHarness only adds its own and PVCs.
        def spec(self):
            spec = super().spec()
            spec["volumes"].append(
                {"name": RUN_NOTEBOOKS_SCRIPT_VOLUME, "configMap": {"name": f"workspaces-{run['script']}"}})
            return spec

    # Lists go one path per line (the controller rejects newlines in paths).
    env = {
        "repo_dir": run["repo_dir"],
        "project_dir": run["project_dir"],
        "notebooks": "\n".join(run["notebooks"]),
        "executed_notebooks_dir": run["executed_notebooks_dir"],
        "log_file": run["log_file"],
        "requirements": run["requirements"],
        "python_path": "\n".join(run["python_path"]),
        "install": "\n".join(run["install"]),
        "input_dir": run["input_dir"],
        "output_dir": run["output_dir"],
    }
    task = RunNotebooksTask(
        name=f"run-notebooks-{str(uuid.uuid4())[:8]}",
        image_name=run["image"],  # an application's name: its image, as this deployment builds it
        command=["bash", f"{RUN_NOTEBOOKS_SCRIPT_DIR}/run.sh"],
        retry_limit=0,  # notebooks aren't safe to re-run blindly
        resources=run["resources"],  # the owner's quotas (user_quota_service.get_run_resources)
        run_id="{{workflow.name}}",  # filled in by Argo; run.sh logs it
        **{name: value for name, value in env.items() if value},
    )
    op = RunNotebooksPipeline(
        basename=RUN_NOTEBOOKS_BASENAME,
        tasks=(task,),
        # Then rescan, as the copy workflows do, so the workspace's resources list the executed
        # notebooks (in notebooks/ or notebooks.failed/); on exit, so a failed run is rescanned too.
        scan_task=create_scan_task(workspace_id),
        shared_directory=f"{WorkspaceService.get_pvc_name(workspace_id)}:/project_download:rwx",
        ttl_strategy=ttl_strategy,
        pod_context=operations.PodExecutionContext("workspace", workspace_id, required=True),
    )
    return op.execute().name

