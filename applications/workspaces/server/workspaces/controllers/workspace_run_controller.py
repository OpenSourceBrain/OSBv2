import posixpath

from cloudharness import log as logger
from cloudharness.utils.config import CloudharnessConfig

from workspaces.models.workspace_run_setup import WorkspaceRunSetup
from workspaces.models.workspace_run_request import WorkspaceRunRequest
from workspaces.models.workspace_run_response import WorkspaceRunResponse
from workspaces.service import workflow as workflow_service
from workspaces.service.auth import keycloak_user_id
from workspaces.service.crud_service import WorkspaceService
from workspaces.service.user_quota_service import get_max_concurrent_notebook_runs, get_notebook_run_resources


class InvalidPath(ValueError):
    pass


class InvalidImage(ValueError):
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


# Without an image in the request, runs use OSB's JupyterLab, the environment users get in their
# workspaces. A deployment without it (a local one: it isn't built there) uses the minimal one.
DEFAULT_NOTEBOOK_RUN_IMAGE = "jupyterlab"
MINIMAL_NOTEBOOK_RUN_IMAGE = "jupyterlab-minimal"


def get_notebook_run_image_registries() -> list:
    """Registries a run's image may come from besides OSB's workspace applications (deploy/values.yaml,
    notebook_run_image_registries): images built outside OSB's release, so a notebook's environment can
    change without an OSB update."""
    registries = CloudharnessConfig.get_configuration()["apps"]["workspaces"].get("notebook_run_image_registries")
    return [registry.rstrip("/") + "/" for registry in registries or [] if registry]


def get_notebook_run_image(requested) -> str:
    """The image the notebooks run in. Without one requested, the default. Otherwise the requested one, if
    allowed: a workspace application deployed here (one JupyterHub runs) or an image from
    notebook_run_image_registries. The run executes the repository's code in it."""
    if requested is None:
        deployed = {app["name"] for app in CloudharnessConfig.get_applications().values()}
        return DEFAULT_NOTEBOOK_RUN_IMAGE if DEFAULT_NOTEBOOK_RUN_IMAGE in deployed else MINIMAL_NOTEBOOK_RUN_IMAGE
    workspace_apps = {app["name"] for app in CloudharnessConfig.get_application_by_filter(harness__jupyterhub=True)}
    registries = get_notebook_run_image_registries()
    if requested in workspace_apps or any(requested.startswith(registry) for registry in registries):
        return requested
    raise InvalidImage(f"image must be a workspace application ({', '.join(sorted(workspace_apps))})"
                       f" or an image under {' or '.join(registries) or '(no registry configured)'}")


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


def _concurrent_runs_error(workspace):
    """An error response if the workspace already has a run going, or its owner as many as their quota
    allows (each run's pod gets the owner's full CPU/memory quota); otherwise None."""
    running = workflow_service.get_notebook_run_workspaces()
    if workspace.id in running:
        return "A notebook run is already in progress in this workspace", 409
    repository = WorkspaceService().repository
    owners = [getattr(repository.get(ws_id), "user_id", None) for ws_id in running]  # deleted: None
    max_runs = get_max_concurrent_notebook_runs(workspace.user_id)
    if owners.count(workspace.user_id) >= max_runs:
        return f"At most {max_runs} notebook runs can be in progress at once", 409
    return None


def run_notebooks(id_, body):
    """POST /workspace/{id}/run"""
    request = WorkspaceRunRequest.from_dict(body)
    setup = request.setup or WorkspaceRunSetup()
    try:
        run = {
            "repo_dir": check_relative_path("repo.dir", request.repo.dir),
            "notebooks": [check_notebook(notebook) for notebook in request.notebooks or []],
            "requirements": check_relative_path("setup.requirements", setup.requirements) if setup.requirements else None,
            "python_path": [check_relative_path("setup.python_path", folder) for folder in setup.python_path or []],
            "install": [check_install(candidate) for candidate in setup.install or []],
            "input_dir": check_relative_path("input_dir", request.input_dir) if request.input_dir else None,
            "output_dir": check_relative_path("output_dir", request.output_dir),
            "executed_notebooks_dir": check_relative_path("results.notebooks", request.results.notebooks),
            "log_file": check_relative_path("results.log", request.results.log),
            "image": get_notebook_run_image(request.image),
        }
        if not run["notebooks"]:
            raise InvalidPath("notebooks must list at least one notebook")
        # The notebooks' project is the folder the repository was imported into (the run's folder):
        # the run copies the repository's files there. Never the whole workspace.
        run["project_dir"] = posixpath.dirname(run["repo_dir"])
        if not run["project_dir"]:
            raise InvalidPath("repo.dir must be inside a folder (the run's), not at the workspace's top level")
    except (InvalidPath, InvalidImage) as exc:
        return str(exc), 400

    workspace, error = _owned_workspace(id_)
    if error:
        return error
    error = _concurrent_runs_error(workspace)
    if error:
        return error
    # Third-party code: the run's pod is sized by the owner's quotas, as their lab pod is.
    run["resources"] = get_notebook_run_resources(workspace.user_id)

    run_id = workflow_service.run_notebooks(workspace.id, run)
    logger.info("Submitted notebook run %s in workspace %s: %d notebooks from %s, image %s",
                run_id, workspace.id, len(run["notebooks"]), run["repo_dir"], run["image"])
    return WorkspaceRunResponse(workflow=run_id), 202
