import * as React from "react";

import { Grid, Paper } from "@mui/material";
import Box from "@mui/material/Box";

import makeStyles from '@mui/styles/makeStyles';
import { Latest } from "../components/home/Latest";
import { MainMenu } from "../components";

import {
  Header,
  Banner,
  WorkspaceDrawer,
  Workspaces,
  WorkspaceToolBox,
} from "../components";

const useStyles = makeStyles((theme) => ({
  paper: {
    overflow: "hidden",
  },
}));

export default (props: any) => {
  const classes = useStyles();

  return (
    <>
      <MainMenu />
      <Box p={1} className="verticalFit">
        <Grid container={true} className="verticalFill">
          <Grid
            item={true}
            xs={12}
            sm={12}
            md={6}
            direction="column"
            className="verticalFill"
          >
            <Box display="flex">
              <Paper className={classes.paper} elevation={0}>
                <div id="homepage-banner">
                  <Banner />
                </div>
              </Paper>
            </Box>
            <Box mt={2} display="flex">
              <Paper className={classes.paper} elevation={0}>
                <Box p={3}>
                  <div id="create-new-workspace-toolbox">
                    <WorkspaceToolBox />
                  </div>
                </Box>
              </Paper>
            </Box>
            <Box mt={2} display="flex" flexGrow="1">
              <Paper elevation={0} className="verticalFill">
                <Box p={3} className="verticalFill">
                  <div id="info-disclaimer-box">
                    <Latest />
                  </div>
                </Box>
              </Paper>
            </Box>
          </Grid>
          <Grid
            item={true}
            xs={12}
            sm={12}
            md={6}
            alignItems="stretch"
            className="verticalFill"
          >
            <Box pl={2} width={1} className="verticalFit">
              <div id="workspaces-list" className="verticalFit">
                <Workspaces />
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
