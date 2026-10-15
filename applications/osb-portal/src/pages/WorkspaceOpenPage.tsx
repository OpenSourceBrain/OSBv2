import * as React from "react";
import { useDispatch } from "react-redux";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";

import { WorkspaceDrawer } from "../components";
import { selectWorkspace } from "../store/actions/workspaces";

// import workspaceService from "../../service/WorkspaceService";
// import { Workspace } from "../../types/workspace";

export const WorkspaceOpenPage = () => {
  const dispatch = useDispatch();
  const { workspaceId, app } = useParams<{
    workspaceId: string;
    app: string;
  }>();

  React.useEffect(() => {
    dispatch(selectWorkspace(workspaceId as any));
  }, [dispatch, workspaceId]);

  return (
    <Box className="verticalFill" height={1}>
      <Divider variant="fullWidth" />
      <WorkspaceDrawer app={app} />
    </Box>
  );
};

export default WorkspaceOpenPage;