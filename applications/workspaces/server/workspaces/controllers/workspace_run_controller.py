"""Runs a protocol repository's notebooks in a workspace (IDP-43, MAABCD).

`POST /workspace/{id}/run` submits an Argo workflow (`osb-run-notebooks-job`, task image
tasks/run-notebooks) and returns its name at once, like `POST /workspace/{id}/import` does for a
copy. The pod mounts the workspace volume and runs the notebooks it is given, in the order given,
with papermill. While it runs, `GET /workspace/{id}` lists the "Refreshing resources" placeholder,
as for an import (crud_service.get_workspace_workflows). Which notebooks, where the
input goes, how to set up the environment, which folders are the outputs and the run's own folder
are the caller's to decide; the run uses the setup paths the repository has and skips the others.

The repository and the data are the workspace's own (imported with `POST /workspaceresource`), so
only the workspace's owner may run in it: a run executes that code with write access to the whole
volume. The pod gets no CloudHarness credentials (service/workflow.py).
"""
import posixpath

from cloudharness import log as logger

from workspaces.models.workspace_run_setup import WorkspaceRunSetup
from workspaces.models.workspace_run_request import WorkspaceRunRequest
from workspaces.models.workspace_run_response import WorkspaceRunResponse
from workspaces.service import workflow as workflow_service
from workspaces.service.auth import keycloak_user_id
from workspaces.service.crud_service import WorkspaceService

class InvalidPath(ValueError):
    pass


def check_relative_path(name: str, value: str) -> str:
    """Paths are joined onto the volume root in the run pod, so they must stay inside it."""
    # No newlines or tabs either: lists reach the run task one path (or tab-separated pair) per line.
    if not value or value.startswith("/") or any(c in value for c in "\\\0\n\r\t"):
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



def _copies(name, entries, source, target):
    """(source, target) path pairs of `inputs` or `outputs`, checked."""
    return [(check_relative_path(f"{name}.{source}", getattr(entry, source)),
             check_relative_path(f"{name}.{target}", getattr(entry, target)))
            for entry in entries or []]


def run_notebooks(id_, body):
    """POST /workspace/{id}/run"""
    request = WorkspaceRunRequest.from_dict(body)
    setup = request.setup or WorkspaceRunSetup()
    try:
        run = {
            "repo_dir": check_relative_path("repo.dir", request.repo.dir),
            "discard_repo": bool(request.repo.discard),
            "notebooks": [check_notebook(notebook) for notebook in request.notebooks or []],
            "requirements": check_relative_path("setup.requirements", setup.requirements) if setup.requirements else None,
            "python_path": [check_relative_path("setup.python_path", folder) for folder in setup.python_path or []],
            "install": [check_install(candidate) for candidate in setup.install or []],
            "inputs": _copies("inputs", request.inputs, "from_volume", "to_repo"),
            "outputs": _copies("outputs", request.outputs, "from_repo", "to_volume"),
            "executed_notebooks_dir": check_relative_path("results.notebooks", request.results.notebooks),
            "log_file": check_relative_path("results.log", request.results.log),
        }
        if not run["notebooks"]:
            raise InvalidPath("notebooks must list at least one notebook")
    except InvalidPath as exc:
        return str(exc), 400

    workspace, error = _owned_workspace(id_)
    if error:
        return error

    run_id = workflow_service.run_notebooks(workspace.id, run)
    logger.info("Submitted notebook run %s in workspace %s (%s: %d notebooks)",
                run_id, workspace.id, run["repo_dir"], len(run["notebooks"]))
    return WorkspaceRunResponse(workflow=run_id), 202

