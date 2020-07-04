import * as React from "react";

import { Grid, Paper } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import MainMenu from "../menu/MainMenu";

import { Latest } from "../latest/Latest";

import {
  Header,
  Banner,
  WorkspaceDrawer,
  Workspaces,
  WorkspaceToolBox,
  ErrorDialog,
} from "..";

export default (props: any) => (
  <>
    <MainMenu />
    <Box p={1} className="verticalFit">
      <Grid container={true} spacing={1} alignItems="stretch">
        <Grid item={true} xs={12}>
          <Paper style={{ overflow: "hidden" }} elevation={0}>
            <Banner />
          </Paper>
        </Grid>
        <Grid item={true} xs={6}>
          <Paper elevation={0}>
            <Box p={3}>
              <WorkspaceToolBox />
            </Box>
          </Paper>
        </Grid>
        <Grid item={true} xs={6} className="verticalFit">
          <Paper elevation={0}>
            <Box p={3}>
              <Latest />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Workspaces />
    </Box>
  </>
);
