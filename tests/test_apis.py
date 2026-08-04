"""
Smoke tests to verify external APIs are up and responding.

These tests check that the APIs we depend on (GitHub, Dandi, Figshare, BioModels)
are reachable and returning valid responses with the expected fields.

If an API response structure changes, these tests will fail and alert us.

Run with: pytest tests/test_apis.py -v
Skip network tests: pytest tests/test_apis.py -v -m "not network"
"""

import pytest
import requests


TIMEOUT = 10  # seconds


@pytest.mark.network
def test_github_api():
    """Test GitHub API is reachable and returns valid repository info."""
    url = "https://api.github.com/repos/OpenSourceBrain/OSBv2"
    response = requests.get(url, timeout=TIMEOUT)
    assert response.status_code == 200
    data = response.json()
    # Fields accessed by GitHubAdapter
    assert "name" in data
    assert data["name"] == "OSBv2"
    assert "default_branch" in data


@pytest.mark.network
def test_github_api_branches():
    """Test GitHub branches endpoint returns expected fields."""
    url = "https://api.github.com/repos/OpenSourceBrain/OSBv2/branches?per_page=5"
    response = requests.get(url, timeout=TIMEOUT)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # Fields accessed by GitHubAdapter.get_contexts()
    assert "name" in data[0]


@pytest.mark.network
def test_github_api_tags():
    """Test GitHub tags endpoint returns expected fields."""
    url = "https://api.github.com/repos/OpenSourceBrain/OSBv2/tags?per_page=5"
    response = requests.get(url, timeout=TIMEOUT)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Fields accessed by GitHubAdapter.get_contexts()
    if data:
        assert "name" in data[0]


@pytest.mark.network
def test_github_api_tree():
    """Test GitHub git tree endpoint returns expected fields."""
    url = "https://api.github.com/repos/OpenSourceBrain/OSBv2/git/trees/develop?recursive=1"
    response = requests.get(url, timeout=TIMEOUT)
    assert response.status_code == 200
    data = response.json()
    # Fields accessed by GitHubAdapter.get_resources()
    assert "tree" in data
    assert isinstance(data["tree"], list)
    assert len(data["tree"]) > 0
    tree_item = data["tree"][0]
    assert "path" in tree_item
    assert "sha" in tree_item


@pytest.mark.network
def test_dandi_api():
    """Test Dandi API is reachable and returns valid dandiset info."""
    url = "https://api.dandiarchive.org/api/dandisets/000029"
    response = requests.get(url, timeout=TIMEOUT)
    assert response.status_code == 200
    data = response.json()
    # Fields accessed by DandiAdapter.get_info()
    assert "identifier" in data
    assert data["identifier"] == "000029"
    assert "most_recent_published_version" in data
    assert "draft_version" in data


@pytest.mark.network
def test_dandi_api_versions():
    """Test Dandi versions endpoint returns expected fields."""
    url = "https://api.dandiarchive.org/api/dandisets/000029/versions/"
    response = requests.get(url, timeout=TIMEOUT)
    assert response.status_code == 200
    data = response.json()
    # Fields accessed by DandiAdapter.get_contexts()
    assert "results" in data
    assert isinstance(data["results"], list)
    assert len(data["results"]) > 0
    version = data["results"][0]
    assert "version" in version


@pytest.mark.network
def test_dandi_api_version_info():
    """Test Dandi version info endpoint returns expected fields."""
    # First get a version
    versions_url = "https://api.dandiarchive.org/api/dandisets/000029/versions/"
    versions_response = requests.get(versions_url, timeout=TIMEOUT)
    assert versions_response.status_code == 200
    version = versions_response.json()["results"][0]["version"]

    # Then get info for that version
    url = f"https://api.dandiarchive.org/api/dandisets/000029/versions/{version}/info/"
    response = requests.get(url, timeout=TIMEOUT)
    assert response.status_code == 200
    data = response.json()
    # Fields accessed by DandiAdapter._get_dandi_info()
    assert "metadata" in data
    metadata = data["metadata"]
    assert "keywords" in metadata
    assert "description" in metadata


@pytest.mark.network
def test_dandi_api_assets():
    """Test Dandi assets/paths endpoint returns expected fields."""
    url = "https://api.dandiarchive.org/api/dandisets/000029/versions/draft/assets/paths/?path_prefix="
    response = requests.get(url, timeout=TIMEOUT)
    assert response.status_code == 200
    data = response.json()
    # Fields accessed by DandiAdapter.__retrieve_folder_contents()
    assert "results" in data
    assert isinstance(data["results"], list)
    assert len(data["results"]) > 0
    asset = data["results"][0]
    assert "path" in asset
    assert "asset" in asset
    assert "aggregate_size" in asset


@pytest.mark.network
def test_figshare_api():
    """Test Figshare API is reachable and returns valid article info."""
    url = "https://api.figshare.com/v2/articles/31292986"
    response = requests.get(url, timeout=TIMEOUT)
    assert response.status_code == 200
    data = response.json()
    # Fields accessed by FigShareAdapter.get_info()
    assert "title" in data
    assert "id" in data
    assert "tags" in data
    assert "description" in data


@pytest.mark.network
def test_figshare_api_versions():
    """Test Figshare versions endpoint returns expected fields."""
    url = "https://api.figshare.com/v2/articles/31292986/versions"
    response = requests.get(url, timeout=TIMEOUT)
    assert response.status_code == 200
    data = response.json()
    # Fields accessed by FigShareAdapter.get_contexts()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "version" in data[0]


@pytest.mark.network
def test_figshare_api_files():
    """Test Figshare files endpoint returns expected fields."""
    url = "https://api.figshare.com/v2/articles/31292986/files?page=1&page_size=10"
    response = requests.get(url, timeout=TIMEOUT)
    assert response.status_code == 200
    data = response.json()
    # Fields accessed by FigShareAdapter.get_resources()
    assert isinstance(data, list)
    assert len(data) > 0
    file = data[0]
    assert "name" in file
    assert "download_url" in file
    assert "size" in file


@pytest.mark.network
def test_biomodels_api():
    """Test BioModels API is reachable and returns valid model info."""
    url = "https://www.ebi.ac.uk/biomodels/BIOMD0000000001"
    response = requests.get(url, params={"format": "json"}, timeout=TIMEOUT)
    assert response.status_code == 200
    data = response.json()
    # Fields accessed by BiomodelsAdapter.get_info() and get_contexts()
    assert "name" in data
    assert len(data["name"]) > 0
    assert "description" in data
    assert "format" in data
    assert "name" in data["format"]
    assert "history" in data
    assert "revisions" in data["history"]
    assert isinstance(data["history"]["revisions"], list)
    assert len(data["history"]["revisions"]) > 0
    assert "version" in data["history"]["revisions"][0]


@pytest.mark.network
def test_biomodels_api_files():
    """Test BioModels files endpoint returns expected fields."""
    url = "https://www.ebi.ac.uk/biomodels/model/files/BIOMD0000000001.1"
    response = requests.get(url, params={"format": "json"}, timeout=TIMEOUT)
    assert response.status_code == 200
    data = response.json()
    # Fields accessed by BiomodelsAdapter._get_filelist()
    assert "main" in data or "additional" in data
    files = data.get("main", []) + data.get("additional", [])
    assert len(files) > 0
    file = files[0]
    assert "name" in file
    assert "fileSize" in file
