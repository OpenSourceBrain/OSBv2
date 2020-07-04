import * as React from "react";
import Divider from "@material-ui/core/Divider";
import { useParams } from "react-router-dom";

import {
  WorkspaceDrawer,
  WorkspaceFrame
} from "..";

import workspaceService from "../../service/WorkspaceService";

export default (props: any) => {
  const { workspaceId } = useParams();
  const workspace = workspaceService.getWorkspace(workspaceId);

  return (
      <>
      <Divider variant="fullWidth" />
    <WorkspaceDrawer workspace={workspace}>
      <WorkspaceFrame />
    </WorkspaceDrawer>
    </>
  );
};
