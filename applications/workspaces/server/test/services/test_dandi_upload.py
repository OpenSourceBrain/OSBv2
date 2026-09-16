"""Tests for the EMBER-DANDI write-side adapter (IDP-43).

Focused on the branching that actually bit us during live development against the real archive:
the two 409 paths (content already uploaded / asset already registered) and error surfacing.
The happy paths are thin wrappers over `requests` and are covered incidentally.

Mirrors test_dandi_adapter.py's setup: `responses` for HTTP mocking, CH_VALUES_PATH so
cloudharness config resolves.
"""
import os

import pytest
import responses

from workspaces.service.osbrepository.adapters import dandi_upload

HERE = os.path.dirname(os.path.realpath(__file__))
os.environ["CH_VALUES_PATH"] = os.path.join(os.path.dirname(HERE), "values.yaml")

API = dandi_upload.DANDI_API_BASE
DANDISET = dandi_upload.DANDI_DANDISET_ID

ETAG = "0" * 32 + "-1"
BLOB_ID = "11111111-1111-1111-1111-111111111111"
ASSET_ID = "22222222-2222-2222-2222-222222222222"


@pytest.fixture(autouse=True)
def _no_real_secret(monkeypatch):
    """The admin key is a mounted k8s secret that does not exist in a test environment."""
    monkeypatch.setattr(dandi_upload, "get_dandi_api_key", lambda: "test-token")


@responses.activate
def test_initialize_upload_returns_parts():
    responses.add(
        responses.POST,
        f"{API}/uploads/initialize/",
        json={"upload_id": "up-1", "parts": [{"part_number": 1, "size": 10, "upload_url": "https://s3/part1"}]},
        status=200,
    )

    result = dandi_upload.initialize_upload(size=10, dandi_etag=ETAG)

    assert result["upload_id"] == "up-1"
    assert len(result["parts"]) == 1
    assert result["parts"][0]["upload_url"] == "https://s3/part1"


@responses.activate
def test_initialize_upload_409_resolves_existing_blob():
    """A 409 means the archive already holds this exact content — not an error. We resolve the
    existing blob so the caller can skip the S3 upload entirely and just register a new asset."""
    responses.add(responses.POST, f"{API}/uploads/initialize/", json={}, status=409)
    responses.add(responses.POST, f"{API}/blobs/digest/", json={"blob_id": BLOB_ID}, status=200)

    result = dandi_upload.initialize_upload(size=10, dandi_etag=ETAG)

    assert result["blob_id"] == BLOB_ID
    assert result["upload_id"] is None
    assert result["parts"] == []


@responses.activate
def test_initialize_upload_409_without_matching_blob_raises():
    """409 but the digest lookup finds nothing — genuinely inconsistent, must not pass silently."""
    responses.add(responses.POST, f"{API}/uploads/initialize/", json={}, status=409)
    responses.add(responses.POST, f"{API}/blobs/digest/", json={}, status=404)

    with pytest.raises(RuntimeError, match="no blob matches digest"):
        dandi_upload.initialize_upload(size=10, dandi_etag=ETAG)


@responses.activate
def test_register_asset_409_falls_back_to_existing():
    """Registering the same path twice (a retry after a later step failed) must be idempotent
    rather than an error — otherwise a single transient failure poisons that path forever."""
    path = "task-x/sub-y/f.zip"
    assets_url = f"{API}/dandisets/{DANDISET}/versions/draft/assets/"

    responses.add(responses.POST, assets_url, json={}, status=409)
    responses.add(
        responses.GET,
        assets_url,
        json={"results": [{"asset_id": ASSET_ID, "path": path}]},
        status=200,
    )

    asset = dandi_upload.register_asset(path=path, blob_id=BLOB_ID)

    assert asset["asset_id"] == ASSET_ID
    assert asset["path"] == path


@responses.activate
def test_get_asset_by_path_requires_an_exact_match():
    """The ?path= filter is not assumed to return exact matches only, so this re-checks each
    result — a near-miss must resolve to None rather than being mistaken for ours, since the
    caller uses it to decide an upload was already registered."""
    path = "task-x/sub-y/f.zip"
    responses.add(
        responses.GET,
        f"{API}/dandisets/{DANDISET}/versions/draft/assets/",
        json={"results": [{"asset_id": ASSET_ID, "path": path + ".extra"}]},
        status=200,
    )

    assert dandi_upload.get_asset_by_path(path) is None


@responses.activate
def test_errors_surface_the_response_body():
    """raise_for_status() alone discards DANDI's explanation, which turns every 4xx into a
    guessing game. The body is the whole reason these failures are debuggable."""
    responses.add(
        responses.POST,
        f"{API}/uploads/initialize/",
        json={"non_field_errors": ["Digest improperly formatted"]},
        status=400,
    )

    with pytest.raises(RuntimeError, match="Digest improperly formatted"):
        dandi_upload.initialize_upload(size=10, dandi_etag=ETAG)
