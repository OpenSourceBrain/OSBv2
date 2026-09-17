"""Brokers browser uploads into EMBER-DANDI, then attaches the result to a workspace and runs
the selected protocol's analysis script in it.

These endpoints exist so the file's bytes can go browser -> S3 directly via presigned part
URLs, never through this server: a 500 MB recording costs this process a few hundred bytes of
JSON. The DANDI admin key stays server-side and never reaches the browser, which is why the
upload has to be brokered here rather than called from the frontend.
"""
import re

import connexion
from cloudharness import log as logger

from workspaces.models.upload_finalize_request import UploadFinalizeRequest
from workspaces.models.upload_finalize_response import UploadFinalizeResponse
from workspaces.models.upload_init_request import UploadInitRequest
from workspaces.models.upload_init_response import UploadInitResponse
from workspaces.models.upload_part import UploadPart
from workspaces.service import jupyter_kernel_client
from workspaces.service.auth import keycloak_user_id
from workspaces.service.crud_service import NotAllowed, NotAuthorized, NotFoundException, WorkspaceService
from workspaces.service.osbrepository.adapters import dandi_upload


def _bearer_token() -> str:
    """The caller's raw access token. Needed verbatim (not just the decoded claims) because
    JupyterHub's `/hub/chkclogin` reads it from a cookie — see jupyter_kernel_client."""
    header = connexion.request.headers.get("Authorization", "")
    return header.split(" ", 1)[1] if header.lower().startswith("bearer ") else header


def _current_user_id() -> str:
    """The keycloak user id of the caller — also the JupyterHub username, since the hub's
    `chauthenticator` does `user_from_username(user_data['sub'])`."""
    user_id = keycloak_user_id()
    if not user_id:
        raise NotAuthorized("Could not resolve the current user from the request token")
    return user_id


def _path_safe(value: str) -> str:
    """Makes an identity usable as a DANDI asset path segment.

    DANDI rejects `@` with `400 {"non_field_errors":["Path improperly formatted"]}`, while `.`,
    `-` and `_` are all accepted. Matters whenever the identity falls back to an email-shaped
    username. Also the only thing standing between a client-supplied `filename` and a `../`
    path-traversal segment — every `/` it might contain is replaced too.
    """
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "-", value or "")
    return cleaned.strip("-._") or "unknown"


def _build_asset_path(task_id: str, sub: str, filename: str) -> str:
    """The only place allowed to construct a DANDI asset path. Every segment goes through
    `_path_safe`, so an unset `task_id` or a `filename` containing `../` can't produce a path
    outside `task-*/sub-<caller>/`."""
    return f"task-{_path_safe(task_id)}/sub-{_path_safe(sub)}/{_path_safe(filename)}"


def _assert_path_owned_by_caller(path: str, sub: str) -> None:
    """`finalize`'s request carries no `task_id`/`filename` to re-derive the path from — it only
    echoes back the `path` `init` returned. So instead of trusting that echo outright, check it
    still sits under the caller's own `sub-<id>` segment before anything is registered under the
    one shared DANDI admin key. Also rejects any extra `/` segments a doctored `path` might add.
    """
    segments = path.split("/")
    if len(segments) != 3 or segments[1] != f"sub-{_path_safe(sub)}":
        raise NotAllowed(f"path does not belong to the current user: {path!r}")


def dandi_upload_init(body):
    """POST /dandi/upload/init — reserve an upload in DANDI, hand back presigned S3 part URLs."""
    try:
        return _dandi_upload_init(body)
    except NotAuthorized as exc:
        return str(exc) or "Not authorized", 401
    except NotAllowed as exc:
        return str(exc) or "Not allowed", 405
    except NotFoundException as exc:
        return str(exc) or "Not found", 404


def _dandi_upload_init(body):
    upload_init_request = UploadInitRequest.from_dict(body)

    # Path is derived server-side from the caller's identity, never taken from the request body.
    # With one shared admin key, this is what stops one collaborator overwriting another's data.
    path = _build_asset_path(upload_init_request.task_id, _current_user_id(), upload_init_request.filename)

    init_response = dandi_upload.initialize_upload(
        size=upload_init_request.size,
        dandi_etag=upload_init_request.dandi_etag,
    )

    # On the deduplicated path init_response carries no upload_id and no parts, just the
    # existing blob_id — the client skips the S3 upload and goes straight to finalize.
    return UploadInitResponse(
        upload_id=init_response.get("upload_id"),
        path=path,
        blob_id=init_response.get("blob_id"),
        parts=[
            UploadPart(part_number=p["part_number"], url=p["upload_url"])
            for p in init_response["parts"]
        ],
    )


def dandi_upload_finalize(body):
    """POST /dandi/upload/finalize — complete the DANDI upload, create/attach the workspace,
    then run the protocol script in it.

    Synchronous end to end: this does NOT return until the script has finished, which makes the
    request minutes-long in the worst case — the ingress/gunicorn timeouts in deploy/values.yaml
    are set accordingly. See jupyter_kernel_client's docstring.
    """
    try:
        return _dandi_upload_finalize(body)
    except NotAuthorized as exc:
        return str(exc) or "Not authorized", 401
    except NotAllowed as exc:
        return str(exc) or "Not allowed", 405
    except NotFoundException as exc:
        return str(exc) or "Not found", 404


def _dandi_upload_finalize(body):
    upload_finalize_request = UploadFinalizeRequest.from_dict(body)
    sub = _current_user_id()
    _assert_path_owned_by_caller(upload_finalize_request.path, sub)

    if upload_finalize_request.blob_id:
        # Deduplicated: the content was already in the archive, so no upload happened and
        # there is nothing to complete or validate — just attach a new asset to the blob.
        blob_id = upload_finalize_request.blob_id
    else:
        if not upload_finalize_request.parts:
            return "parts is required when blob_id is not set", 400
        parts = [
            {"part_number": p.part_number, "size": p.size, "etag": p.etag}
            for p in upload_finalize_request.parts
        ]
        dandi_upload.complete_upload(upload_finalize_request.upload_id, parts)
        # validate_upload is what turns the completed multipart upload into a real AssetBlob in
        # DANDI — required even though we no longer read the size off it.
        blob_id = dandi_upload.validate_upload(upload_finalize_request.upload_id)["blob_id"]

    asset = dandi_upload.register_asset(upload_finalize_request.path, blob_id)

    # ── Workspace: in-process, no HTTP hop ────────────────────────────────────────────────
    # WorkspaceService.post() fills user_id from the current token itself and provisions the
    # PVC synchronously (create_volume in the same call), so by the time this returns the
    # workspace volume exists and can be written to.
    #
    # The data is deliberately NOT copied onto that volume: the protocol script fetches it
    # straight from DANDI at run time, so a PVC copy would move the same bytes twice and leave a
    # second permanent copy of every dataset behind. The workspace holds only the script and its
    # outputs. Re-adding the copy means re-adding both the OSBRepository row and copy_origins()
    # together — they are a pair, not independent steps.
    workspace_id = upload_finalize_request.workspace_id
    if workspace_id is None:
        # `description` is REQUIRED by the Workspace schema alongside `name` — omitting it fails
        # validation in WorkspaceService.post with MalformedModelDictionaryError, not with a
        # helpful message about the missing field.
        workspace_name = upload_finalize_request.workspace_name or upload_finalize_request.path
        workspace = WorkspaceService().post({
            "name": workspace_name,
            "description": workspace_name,
        })
        workspace_id = workspace.id
    else:
        # An existing workspace_id is client-supplied, so confirm it's both real and the
        # caller's own before spawning a pod and mounting its PVC — otherwise any id gets a
        # spawn/execute inside (and a read mount of) whatever workspace happens to own it.
        workspace_service = WorkspaceService()
        existing = workspace_service.repository.get(workspace_id)
        if existing is None:
            raise NotFoundException(f"Workspace with id {workspace_id} not found.")
        if not workspace_service.is_authorized(existing):
            raise NotAuthorized()

    # ── Run the protocol script ───────────────────────────────────────────────────────────
    # Best-effort: the data is already in DANDI and the workspace already exists by this point,
    # so a failure here should not report a successful upload as failed — it surfaces as
    # script_output explaining what went wrong instead.
    script_output = None
    if upload_finalize_request.script_url:
        try:
            script_output = jupyter_kernel_client.run_script_in_workspace(
                token=_bearer_token(),
                user_id=sub,
                workspace_id=workspace_id,
                script_url=upload_finalize_request.script_url,
                script_name=upload_finalize_request.script_name or "analysis.py",
                asset_path=asset["path"],
                dandiset_id=dandi_upload.DANDI_DANDISET_ID,
            )
        except Exception as exc:  # noqa: BLE001 — see comment above
            logger.error("Script run failed (the upload itself succeeded)", exc_info=True)
            script_output = f"Uploaded to DANDI, but the script did not run: {exc}"

    return UploadFinalizeResponse(
        asset_path=asset["path"],
        dandiset_url=dandi_upload.dandiset_url(),
        workspace_id=workspace_id,
        script_output=script_output,
    )
