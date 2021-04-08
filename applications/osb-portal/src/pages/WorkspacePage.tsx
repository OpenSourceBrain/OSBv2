import * as React from "react";
import Divider from "@material-ui/core/Divider";
import { useParams } from "react-router-dom";

import {
  WorkspaceDrawer,
  WorkspaceFrame
} from "../components";

// import workspaceService from "../../service/WorkspaceService";
// import { Workspace } from "../../types/workspace";

export default (props: any) => {
  const { workspaceId, app } = useParams<{ workspaceId: string, app: string }>();

  props.selectWorkspace(workspaceId);

  return (
    <>
      <Divider variant="fullWidth" />
      <WorkspaceDrawer>
        <WorkspaceFrame app={app} />
      </WorkspaceDrawer>
    </>
  );
};
