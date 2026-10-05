"""Runs a protocol repository's notebooks in a workspace (IDP-43, MAABCD).

`POST /workspace/{id}/run` submits an Argo workflow (`osb-run-notebooks-job`, task image
tasks/run-notebooks) and returns its name at once, like `POST /workspace/{id}/import` does for a
copy. The pod mounts the workspace volume and runs the notebooks it is given, in the order given,
with papermill; `GET /workspace/{id}/run/{workflow}` reports its state. Which notebooks, where the
input goes, how to set up the environment and which folders are the outputs are the caller's to
decide; the run uses the setup paths the repository has and skips the others.

The repository and the data are the workspace's own (imported with `POST /workspaceresource`), so
only the workspace's owner may run in it: a run executes that code with write access to the whole
volume. The pod gets no CloudHarness credentials (service/workflow.py).
"""
import posixpath
from datetime import datetime, timezone

from cloudharness import log as logger

from workspaces.models.workspace_run_request import WorkspaceRunRequest
from workspaces.models.workspace_run_response import WorkspaceRunResponse
from workspaces.models.workspace_run_status import WorkspaceRunStatus
# Not `workflow`: that's get_run's path parameter, which connexion passes by name.
from workspaces.service import workflow as workflow_service
from workspaces.service.auth import keycloak_user_id
from workspaces.service.crud_service import WorkspaceService

DEFAULT_OUTPUT_DIR = "results"


class InvalidPath(ValueError):
    pass


def check_relative_path(name: str, value: str) -> str:
    """Paths are joined onto the volume root in the run pod, so they must stay inside it."""
    # No newlines either: lists reach the run task one path per line.
    if not value or value.startswith("/") or any(c in value for c in "\\\0\n\r"):
        raise InvalidPath(f"{name} must be a path relative to the workspace root")
    if ".." in value.split("/"):
        raise InvalidPath(f"{name} must not contain '..'")
    normalized = posixpath.normpath(value)
    if normalized in (".", ""):
        raise InvalidPath(f"{name} must name a file or folder")
    return normalized


def check_notebook(value: str) -> str:
    notebook = check_relative_path("notebooks", value)
    if not notebook.endswith(".ipynb"):
        raise InvalidPath("notebooks must list .ipynb files")
    return notebook


def check_install(value: str) -> str:
    candidate = check_relative_path("install", value)
    if not candidate.endswith((".py", "pyproject.toml")):
        raise InvalidPath("install must list .py files or pyproject.toml")
    return candidate


def run_folder(name=None, now=None) -> str:
    """This run's results folder under output_dir: `run-[<name>-]<UTC timestamp>`, readable and in
    run order when listed. No `:` (not allowed in file names on Windows or in macOS Finder). Two runs
    of the same name in the same second would share it; run.sh refuses to write into an existing one."""
    stamp = (now or datetime.now(timezone.utc)).strftime("%Y-%m-%dT%H-%M-%SZ")
    return f"run-{name}-{stamp}" if name else f"run-{stamp}"


def _owned_workspace(workspace_id):
    """The workspace, if the caller owns it; otherwise (None, error response). Not
    WorkspaceService.is_authorized: that also lets anyone *read* a public workspace."""
    user_id = keycloak_user_id()
    if not user_id:
        return None, ("Not authorized", 401)
    workspace = WorkspaceService().repository.get(workspace_id)
    if workspace is None:
        return None, (f"Workspace with id {workspace_id} not found.", 404)
    if workspace.user_id != user_id:
        return None, ("Only the workspace's owner may run notebooks in it", 403)
    return workspace, None


def _workspace_label(run) -> str:
    """The workspace a run belongs to: the `workspace` label that PodExecutionContext puts on
    every template (the same label crud_service.get_workspace_workflows reads)."""
    try:
        return str(run.spec.templates[0].metadata.labels.get("workspace", "")).strip()
    except (AttributeError, IndexError, TypeError):
        return ""


def _failure_message(run) -> str:
    """The failed pod's message is the useful one (run.sh's termination message, e.g. which
    notebook failed); the workflow's own message only says which step failed."""
    status = run.status
    for node in (status.nodes or {}).values():
        if node.type == "Pod" and node.phase in ("Failed", "Error") and node.message:
            return node.message.strip()
    return status.message or "The run failed"



def run_notebooks(id_, body):
    """POST /workspace/{id}/run"""
    request = WorkspaceRunRequest.from_dict(body)
    try:
        repo_dir = check_relative_path("repo_dir", request.repo_dir)
        notebooks = [check_notebook(notebook) for notebook in request.notebooks or []]
        if not notebooks:
            raise InvalidPath("notebooks must list at least one notebook")
        input_path = check_relative_path("input_path", request.input_path) if request.input_path else None
        input_dir = check_relative_path("input_dir", request.input_dir) if request.input_dir else None
        if input_path and not input_dir:
            # The input reaches the notebooks only by being put in that folder.
            raise InvalidPath("input_dir is required with input_path")
        outputs = [check_relative_path("outputs", folder) for folder in request.outputs or []]
        setup = {
            "requirements": check_relative_path("requirements", request.requirements) if request.requirements else None,
            "python_path": [check_relative_path("python_path", folder) for folder in request.python_path or []],
            "install": [check_install(candidate) for candidate in request.install or []],
        }
        output_root = check_relative_path("output_dir", request.output_dir or DEFAULT_OUTPUT_DIR)
    except InvalidPath as exc:
        return str(exc), 400

    workspace, error = _owned_workspace(id_)
    if error:
        return error

    output_dir = f"{output_root}/{run_folder(request.name)}"
    run_id = workflow_service.run_notebooks(workspace.id, repo_dir, notebooks, output_dir,
                                            input_path=input_path, input_dir=input_dir, outputs=outputs, **setup)
    logger.info("Submitted notebook run %s in workspace %s (%s: %d notebooks -> %s)",
                run_id, workspace.id, repo_dir, len(notebooks), output_dir)
    return WorkspaceRunResponse(workflow=run_id, output_dir=output_dir), 202


def get_run(id_, workflow):
    """GET /workspace/{id}/run/{workflow}"""
    _workspace, error = _owned_workspace(id_)
    if error:
        return error
    not_found = f"Run {workflow} not found in workspace {id_}", 404

    run = workflow_service.get_run_workflow(workflow)
    if run is None or _workspace_label(run) != str(id_):
        return not_found

    # Argo's phase as is, like CloudHarness's workflows API; a just-submitted workflow has none yet.
    status = (run.status.phase if run.status else None) or "Pending"
    message = _failure_message(run) if status in ("Failed", "Error") else None
    return WorkspaceRunStatus(name=workflow, status=status, message=message)
