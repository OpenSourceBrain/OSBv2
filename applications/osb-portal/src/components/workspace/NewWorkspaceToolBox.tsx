import * as React from "react";

//components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import WorkspaceItem, { WorkspaceTemplateType } from "./NewWorkspaceItem";

//types
import { UserInfo } from "../../types/user";

//icons
import {
  ComputationalModeling,
  DataAnalystIcon,
  WorkspaceFromRepositoryIcon,
  WorkspaceIcon,
} from "../icons";


import Typography from "@mui/material/Typography";


export const WorkspaceToolBox = (props: any) => {
  const user: UserInfo = props.user;
  return (
    <>
      <Box>
        <Box pb={4} textAlign="center">
          <Typography pb={2} variant="h1" component="h2">
            {" "}
            {props.title}
          </Typography>
          <Typography variant="body1">
            Quickly create a workspace by choosing <br /> one of the predefined
            templates
          </Typography>
        </Box>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} id="computational-modeling">
          <Grid item xs={12} lg={6}>

              <WorkspaceItem
                icon={<WorkspaceIcon />}
                title="Computational modeling"
                template={WorkspaceTemplateType.network}
                user={user}
                refreshWorkspaces={props.refreshWorkspaces}
                closeMainDialog={(isClosed) => props.closeMainDialog(isClosed)}
              />
  
          </Grid>
          <Grid item xs={12} lg={6} id="data-analysis">
    
              <WorkspaceItem
                icon={<DataAnalystIcon />}
                title="Data analysis"
                template={WorkspaceTemplateType.explorer}
                user={user}
                refreshWorkspaces={props.refreshWorkspaces}
                closeMainDialog={(isClosed) => props.closeMainDialog(isClosed)}
              />
    
          </Grid>
          <Grid item xs={12} lg={6} id="interactive-development">

              <WorkspaceItem
                icon={<ComputationalModeling />}
                title="Interactive development"
                template={WorkspaceTemplateType.playground}
                user={user}
                refreshWorkspaces={props.refreshWorkspaces}
                closeMainDialog={(isClosed) => props.closeMainDialog(isClosed)}
              />

          </Grid>
          <Grid item xs={12} lg={6} id="workspace-from-repository">

              <WorkspaceItem
                className="from-repository-create-workspace-item"
                icon={<WorkspaceFromRepositoryIcon />}
                title="Workspace from repository"
                template={null}
                user={user}
                refreshWorkspaces={props.refreshWorkspaces}
                closeMainDialog={(isClosed) => props.closeMainDialog(isClosed)}
              />

          </Grid>
        </Grid>
      </Box>
    </>
  );
};
