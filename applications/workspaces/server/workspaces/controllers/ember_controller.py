"""Uploads into EMBER-DANDI with a key held on a Keycloak user, for clients that don't hold one themselves.

The file's bytes go from the client to S3 directly, through presigned part URLs, never through this
server: a 500 MB recording costs this process a few hundred bytes of JSON. These endpoints make the
EMBER-DANDI calls that need the key (service/ember_credentials.py):

1. POST /ember/get_upload_urls: reserve the upload, return the part URLs.
2. (client) PUT each part to S3.
3. POST /ember/validate_upload: complete the multipart upload, validate the blob, register the
   asset. One call, so a half-finished upload can't leave an asset pointing at an unvalidated blob.

The client names the dandiset and the Keycloak user whose key signs the upload; OSB doesn't know
what either is for. The asset path is built here from the caller's identity, so one caller can't
register over another caller's files. Importing the asset into a workspace is a separate, ordinary
POST /workspaceresource with its download URL.
"""
import uuid

from cloudharness import log as logger
from werkzeug.utils import secure_filename

from workspaces.models.ember_upload_urls_request import EmberUploadUrlsRequest
from workspaces.models.ember_upload_urls_response import EmberUploadUrlsResponse
from workspaces.models.ember_upload_part import EmberUploadPart
from workspaces.models.ember_validate_upload_request import EmberValidateUploadRequest
from workspaces.models.ember_validate_upload_response import EmberValidateUploadResponse
from workspaces.service import ember_credentials
from workspaces.service.auth import keycloak_user_id
from workspaces.service.ember_credentials import EmberKeyMissing, EmberKeyUnavailable
from workspaces.service.osbrepository.adapters import ember_upload


class _NotAuthenticated(Exception):
    pass


class _RequestInvalid(Exception):
    pass


class _Forbidden(Exception):
    pass


def _caller_sub() -> str:
    """The caller's Keycloak id (`sub`), as the other controllers get it."""
    sub = keycloak_user_id()
    if not sub:
        raise _NotAuthenticated("Not authorized")
    return sub


def _asset_path(sub: str, filename: str) -> str:
    """`<caller id>/<upload id>/<filename>`: the only place an asset path is built, never taken from
    the request. secure_filename drops any `../` or `/` from the client's filename (so it can't add
    segments) and any character DANDI rejects in a path, such as `@`. The caller id is a UUID."""
    return f"{sub}/{uuid.uuid4()}/{secure_filename(filename) or 'unnamed'}"


def _assert_path_owned_by_caller(path: str, sub: str) -> None:
    """validate_upload only echoes back the path get_upload_urls returned. Check it still sits under
    the caller's own segment before anything is registered, with no extra segments."""
    segments = (path or "").split("/")
    if len(segments) != 3 or segments[0] != sub:
        raise _Forbidden(f"The path does not belong to the caller: {path!r}")


def _assert_all_parts(parts: list) -> None:
    """Part numbers must be exactly 1..N. A missing part would complete a truncated file, which
    only fails later, at validation, with a less useful message."""
    numbers = sorted(p["part_number"] for p in parts)
    if numbers != list(range(1, len(numbers) + 1)):
        raise _RequestInvalid(f"parts must be numbered 1..{len(numbers)} with none missing; got {numbers}")


def _require(request, *fields: str) -> None:
    """The generated models don't enforce `required` (a missing key is just skipped), so check here,
    before anything is looked up: a missing field is the client's mistake, a 400."""
    missing = [f for f in fields if getattr(request, f, None) in (None, "")]
    if missing:
        raise _RequestInvalid(f"Missing required field(s): {', '.join(missing)}")


def _handle(impl, body):
    try:
        return impl(body)
    except _NotAuthenticated as exc:
        return str(exc), 401
    except (_RequestInvalid, ValueError) as exc:  # ValueError: a required field missing, from the models
        return str(exc), 400
    except _Forbidden as exc:
        logger.warning("EMBER upload refused: %s", exc)
        return str(exc), 403
    except EmberKeyMissing as exc:
        # Ours to fix, not the caller's: the details go to the log (and Sentry), not the response.
        logger.error("EMBER upload misconfigured: %s", exc)
        return "EMBER-DANDI uploads are not available right now", 503
    except EmberKeyUnavailable as exc:
        logger.error("EMBER upload unavailable: %s", exc)
        return "EMBER-DANDI uploads are not available right now", 503
    except ember_upload.EmberError as exc:
        logger.error("EMBER-DANDI call failed: %s", exc)
        return str(exc), 502


def get_upload_urls(body):
    """POST /ember/get_upload_urls: reserves an upload into the given dandiset, returns presigned S3 part URLs."""
    return _handle(_get_upload_urls, body)


def _get_upload_urls(body):
    request = EmberUploadUrlsRequest.from_dict(body)
    _require(request, "username", "dandiset_id", "filename", "size", "dandi_etag")
    sub = _caller_sub()
    path = _asset_path(sub, request.filename)
    init = ember_upload.initialize_upload(
        ember_credentials.ember_api_key(request.username), request.dandiset_id, request.size, request.dandi_etag
    )
    # On the deduplicated path there is no upload_id and no parts, just the existing blob_id: the
    # client skips the S3 upload and goes straight to validate_upload.
    return EmberUploadUrlsResponse(
        dandiset_id=request.dandiset_id,
        upload_id=init.get("upload_id"),
        path=path,
        parts=[EmberUploadPart(part_number=p["part_number"], url=p["upload_url"]) for p in init["parts"]],
        blob_id=init.get("blob_id"),
    )


def validate_upload(body):
    """POST /ember/validate_upload: completes, validates and registers the upload as an asset."""
    return _handle(_validate_upload, body)


def _validate_upload(body):
    request = EmberValidateUploadRequest.from_dict(body)
    _require(request, "username", "dandiset_id", "path")
    sub = _caller_sub()
    _assert_path_owned_by_caller(request.path, sub)
    api_key = ember_credentials.ember_api_key(request.username)

    if request.blob_id:
        # Deduplicated: the content was already in the archive, so nothing was uploaded and
        # there is nothing to complete or validate; just attach a new asset to the blob.
        blob_id = request.blob_id
    else:
        if not request.upload_id or not request.parts:
            raise _RequestInvalid("upload_id and parts are required when blob_id is not set")
        parts = [{"part_number": p.part_number, "size": p.size, "etag": p.etag} for p in request.parts]
        _assert_all_parts(parts)
        ember_upload.complete_upload(api_key, request.upload_id, parts)
        # validate_upload is what turns the completed multipart upload into a real AssetBlob.
        blob_id = ember_upload.validate_upload(api_key, request.upload_id)["blob_id"]

    asset = ember_upload.register_asset(api_key, request.dandiset_id, request.path, blob_id)
    return EmberValidateUploadResponse(
        asset_id=asset["asset_id"],
        asset_path=asset["path"],
        dandiset_id=request.dandiset_id,
        dandiset_url=ember_upload.dandiset_url(request.dandiset_id),
        download_url=ember_upload.asset_download_url(asset["asset_id"]),
    ), 201
