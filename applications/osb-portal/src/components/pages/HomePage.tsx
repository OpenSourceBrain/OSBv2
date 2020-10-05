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
      <Grid container>
        <Grid item xs={12} sm={12} md={6} container className="leftContainer">
          <Grid item={true} xs={12}>
            <Paper style={{ overflow: "hidden", marginBottom: "12px" }} elevation={0}>
              <Banner />
            </Paper>
          </Grid>
          <Grid item={true} xs={12}>
            <Paper style={{ marginBottom: "12px" }} elevation={0}>
              <Box p={3}>
                <WorkspaceToolBox />
              </Box>
            </Paper>
          </Grid>
          <Grid item={true} xs={12} className="verticalFit">
            <Paper style={{ marginBottom: "27px" }} elevation={0}>
              <Box p={3} height="40vh">
                <Latest />
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6} container alignItems="stretch">
          <Box pl={2} width={1}>
              <Workspaces />
          </Box>
        </Grid>
      </Grid>
    </Box>
  </>
);
