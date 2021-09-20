import * as React from "react";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import { useParams } from "react-router-dom";

import {
  WorkspaceDrawer
} from "../components";

// import workspaceService from "../../service/WorkspaceService";
// import { Workspace } from "../../types/workspace";

export default (props: any) => {
  const { workspaceId, app } = useParams<{ workspaceId: string, app: string }>();

  props.selectWorkspace(workspaceId);

  return (
    <Box className="verticalFill">
      <Divider variant="fullWidth" />
      <WorkspaceDrawer app={app} />

    </Box>
  );
};
