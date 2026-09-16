"""Uploads data INTO EMBER-DANDI (write side).

`dandiadapter.py` in this same package is the read side — it lists/imports existing dandisets
from the *public* DANDI archive (hardcoded api.dandiarchive.org), read-only, no admin key. This
module is the write-side counterpart, against EMBER-DANDI specifically, and is the only code
holding the admin key.
"""
import os

import requests
from cloudharness.utils.secrets import get_secret

# Set out-of-band via `kubectl create secret generic workspaces --from-literal=dandi-api-key=...`
# (deploy/values.yaml declares this secret as unmanaged — `manager: null` — specifically so
# CloudHarness never renders/overwrites it).
_DANDI_API_KEY_SECRET_NAME = "dandi-api-key"

# EMBER-DANDI is a separate dandi-archive deployment from the public archive, with its own API
# root that its web UI never advertises.
DANDI_API_BASE = os.environ.get("WORKSPACES_DANDI_API_BASE", "https://api-dandi.emberarchive.org/api")
DANDI_DANDISET_ID = os.environ.get("WORKSPACES_DANDI_DANDISET_ID", "000533")  # arc-idp-test

# The digest key DANDI stores and echoes back in asset metadata.
_DANDI_ETAG_ALGORITHM = "dandi:dandi-etag"


def get_dandi_api_key() -> str:
    """Never log the return value."""
    return get_secret(_DANDI_API_KEY_SECRET_NAME).strip()


def _headers():
    return {"Authorization": f"token {get_dandi_api_key()}"}


def _check(resp, what: str):
    """raise_for_status() alone discards DANDI's explanation of *why* a call failed, which
    turns every 4xx into a guessing game. Always surface the response body."""
    if not resp.ok:
        raise RuntimeError(f"DANDI {what} failed: HTTP {resp.status_code} — {resp.text[:1000]}")
    return resp


def get_blob_by_digest(dandi_etag: str) -> dict | None:
    """POST /blobs/digest/ — returns the existing AssetBlob for this content, or None.

    DANDI separates blobs (content-addressed, deduplicated archive-wide) from assets (a path
    + metadata pointing at a blob), so identical content uploaded twice is one blob with two
    assets. This is how we resolve the blob when initialize_upload reports it already exists.
    """
    resp = requests.post(
        f"{DANDI_API_BASE}/blobs/digest/",
        headers=_headers(),
        json={"algorithm": _DANDI_ETAG_ALGORITHM, "value": dandi_etag},
    )
    if resp.status_code == 404:
        return None
    _check(resp, "get_blob_by_digest")
    return resp.json()


def initialize_upload(size: int, dandi_etag: str) -> dict:
    """POST /uploads/initialize/ — returns {upload_id, parts: [{part_number, size, upload_url}]}.

    Reserves space for content only; the asset path is not part of this call and is supplied
    later, at `register_asset`. `dandi_etag` must already be in DANDI's S3-multipart format
    (`<32-hex>-<part count>`), computed client-side since bytes never reach here.

    A 409 here is not a failure: it means this exact content is already in the archive, so there
    is nothing to transfer. We resolve the existing blob and return `{"blob_id": ...}` with no
    parts, letting the caller skip straight to registering a new asset against it.
    """
    resp = requests.post(
        f"{DANDI_API_BASE}/uploads/initialize/",
        headers=_headers(),
        json={
            "contentSize": size,
            "dandiset": DANDI_DANDISET_ID,
            "digest": {"algorithm": _DANDI_ETAG_ALGORITHM, "value": dandi_etag},
        },
    )
    if resp.status_code == 409:
        blob = get_blob_by_digest(dandi_etag)
        if not blob:
            raise RuntimeError(
                f"DANDI reported the blob already exists (409) but no blob matches digest {dandi_etag}"
            )
        return {"upload_id": None, "parts": [], "blob_id": blob["blob_id"]}

    _check(resp, "initialize_upload")
    return resp.json()


def complete_upload(upload_id: str, parts: list) -> dict:
    """POST /uploads/{upload_id}/complete/, then POST the returned presigned S3
    CompleteMultipartUpload request ourselves — the browser never sees this step.

    `parts` is [{part_number, size, etag}], `etag` being what S3 returned for each part PUT.
    Returns the completion response body from S3 (not currently parsed further).
    """
    resp = requests.post(
        f"{DANDI_API_BASE}/uploads/{upload_id}/complete/",
        headers=_headers(),
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


def validate_upload(upload_id: str) -> dict:
    """POST /uploads/{upload_id}/validate/ — returns AssetBlob: {blob_id, etag, size, sha256}."""
    resp = requests.post(f"{DANDI_API_BASE}/uploads/{upload_id}/validate/", headers=_headers())
    _check(resp, "validate_upload")
    return resp.json()


def register_asset(path: str, blob_id: str) -> dict:
    """POST the completed blob into the dandiset's draft version as a new asset.

    The collection endpoint only supports GET/POST — PUT is for updating a specific existing
    asset at `.../assets/{asset_id}/`. AssetRequest only requires `metadata`, and `path` goes
    *inside* it rather than being a top-level field. Metadata is deliberately minimal here; real
    asset metadata (subject, session, etc.) is not populated yet.
    """
    resp = requests.post(
        f"{DANDI_API_BASE}/dandisets/{DANDI_DANDISET_ID}/versions/draft/assets/",
        headers=_headers(),
        json={"metadata": {"path": path}, "blob_id": blob_id},
    )
    if resp.status_code == 409:
        # Already registered at this path — almost always a retry after a later step (the
        # workspace-attach calls) failed. Reuse it rather than failing, so finalize is idempotent.
        existing = get_asset_by_path(path)
        if existing:
            return existing
    _check(resp, f"register_asset(path={path!r})")
    return resp.json()


def get_asset_by_path(path: str) -> dict | None:
    """GET the asset at an exact path in the draft version, or None."""
    resp = requests.get(
        f"{DANDI_API_BASE}/dandisets/{DANDI_DANDISET_ID}/versions/draft/assets/",
        headers=_headers(),
        params={"path": path},
    )
    _check(resp, f"get_asset_by_path(path={path!r})")
    for asset in resp.json().get("results", []):
        if asset.get("path") == path:
            return asset
    return None


def dandiset_url() -> str:
    return f"https://dandi.emberarchive.org/dandiset/{DANDI_DANDISET_ID}/draft"
