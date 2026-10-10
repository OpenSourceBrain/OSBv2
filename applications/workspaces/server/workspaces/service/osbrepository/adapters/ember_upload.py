"""Uploads data INTO EMBER-DANDI (write side).

`dandiadapter.py` in this package is the read side: it lists and imports existing dandisets from
the public DANDI archive (api.dandiarchive.org), with no key. This module is the write side, against
EMBER-DANDI. It holds no credentials of its own: every call
gets the API key (service/ember_credentials.py) and the dandiset to use.
"""
import mimetypes

import requests

# EMBER-DANDI is a separate dandi-archive deployment from the public archive.
EMBER_API_BASE = "https://api-dandi.emberarchive.org/api"
EMBER_WEB_BASE = "https://dandi.emberarchive.org"

# The digest key DANDI stores and echoes back in asset metadata.
_DANDI_ETAG_ALGORITHM = "dandi:dandi-etag"


class EmberError(RuntimeError):
    """An EMBER-DANDI or S3 call failed. The message carries the response body, never a key."""


def _headers(api_key: str) -> dict:
    return {"Authorization": f"token {api_key}"}


def _check(resp, what: str):
    """raise_for_status() alone discards DANDI's explanation of *why* a call failed, which
    turns every 4xx into a guessing game. Surface the response body (but never the request)."""
    if not resp.ok:
        raise EmberError(f"EMBER-DANDI {what} failed: HTTP {resp.status_code}: {resp.text[:1000]}")
    return resp


def get_blob_by_digest(api_key: str, dandi_etag: str) -> dict | None:
    """POST /blobs/digest/: returns the existing AssetBlob for this content, or None.

    DANDI separates blobs (content-addressed, deduplicated archive-wide) from assets (a path
    + metadata pointing at a blob), so identical content uploaded twice is one blob with two
    assets. This is how we resolve the blob when initialize_upload reports it already exists.
    """
    resp = requests.post(
        f"{EMBER_API_BASE}/blobs/digest/",
        headers=_headers(api_key),
        json={"algorithm": _DANDI_ETAG_ALGORITHM, "value": dandi_etag},
    )
    if resp.status_code == 404:
        return None
    _check(resp, "get_blob_by_digest")
    return resp.json()


def initialize_upload(api_key: str, dandiset_id: str, size: int, dandi_etag: str) -> dict:
    """POST /uploads/initialize/: returns {upload_id, parts: [{part_number, size, upload_url}]}.

    Reserves space for content only; the asset path is supplied later, at `register_asset`.
    `dandi_etag` must already be in DANDI's S3-multipart format (`<32-hex>-<part count>`),
    computed client-side since bytes never reach here.

    A 409 here is not a failure: it means this exact content is already in the archive, so there
    is nothing to transfer. We resolve the existing blob and return `{"blob_id": ...}` with no
    parts, letting the caller skip straight to registering a new asset against it.
    """
    resp = requests.post(
        f"{EMBER_API_BASE}/uploads/initialize/",
        headers=_headers(api_key),
        json={
            "contentSize": size,
            "dandiset": dandiset_id,
            "digest": {"algorithm": _DANDI_ETAG_ALGORITHM, "value": dandi_etag},
        },
    )
    if resp.status_code == 409:
        blob = get_blob_by_digest(api_key, dandi_etag)
        if not blob:
            raise EmberError(
                f"EMBER-DANDI reported the blob already exists (409) but no blob matches digest {dandi_etag}"
            )
        return {"upload_id": None, "parts": [], "blob_id": blob["blob_id"]}

    _check(resp, "initialize_upload")
    return resp.json()


def complete_upload(api_key: str, upload_id: str, parts: list) -> dict:
    """POST /uploads/{upload_id}/complete/, then POST the returned presigned S3
    CompleteMultipartUpload request ourselves; the client never sees this request.

    `parts` is [{part_number, size, etag}], `etag` being what S3 returned for each part PUT.
    """
    resp = requests.post(
        f"{EMBER_API_BASE}/uploads/{upload_id}/complete/",
        headers=_headers(api_key),
        json={"parts": parts},
    )
    _check(resp, "complete_upload")
    completion = resp.json()

    s3_resp = requests.post(
        completion["complete_url"],
        data=completion["body"],
        headers={"Content-Type": "text/xml"},
    )
    _check(s3_resp, "S3 complete-multipart")
    return {"status": s3_resp.status_code}


def validate_upload(api_key: str, upload_id: str) -> dict:
    """POST /uploads/{upload_id}/validate/: returns AssetBlob: {blob_id, etag, size, sha256}."""
    resp = requests.post(f"{EMBER_API_BASE}/uploads/{upload_id}/validate/", headers=_headers(api_key))
    _check(resp, "validate_upload")
    return resp.json()


def register_asset(api_key: str, dandiset_id: str, path: str, blob_id: str) -> dict:
    """POST the completed blob into the dandiset's draft version as a new asset.

    The collection endpoint takes POST (PUT updates one asset, at `.../assets/{asset_id}/`).
    `path` goes inside `metadata`, not at the top level.

    `schemaKey` and `encodingFormat` are the only fields the dandi-schema `Asset` model requires
    beyond those DANDI fills in itself (contentSize, digest, id, contentUrl); without them every
    asset fails validation with "'X' is a required property". Subject and session metadata are not
    set here.
    """
    encoding_format, _ = mimetypes.guess_type(path)
    resp = requests.post(
        f"{EMBER_API_BASE}/dandisets/{dandiset_id}/versions/draft/assets/",
        headers=_headers(api_key),
        json={
            "metadata": {
                "path": path,
                "schemaKey": "Asset",
                "encodingFormat": encoding_format or "application/octet-stream",
            },
            "blob_id": blob_id,
        },
    )
    if resp.status_code == 409:
        # Already registered at this path: almost always a retry after something later failed.
        # Reuse it rather than failing, so validate_upload is idempotent.
        existing = get_asset_by_path(api_key, dandiset_id, path)
        if existing:
            return existing
    _check(resp, f"register_asset(path={path!r})")
    return resp.json()


def get_asset_by_path(api_key: str, dandiset_id: str, path: str) -> dict | None:
    """GET the asset at an exact path in the draft version, or None."""
    resp = requests.get(
        f"{EMBER_API_BASE}/dandisets/{dandiset_id}/versions/draft/assets/",
        headers=_headers(api_key),
        params={"path": path},
    )
    _check(resp, f"get_asset_by_path(path={path!r})")
    for asset in resp.json().get("results", []):
        if asset.get("path") == path:
            return asset
    return None


def dandiset_url(dandiset_id: str) -> str:
    return f"{EMBER_WEB_BASE}/dandiset/{dandiset_id}/draft"


def asset_download_url(asset_id: str) -> str:
    """The asset's download endpoint (redirects to S3). Needs a key while the dandiset is embargoed."""
    return f"{EMBER_API_BASE}/assets/{asset_id}/download/"
