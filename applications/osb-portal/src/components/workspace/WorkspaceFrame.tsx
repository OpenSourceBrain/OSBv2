import * as React from "react";
import { useParams } from "react-router-dom";
import { AnyAction, Dispatch } from "redux";
import { PayloadAction } from "@reduxjs/toolkit";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import {
  Workspace,
  WorkspaceResource,
  OSBApplications,
  ResourceStatus,
} from "../../types/workspace";
import { UserInfo } from "../../types/user";
import workspaceService from "../../service/WorkspaceService";
import WorkspaceResourceService from "../../service/WorkspaceResourceService";
import { getBaseDomain, getApplicationDomain } from "../../utils";

declare let window: any;

const styles = {
  iframe: {
    flex: 1,
    border: "none",
  },
};

const WORKSPACE_BASE_DIRECTORY = "/opt/workspace/";
export const WorkspaceFrame = (props: {
  user: UserInfo;
  workspace: Workspace;
  dispatch: Dispatch;
  currentResource: WorkspaceResource;
}) => {
  const [frameUrl, setFrameUrl] = React.useState(null);
  const [frameError, setFrameError] = React.useState(false);
  const [retryToken, setRetryToken] = React.useState(0);
  const { app } = useParams<{ app: string }>();

  const { user, workspace, dispatch, currentResource } = props;

  const openResource = React.useCallback(async () => {
    const resource: WorkspaceResource = currentResource;
    const iFrame = document.getElementById(
      "workspace-frame"
    ) as HTMLIFrameElement;

    if (resource && resource.status === ResourceStatus.available) {
      const fileName: string =
        WORKSPACE_BASE_DIRECTORY +
        WorkspaceResourceService.getResourcePath(resource);

      iFrame.contentWindow.postMessage(
        { type: "LOAD_RESOURCE", payload: fileName },
        "*"
      );
    }
  }, [currentResource]);

  React.useEffect(() => {
    const iFrame = document.getElementById(
      "workspace-frame"
    ) as HTMLIFrameElement;
    const messageListener = (message: MessageEvent<PayloadAction>) => {
      if (!iFrame || message.source !== iFrame.contentWindow) {
        return;
      }
      console.debug("Message", message);

      switch (message.data?.type) {
        case undefined:
        case null:
          return;
        case "APP_READY": {
          if (workspace.resources != null && workspace.resources.length > 0) {
            openResource();
            return;
          } else {
            iFrame.contentWindow.postMessage({ type: "NO_RESOURCE" }, "*");
            dispatch(message.data)
          }
          break;
        }
        default: {
          dispatch(message.data);
        }
      }
    };

    window.addEventListener("message", messageListener, false);

    return () => window.removeEventListener("message", messageListener);
  }, [dispatch, frameUrl, openResource, workspace.resources]);

    

  const application = app
      ? OSBApplications[app]
      : currentResource?.type?.application ?? workspace.defaultApplication;
  

  React.useEffect(() => {
    openResource();
  }, [openResource]);

  React.useEffect(() => {
    let cancelled = false;
    setFrameError(false);
    setFrameUrl(null);

    const spawn = async () => {
      // Make sure the workspace volume is created and ready (bound) before we
      // spawn the iframe, so the app pod does not fail to mount it.
      try {
        await workspaceService.ensureWorkspaceReady(workspace.id);
      } catch (e) {
        if (e?.volumeNotReady) {
          // Transient: the storage is genuinely not bound yet. Surface a
          // retryable error instead of spawning a pod that would fail to mount.
          console.error("Workspace volume not ready, not spawning iframe", e);
          if (!cancelled) {
            setFrameError(true);
          }
          return;
        }
        // Any other failure (auth, network, 5xx) is unrelated to volume
        // readiness; don't block workspace access — fall through and spawn the
        // iframe as we did before this readiness check existed.
        console.warn("Workspace readiness check failed, spawning anyway", e);
      }
      if (cancelled) {
        return;
      }

      const applicationDomain = getApplicationDomain(application);
      const domain = getBaseDomain();

      const userParam = user == null ? "" : `${user.id}`;
      const type = application.subdomain.slice(0, 4);
      document.cookie = `workspaceId=${workspace.id};path=/;domain=${domain}`;
      if (applicationDomain) {
        // Go through chkclogin rather than straight to /hub/spawn: the hub
        // session cookie is per app subdomain, so a stale anonymous session
        // (e.g. from browsing before logging in) would otherwise stick and
        // make the spawn 404 with "No access to resources". chkclogin clears
        // the hub login cookie and re-derives the user from the Keycloak
        // token cookie before redirecting to `next`.
        const spawnUrl = `/hub/spawn/${userParam}/${workspace.id}${type}${document.location.search ?? ''}`;
        setFrameUrl(`//${applicationDomain}/hub/chkclogin?next=${encodeURIComponent(spawnUrl)}`);
      } else {
        setFrameUrl(`/testapp?workspaceId=${workspace.id}&type=${type}&user=${userParam}&application=${application.name}`);
      }
    };

    spawn();

    return () => {
      cancelled = true;
    };
    // Depend on the primitive inputs the effect actually uses, not the
    // `application`/`user` object identities — those are rebuilt on unrelated
    // redux updates and would otherwise reset frameUrl to null (remounting the
    // iframe via key={frameUrl}) and refire the /open fetch on every re-render.
  }, [application?.subdomain, application?.name, user?.id, workspace.id, retryToken]);

  if (!workspace) {
    return null;
  }

  if (frameError) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flex={1}
        gap={2}
        p={4}
        textAlign="center"
      >
        <Typography variant="h6">
          The workspace is temporarily unavailable
        </Typography>
        <Typography variant="body1" color="textSecondary">
          The workspace storage is not ready yet. This is usually temporary —
          please try again in a few seconds.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setRetryToken((token) => token + 1)}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <iframe
      id="workspace-frame"
      key={frameUrl}
      src={frameUrl}
      style={styles.iframe}
    />
  );
};
