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
  const workspaceId = ''; // useParams();

  props.selectWorkspace(workspaceId as string);

  return (
    <>
      <Divider variant="fullWidth" />
      <WorkspaceDrawer>
        <WorkspaceFrame />
      </WorkspaceDrawer>
    </>
  );
};
