import * as React from "react";
import { useParams } from "react-router-dom";
import { AnyAction, Dispatch } from "redux";
import { PayloadAction } from "@reduxjs/toolkit";

import makeStyles from '@mui/styles/makeStyles';
import {
  Workspace,
  WorkspaceResource,
  OSBApplications,
  ResourceStatus,
} from "../../types/workspace";
import { UserInfo } from "../../types/user";
import WorkspaceResourceService from "../../service/WorkspaceResourceService";
import { getBaseDomain, getApplicationDomain } from "../../utils";

declare var window: any;

const useStyles = makeStyles((theme) => ({
  iframe: {
    flex: 1,
    border: "none",
  },
}));

const WORKSPACE_BASE_DIRECTORY = "/opt/workspace/";
export const WorkspaceFrame = (props: {
  user: UserInfo;
  workspace: Workspace;
  dispatch: Dispatch;
  currentResource: WorkspaceResource;
}) => {
  const classes = useStyles();
  const [frameUrl, setFrameUrl] = React.useState(null);
  const { app } = useParams<{ app: string }>();

  const { user, workspace, dispatch, currentResource } = props;
  if (!workspace) {
    return null;
  }

  React.useEffect(() => {
    const iFrame = document.getElementById(
      "workspace-frame"
    ) as HTMLIFrameElement;
    const messageListener = (message: MessageEvent<PayloadAction>) => {
      if (message.source !== iFrame.contentWindow) {
        return;
      }
      console.log("Message", message);

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
          }
        }
        default: {
          dispatch(message.data);
        }
      }
    };

    window.addEventListener("message", messageListener, false);

    return () => window.removeEventListener("message", messageListener);
  }, [frameUrl]);

  const application = app
      ? OSBApplications[app]
      : currentResource?.type?.application ?? workspace.defaultApplication;
  

  React.useEffect(() => {
    openResource();
  }, [currentResource]);

  React.useEffect(() => {
    const applicationDomain = getApplicationDomain(application);

    const domain = getBaseDomain();



    const userParam = user == null ? "" : `${user.id}`;
    const type = application.subdomain.slice(0, 4);
    document.cookie = `workspaceId=${workspace.id};path=/;domain=${domain}`;
    if(applicationDomain) {
      setFrameUrl(`//${applicationDomain}/hub/spawn/${userParam}/${workspace.id}${type}${document.location.search ?? ''}`);
    } else {
      setFrameUrl(`/testapp?workspaceId=${workspace.id}&type=${type}&user=${userParam}&application=${application.name}`);
    }

  }, [application]);

  const openResource = async () => {
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
  };

  return (
    <iframe
      id="workspace-frame"
      key={frameUrl}
      src={frameUrl}
      className={classes.iframe}
    />
  );
};
