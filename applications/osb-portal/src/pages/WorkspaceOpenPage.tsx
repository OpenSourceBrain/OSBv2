import * as React from "react";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";

import { WorkspaceDrawer } from "../components";

// import workspaceService from "../../service/WorkspaceService";
// import { Workspace } from "../../types/workspace";

export default (props: any) => {
  const { workspaceId, app } = useParams<{
    workspaceId: string;
    app: string;
  }>();

  React.useEffect(() => {
    props.selectWorkspace(workspaceId);
  }, [workspaceId]);

  return (
    <Box className="verticalFill" height={1}>
      <Divider variant="fullWidth" />
      <WorkspaceDrawer app={app} />
    </Box>
  );
};
