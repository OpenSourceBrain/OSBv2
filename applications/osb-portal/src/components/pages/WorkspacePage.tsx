import * as React from "react";
import Divider from "@material-ui/core/Divider";
import { useParams } from "react-router-dom";

import { WorkspaceIdGetRequest } from "../../apiclient/workspaces/apis/RestApi";
import { workspacesApi } from '../../middleware/osbbackend';
import { Workspace as WorkspaceBase } from '../../apiclient/workspaces/models/Workspace';

import { Workspace } from "../../types/workspace";
import { FeaturedType } from '../../types//global';

import {
  WorkspaceDrawer,
  WorkspaceFrame
} from "..";

// import workspaceService from "../../service/WorkspaceService";
// import { Workspace } from "../../types/workspace";

export default (props: any) => {
  const { workspaceId } = useParams();
  let workspaceItem: Workspace = null;

  // ToDo: use the workspace service
  // workspaceService.getWorkspace(workspaceId).then(workspace => workspaceItem = workspace);
  if (workspacesApi) {
    const wsigr: WorkspaceIdGetRequest = {id: workspaceId};
    workspacesApi.workspaceIdGet(wsigr).then((workspace: WorkspaceBase) => {
      workspaceItem = {
        ...workspace,
        shareType: FeaturedType.Private,
        volume: "1",
      }
    });
  }

  return (
      <>
      <Divider variant="fullWidth" />
    <WorkspaceDrawer workspace={workspaceItem}>
      <WorkspaceFrame />
    </WorkspaceDrawer>
    </>
  );
};
