"""Uploads into a DANDI deployment for clients that don't hold its key.

1. POST /dandi/get_upload_urls: reserve the upload, return the S3 part URLs.
2. The client PUTs each part to S3 itself; the bytes never pass through OSB.
3. POST /dandi/validate_upload: complete, validate and register the asset, in one call so a
   half-finished upload never leaves an asset pointing at an unvalidated blob.

OSB builds the asset path from the caller's id, so no caller can write over another's files.
"""
import uuid

from cloudharness import log as logger
from werkzeug.utils import secure_filename

from workspaces.models.dandi_upload_urls_request import DandiUploadUrlsRequest
from workspaces.models.dandi_upload_urls_response import DandiUploadUrlsResponse
from workspaces.models.dandi_upload_part import DandiUploadPart
from workspaces.models.dandi_validate_upload_request import DandiValidateUploadRequest
from workspaces.models.dandi_validate_upload_response import DandiValidateUploadResponse
from workspaces.service import dandi_credentials
from workspaces.service.auth import keycloak_user_id
from workspaces.service.dandi_credentials import DandiKeyMissing, DandiKeyUnavailable
from workspaces.service.osbrepository.adapters import dandi_upload


class _NotAuthenticated(Exception):
    pass


class _RequestInvalid(Exception):
    pass


class _Forbidden(Exception):
    pass


def _caller_sub() -> str:
    sub = keycloak_user_id()
    if not sub:
        raise _NotAuthenticated("Not authorized")
    return sub


def _asset_path(sub: str, filename: str) -> str:
    """Built here, never taken from the request, so a caller can't write over another's files.
    secure_filename strips `../`, `/` and characters DANDI rejects, such as `@`."""
    return f"{sub}/{uuid.uuid4()}/{secure_filename(filename) or 'unnamed'}"


def _assert_path_owned_by_caller(path: str, sub: str) -> None:
    """validate_upload echoes back the path get_upload_urls returned: it must still be the caller's."""
    segments = (path or "").split("/")
    if len(segments) != 3 or segments[0] != sub:
        raise _Forbidden(f"The path does not belong to the caller: {path!r}")


def _assert_all_parts(parts: list) -> None:
    """A missing part would complete a truncated file, which only fails later, less clearly."""
    numbers = sorted(p["part_number"] for p in parts)
    if numbers != list(range(1, len(numbers) + 1)):
        raise _RequestInvalid(f"parts must be numbered 1..{len(numbers)} with none missing; got {numbers}")


def _handle(impl, body):
    try:
        return impl(body)
    except _NotAuthenticated as exc:
        return str(exc), 401
    except (_RequestInvalid, ValueError) as exc:  # ValueError: raised by the generated models
        return str(exc), 400
    except _Forbidden as exc:
        logger.warning("DANDI upload refused: %s", exc)
        return str(exc), 403
    except DandiKeyMissing as exc:
        # Ours to fix, not the caller's: details go to the log (and Sentry) only.
        logger.error("DANDI upload misconfigured: %s", exc)
        return "DANDI uploads are not available right now", 503
    except DandiKeyUnavailable as exc:
        logger.error("DANDI upload unavailable: %s", exc)
        return "DANDI uploads are not available right now", 503
    except dandi_upload.DandiError as exc:
        logger.error("DANDI call failed: %s", exc)
        return str(exc), 502


def get_upload_urls(body):
    return _handle(_get_upload_urls, body)


def _get_upload_urls(body):
    # The spec checks the request's fields (required, enum, pattern) before this runs.
    request = DandiUploadUrlsRequest.from_dict(body)
    api_url = dandi_upload.DANDI_API_URLS[request.instance]
    dandiset_id = request.dandiset_id
    sub = _caller_sub()
    path = _asset_path(sub, request.filename)
    init = dandi_upload.initialize_upload(
        api_url, dandi_credentials.dandi_api_key(request.username), dandiset_id, request.size, request.dandi_etag
    )
    # When the deployment already has the content: no upload_id or parts, just its blob_id.
    return DandiUploadUrlsResponse(
        dandiset_id=dandiset_id,
        upload_id=init.get("upload_id"),
        path=path,
        parts=[DandiUploadPart(part_number=p["part_number"], url=p["upload_url"]) for p in init["parts"]],
        blob_id=init.get("blob_id"),
    )


def validate_upload(body):
    return _handle(_validate_upload, body)


def _validate_upload(body):
    # The spec checks the request's fields (required, enum, pattern) before this runs.
    request = DandiValidateUploadRequest.from_dict(body)
    api_url = dandi_upload.DANDI_API_URLS[request.instance]
    dandiset_id = request.dandiset_id
    sub = _caller_sub()
    _assert_path_owned_by_caller(request.path, sub)
    api_key = dandi_credentials.dandi_api_key(request.username)

    if request.blob_id:
        # The deployment already had the content: nothing to complete or validate.
        blob_id = request.blob_id
    else:
        if not request.upload_id or not request.parts:
            raise _RequestInvalid("upload_id and parts are required when blob_id is not set")
        parts = [{"part_number": p.part_number, "size": p.size, "etag": p.etag} for p in request.parts]
        _assert_all_parts(parts)
        upload_id = request.upload_id
        dandi_upload.complete_upload(api_url, api_key, upload_id, parts)
        blob_id = dandi_upload.validate_upload(api_url, api_key, upload_id)["blob_id"]

    asset = dandi_upload.register_asset(api_url, api_key, dandiset_id, request.path, blob_id)
    return DandiValidateUploadResponse(
        asset_id=asset["asset_id"],
        asset_path=asset["path"],
        dandiset_id=dandiset_id,
        download_url=dandi_upload.asset_download_url(api_url, asset["asset_id"]),
    ), 201
