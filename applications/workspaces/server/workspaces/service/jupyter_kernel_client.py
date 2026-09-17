"""Runs a script inside a workspace's JupyterLab server, from this backend, synchronously.

Authenticates the way JupyterHub's own browser client does: `/hub/chkclogin` reads the access
token from a `kc-access`/`accessToken` COOKIE, never a header (see chauthenticator/auth.py), so
this still has to do the cookie dance — just with `requests.Session` instead of a browser.
`WorkspaceService.post()` already provisions the PVC synchronously, so nothing here needs to
poll for the volume, only for the JupyterLab pod to start. Kernel execution has no REST
equivalent — only lifecycle (`POST`/`DELETE /api/kernels`) is REST; running code is always the
`/api/kernels/{id}/channels` WebSocket, since a kernel streams stdout over time rather than
returning once.

This runs inline inside the `dandi_upload_finalize` request and blocks until the script
finishes, rather than going through Argo. That makes the request minutes-long, so the
ingress/gunicorn timeouts (deploy/values.yaml) are raised to match and the budgets below are
kept under gunicorn's own TIMEOUT. Moving it to a workflow is the intended follow-up.
"""
import json
import logging
import os
import time
import uuid
from urllib.parse import urlsplit

import requests
import websocket  # websocket-client — already a workspaces/server dependency
from cloudharness.applications import get_configuration

logger = logging.getLogger(__name__)

# `script_url` is client-supplied and fetched server-side, from inside the cluster — an
# unrestricted GET here is SSRF, with the response handed straight back to the caller as
# script_output. Only hosts known to serve protocol scripts are allowed; anything else (in
# particular any cluster-internal hostname or IP) is refused before the request is made.
# Configurable per-deployment, since which hosts are legitimate depends on where the calling
# application publishes its protocol catalog.
ALLOWED_SCRIPT_HOSTS = frozenset(
    h.strip()
    for h in os.environ.get(
        "WORKSPACES_ALLOWED_SCRIPT_HOSTS", "gist.githubusercontent.com,raw.githubusercontent.com"
    ).split(",")
    if h.strip()
)

# The JupyterLab *application* whose named server we spawn. Its subdomain drives both values
# below, so keep them derived rather than hardcoded — they differ per environment.
#
# OSB ships two interchangeable JupyterLab apps and a deployment includes one or the other:
# `jupyterlab` (the full scientific image) and `jupyterlab-minimal`. They share a subdomain
# (`lab`, aliased to `notebooks`), so either answers the same URLs — but get_configuration()
# raises "Application X is not part of the current deployment" for whichever is absent. Try
# them in turn rather than assuming.
JUPYTER_APP_CANDIDATES = [
    n for n in [
        os.environ.get("WORKSPACES_JUPYTER_APP"),
        "jupyterlab",
        "jupyterlab-minimal",
    ] if n
]


def _jupyter_app():
    """The deployed JupyterLab application's configuration, whichever variant is present."""
    errors = []
    for name in JUPYTER_APP_CANDIDATES:
        try:
            return get_configuration(name)
        except Exception as exc:  # noqa: BLE001 — cloudharness raises a bare Exception subclass
            errors.append(f"{name}: {exc}")
    raise ScriptRunError(
        "No JupyterLab application found in this deployment; tried "
        + ", ".join(JUPYTER_APP_CANDIDATES)
        + ". Set WORKSPACES_JUPYTER_APP to the right app name. ("
        + " | ".join(errors) + ")"
    )


def _jupyter_base() -> str:
    """In-cluster URL of the JupyterLab app's proxy, from CloudHarness config.

    Deliberately the in-cluster SERVICE address (`get_service_address()`), NOT the public one
    (`get_public_address()`). This code always runs server-side, inside the `workspaces`
    pod, in the same cluster as JupyterHub's proxy — so it should talk to it directly, the way
    every other in-cluster caller does, rather than round-tripping out through the ingress. The
    public hostname can resolve back to the pod's own loopback via CoreDNS's default forwarding,
    failing every call outright — going through the public ingress from inside the cluster is
    the wrong direction regardless of environment.

    Overridable for the case where the hub is not part of this deployment at all and an
    in-cluster Service address genuinely does not exist.
    """
    override = os.environ.get("WORKSPACES_JUPYTER_BASE")
    if override:
        return override.rstrip("/")
    return _jupyter_app().get_service_address().rstrip("/")


def _public_host() -> str:
    """Hostname (no scheme) of the JupyterLab app's public address.

    cloud-harness's own `harness_jupyter.jupyterhub.change_pod_manifest` (and OSB's
    `osb_jupyterhub.change_pod_manifest`) both pick the singleuser pod's image and resource
    limits by string-splitting the incoming request's `Host` header on the deployment domain to
    recover a subdomain, then matching that subdomain against each app's configured
    `harness.subdomain`. That assumes every request to the hub arrives through the public
    ingress, carrying the public subdomain in `Host`.

    We deliberately connect to the in-cluster Service address instead (see `_jupyter_base()`),
    so the Host header the hub would otherwise see is the Service's own DNS name — which carries
    no subdomain to split out, leaving the hub on its default app config and spawning the stock
    sample image rather than the one this deployment wants.

    Fix: keep the working in-cluster connection, but send the real public hostname as an
    explicit `Host` header override, so the hub's own app-detection sees what it expects while
    the TCP connection still goes in-cluster.
    """
    override = os.environ.get("WORKSPACES_JUPYTER_PUBLIC_HOST")
    if override:
        return override
    from urllib.parse import urlparse
    return urlparse(_jupyter_app().get_public_address()).hostname


def _server_suffix() -> str:
    """The named-server suffix. OSB's own portal derives this as the first 4 characters of the
    application's subdomain — `application.subdomain.slice(0, 4)` in
    osb-portal/src/components/workspace/WorkspaceFrame.tsx. Mirrored here so both agree on the
    server name; if they disagree we would spawn a second, parallel server per workspace.

    The subdomain differs between branches — `lab` on develop (workspace 764 -> `764lab`),
    `notebooks` on master (-> `764note`) — hence deriving it rather than hardcoding either.
    """
    override = os.environ.get("WORKSPACES_JUPYTER_SERVER_SUFFIX")
    if override:
        return override
    return _jupyter_app().harness.subdomain[:4]


SPAWN_POLL_INTERVAL_S = 4
# These two must sum to less than the gunicorn worker timeout (Dockerfile: TIMEOUT=360), since
# this whole sequence runs inside one synchronous request. Deliberately fitted inside OSB's
# existing envelope rather than raising a setting shared by every other workspaces endpoint —
# if real spawns turn out slower than 180s, raise TIMEOUT there and these together.
DEFAULT_SPAWN_TIMEOUT_S = 180
DEFAULT_RUN_TIMEOUT_S = 150


class ScriptRunError(RuntimeError):
    pass


def run_script_in_workspace(
    token: str,
    user_id: str,
    workspace_id: int,
    script_url: str,
    script_name: str,
    asset_path: str | None = None,
    dandiset_id: str | None = None,
    spawn_timeout_s: int = DEFAULT_SPAWN_TIMEOUT_S,
    run_timeout_s: int = DEFAULT_RUN_TIMEOUT_S,
) -> str:
    """
    Spawns (or reuses) the workspace's JupyterLab server, writes the script into it, runs
    it, and returns everything it printed. Blocks for the whole duration — see module docstring.

    `asset_path` and `dandiset_id` are passed into the kernel as `ASSET_PATH`/`DANDISET_ID` env
    vars, which protocol scripts read in preference to any fallback of their own. Without them a
    script analyzes whatever it defaults to rather than the data just uploaded, and has to carry
    a dandiset ID in its own source to work at all.
    """
    base = _jupyter_base()
    server_name = f"{workspace_id}{_server_suffix()}"
    session = requests.Session()
    session.headers["Host"] = _public_host()

    script_text = _fetch_script(script_url)
    _trigger_spawn(session, base, token, user_id, workspace_id, server_name)
    _wait_until_ready(session, base, user_id, server_name, spawn_timeout_s)
    _put_text_file(session, base, user_id, server_name, script_name, script_text)
    return _run_script(session, base, user_id, server_name, script_name, run_timeout_s, asset_path, dandiset_id)


def _assert_script_url_allowed(script_url: str) -> None:
    parsed = urlsplit(script_url)
    if parsed.scheme != "https" or parsed.hostname not in ALLOWED_SCRIPT_HOSTS:
        raise ScriptRunError(f"script_url host is not on the allowlist: {script_url!r}")


def _fetch_script(script_url: str) -> str:
    _assert_script_url_allowed(script_url)
    resp = requests.get(script_url, timeout=30)
    if not resp.ok:
        raise ScriptRunError(f"Could not fetch script from {script_url!r}: HTTP {resp.status_code}")
    return resp.text


def _xsrf_for(session: requests.Session, user_id: str, server_name: str) -> str:
    """The `_xsrf` cookie scoped to this singleuser server's own path.

    Once `_is_ready()`'s page-URL warm-up has run once, the cookie jar holds TWO cookies both
    named `_xsrf` — Hub's own (path `/hub/`) and the singleuser server's own (path
    `/user/{user_id}/{server_name}/`), which is the one its CSRF check actually validates
    against. `session.cookies.get("_xsrf")` can't disambiguate same-named cookies on different
    paths and raises `CookieConflictError`, a `RequestException` subclass — every caller's
    `except requests.RequestException: return False` silently swallows it as "not ready yet" and
    polls forever. Pick the cookie whose path matches this server explicitly.
    """
    prefix = f"/user/{user_id}/{server_name}"
    for cookie in session.cookies:
        if cookie.name == "_xsrf" and (cookie.path or "").startswith(prefix):
            return cookie.value
    # Fall back to whatever's there (e.g. only Hub's own, before the per-server one exists yet).
    matches = [c.value for c in session.cookies if c.name == "_xsrf"]
    return matches[0] if matches else ""


def _is_ready(session: requests.Session, base: str, user_id: str, server_name: str) -> bool:
    # The Hub-level session cookie from chkclogin is NOT enough to call the singleuser server's
    # own API directly — JupyterHub fronts each spawned server with its own per-server OAuth
    # client, and a request lacking that server-specific token gets a flat `403 Forbidden: No
    # user identified` forever, never a redirect into the OAuth flow (that flow only triggers for
    # a plain *page* request, not an API path). A plain GET of the server's own page URL redirects
    # through /hub/api/oauth2/authorize -> consent -> callback and lands the per-server cookie,
    # after which the real API works — so touch the page URL first (cheap, idempotent), then
    # check readiness via the API.
    page_url = f"{base}/user/{user_id}/{server_name}/"
    try:
        session.get(page_url, timeout=15)
    except requests.RequestException as exc:
        logger.info("isReady: page-url warm-up transient error %s", exc)
        return False

    contents_url = f"{base}/user/{user_id}/{server_name}/api/contents/"
    xsrf = _xsrf_for(session, user_id, server_name)
    try:
        resp = session.get(contents_url, headers={"X-XSRFToken": xsrf}, timeout=15)
    except requests.RequestException as exc:
        logger.info("isReady: transient error %s", exc)
        return False
    return resp.ok and "application/json" in resp.headers.get("content-type", "")


def _trigger_spawn(session: requests.Session, base: str, token: str, user_id: str, workspace_id: int, server_name: str) -> None:
    # Mirrors the old browser client's triggerSpawn: chkclogin sets the Hub session cookie from
    # the accessToken cookie, then /hub/spawn reads the workspaceId cookie to mount the right
    # PVC. A `Session` persists both across this call and the next automatically.
    session.cookies.set("kc-access", token)
    session.cookies.set("accessToken", token)
    session.cookies.set("workspaceId", str(workspace_id))

    session.get(f"{base}/hub/chkclogin", params={"accessToken": token}, timeout=30)

    # If this named server is already running (e.g. the user has it open in a browser tab),
    # calling /hub/spawn unconditionally makes KubeSpawner kill and recreate an already-healthy
    # pod, and can race a concurrent spawn from the browser's own UI — leaving the Hub's
    # server-tracking state out of sync with the actual pod (contents API 424s indefinitely even
    # though the pod itself is fine). Skip the spawn call entirely when the server already answers.
    if _is_ready(session, base, user_id, server_name):
        return
    # No accessToken param here — including it would make nginx/the hub replace all cookies with
    # just accessToken, dropping workspaceId.
    session.get(f"{base}/hub/spawn/{user_id}/{server_name}", timeout=30)


def _wait_until_ready(session: requests.Session, base: str, user_id: str, server_name: str, timeout_s: int) -> None:
    deadline = time.monotonic() + timeout_s

    while time.monotonic() < deadline:
        if _is_ready(session, base, user_id, server_name):
            return
        # Anything else (spawn-pending HTML page, 403 before the per-server cookie lands,
        # 502/503 while the pod starts, a transient error) just means "not ready yet" — keep
        # polling.
        time.sleep(SPAWN_POLL_INTERVAL_S)

    raise ScriptRunError(f"Workspace server did not become ready within {timeout_s}s")


def _put_text_file(session: requests.Session, base: str, user_id: str, server_name: str, path: str, text: str) -> None:
    contents_url = f"{base}/user/{user_id}/{server_name}/api/contents/{path}"
    xsrf = _xsrf_for(session, user_id, server_name)
    resp = session.put(
        contents_url,
        headers={"X-XSRFToken": xsrf, "Content-Type": "application/json"},
        json={"name": path, "path": path, "type": "file", "format": "text", "content": text},
        timeout=30,
    )
    if not resp.ok:
        raise ScriptRunError(f"Writing {path} into the workspace failed: HTTP {resp.status_code} — {resp.text[:300]}")


def _run_script(session: requests.Session, base: str, user_id: str, server_name: str, script_path: str, timeout_s: int, asset_path: str | None = None, dandiset_id: str | None = None) -> str:
    xsrf = _xsrf_for(session, user_id, server_name)
    kernels_url = f"{base}/user/{user_id}/{server_name}/api/kernels"

    kernel_resp = session.post(
        kernels_url,
        headers={"X-XSRFToken": xsrf, "Content-Type": "application/json"},
        json={"name": "python3"},
        timeout=30,
    )
    if not kernel_resp.ok:
        raise ScriptRunError(f"Starting a kernel failed: HTTP {kernel_resp.status_code} — {kernel_resp.text[:300]}")
    kernel_id = kernel_resp.json()["id"]

    try:
        return _execute_over_websocket(session, base, user_id, server_name, kernel_id, script_path, timeout_s, asset_path, dandiset_id)
    finally:
        # Best-effort — the output already arrived; a leaked kernel is far less bad than
        # losing the result to a cleanup error.
        try:
            session.delete(
                f"{kernels_url}/{kernel_id}",
                headers={"X-XSRFToken": xsrf},
                timeout=15,
            )
        except requests.RequestException:
            pass


def _execute_over_websocket(
    session: requests.Session,
    base: str,
    user_id: str,
    server_name: str,
    kernel_id: str,
    script_path: str,
    timeout_s: int,
    asset_path: str | None = None,
    dandiset_id: str | None = None,
) -> str:
    session_id = uuid.uuid4().hex
    msg_id = uuid.uuid4().hex

    ws_url = (
        f"{base.replace('https://', 'wss://').replace('http://', 'ws://')}"
        f"/user/{user_id}/{server_name}/api/kernels/{kernel_id}/channels?session_id={session_id}"
    )
    cookie_header = "; ".join(f"{c.name}={c.value}" for c in session.cookies)

    ws = websocket.create_connection(
        ws_url,
        header=[f"Cookie: {cookie_header}", f"Host: {_public_host()}"],
        timeout=timeout_s,
    )

    # runpy rather than exec(open(...).read()) so `if __name__ == '__main__'` still fires, since
    # every protocol script's real work lives under that guard. ASSET_PATH/DANDISET_ID are set
    # first so resolve_asset_path() (argv, then env var, then a hardcoded fallback) picks up the
    # real just-uploaded asset. sys.argv is reset to just the script name — this kernel is a real
    # ipykernel process launched as `ipykernel_launcher.py -f <connection_file>`, so argv[1] is
    # literally "-f", which resolve_asset_path() would otherwise treat as an asset-path override
    # ahead of ASSET_PATH. chdir to WORKSPACE_DIR first: `_put_text_file` wrote the script via the
    # Contents API, which resolves relative paths against the notebook server's configured root
    # (/opt/workspace — jupyter_notebook_config.py), but a kernel's own cwd does not default to
    # that root. Trailing `; None` keeps run_path()'s returned namespace dict from being
    # auto-displayed as the cell's result (it would otherwise dump every name the script defined
    # into both script_output and the saved .ipynb).
    asset_env = f"import os; os.environ['ASSET_PATH'] = {asset_path!r}\n" if asset_path else ""
    dandiset_env = f"import os; os.environ['DANDISET_ID'] = {dandiset_id!r}\n" if dandiset_id else ""
    code = (
        f"{asset_env}"
        f"{dandiset_env}"
        f"import sys; sys.argv = [{script_path!r}]\n"
        f"import os; os.chdir('/opt/workspace')\n"
        f"import runpy; runpy.run_path({script_path!r}, run_name='__main__'); None"
    )

    try:
        ws.send(json.dumps({
            "header": {
                "msg_id": msg_id,
                "session": session_id,
                "username": user_id,
                "msg_type": "execute_request",
                "version": "5.3",
            },
            "parent_header": {},
            "metadata": {},
            "content": {
                "code": code,
                "silent": False,
                "store_history": True,
                "user_expressions": {},
                "allow_stdin": False,
                "stop_on_error": True,
            },
            "channel": "shell",
            "buffers": [],
        }))

        output_parts: list[str] = []
        # nbformat-shaped outputs, built in parallel with output_parts so the same execution
        # can be saved as a real, openable notebook (one code cell = the whole script) in
        # addition to the plain-text string this function already returns — see
        # `_notebook_document()`. Each dict here matches nbformat v4's output schema exactly.
        nb_outputs: list[dict] = []
        execution_count = 1
        deadline = time.monotonic() + timeout_s
        ws.settimeout(10)

        while time.monotonic() < deadline:
            try:
                raw = ws.recv()
            except websocket.WebSocketTimeoutException:
                continue
            if not raw:
                continue
            msg = json.loads(raw)
            if msg.get("parent_header", {}).get("msg_id") != msg_id:
                continue

            msg_type = msg["header"]["msg_type"]
            content = msg.get("content", {})

            if msg_type == "stream":
                text = content.get("text", "")
                output_parts.append(text)
                nb_outputs.append({"output_type": "stream", "name": content.get("name", "stdout"), "text": text})
            elif msg_type in ("execute_result", "display_data"):
                text = content.get("data", {}).get("text/plain", "")
                output_parts.append(text + "\n")
                nb_output = {"output_type": msg_type, "data": content.get("data", {}), "metadata": content.get("metadata", {})}
                if msg_type == "execute_result":
                    nb_output["execution_count"] = execution_count
                nb_outputs.append(nb_output)
            elif msg_type == "error":
                traceback_lines = content.get("traceback", [])
                output_parts.append("\n" + "\n".join(traceback_lines) + "\n")
                nb_outputs.append({
                    "output_type": "error",
                    "ename": content.get("ename", ""),
                    "evalue": content.get("evalue", ""),
                    "traceback": traceback_lines,
                })
            elif msg_type == "status" and content.get("execution_state") == "idle":
                try:
                    _put_notebook_file(session, base, user_id, server_name, script_path, code, nb_outputs, execution_count)
                except Exception:  # noqa: BLE001 — the .ipynb is a bonus artifact; the run already succeeded
                    logger.exception("Failed to save %s's execution as a notebook (non-fatal)", script_path)
                return "".join(output_parts)

        raise ScriptRunError(f"{script_path} did not finish within {timeout_s}s")
    finally:
        ws.close()


def _notebook_document(source: str, outputs: list[dict], execution_count: int) -> dict:
    """A minimal, valid nbformat v4 notebook: one code cell holding the executed code, with
    the real outputs captured from that same kernel run attached to it.
    """
    return {
        "cells": [{
            "cell_type": "code",
            "execution_count": execution_count,
            "metadata": {},
            "outputs": outputs,
            "source": source.splitlines(keepends=True),
        }],
        "metadata": {
            "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
            "language_info": {"name": "python"},
        },
        "nbformat": 4,
        "nbformat_minor": 5,
    }


def _put_notebook_file(
    session: requests.Session,
    base: str,
    user_id: str,
    server_name: str,
    script_path: str,
    source: str,
    outputs: list[dict],
    execution_count: int,
) -> None:
    notebook_path = os.path.splitext(script_path)[0] + ".ipynb"
    contents_url = f"{base}/user/{user_id}/{server_name}/api/contents/{notebook_path}"
    xsrf = _xsrf_for(session, user_id, server_name)
    resp = session.put(
        contents_url,
        headers={"X-XSRFToken": xsrf, "Content-Type": "application/json"},
        json={
            "name": notebook_path,
            "path": notebook_path,
            "type": "notebook",
            "format": "json",
            "content": _notebook_document(source, outputs, execution_count),
        },
        timeout=30,
    )
    if not resp.ok:
        raise ScriptRunError(f"Writing {notebook_path} into the workspace failed: HTTP {resp.status_code} — {resp.text[:300]}")
