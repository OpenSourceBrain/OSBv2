import * as React from "react";

//components
import { Chip, Grid, Box, Typography } from "@mui/material";

//icons
import CircularProgress from "@mui/material/CircularProgress";

import {  WorkspaceCard } from "..";
import { Workspace } from "../../types/workspace";



export enum WorkspaceSelection {
  USER,
  PUBLIC,
  FEATURED,
}

export const WorkspacesCards = (props: any) => {
  const { workspaces, loading, handleWorkspaceClick } = props;

  return (
    <>
      {loading ? (
        <Box
          flex={1}
          px={2}
          py={2}
          display="flex"
          alignContent="center"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box className={`verticalFit card-container`}>
          <Grid
            container
            spacing={1}
            sx={{ paddingLeft: "24px", paddingRight: "18px", flex: "initial" }}
            py={4}
          >
            {workspaces?.map((workspace: Workspace, index: number) => {
              return (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={2}>
                  <WorkspaceCard workspace={workspace} handleWorkspaceClick={handleWorkspaceClick} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </>
  );
};

export default WorkspacesCards;
