import * as React from "react";

import { Grid, Paper } from "@material-ui/core";
import Box from "@material-ui/core/Box";

import { makeStyles } from "@material-ui/core/styles";
import { Latest } from "../components/home/Latest";
import MainMenu from "../components/menu/MainMenu";

import {
  Header,
  Banner,
  WorkspaceDrawer,
  Workspaces,
  WorkspaceToolBox,
  ErrorDialog,
} from "../components";

const useStyles = makeStyles((theme) => ({
  paper: {
    overflow: "hidden",
  },

}));


export default (props: any) => {
  const classes = useStyles();

  return <>
    <MainMenu />
    <Box p={1} className="verticalFit">
      <Grid container={true} className="verticalFill">
        <Grid item={true} xs={12} sm={12} md={6} direction="column" className="verticalFill">
          <Box display="flex" >
            <Paper className={classes.paper} elevation={0}>
              <Banner />
            </Paper>
          </Box>
          <Box mt={2} display="flex">
            <Paper className={classes.paper} elevation={0}>
              <Box p={3} >
                <WorkspaceToolBox />
              </Box>
            </Paper>
          </Box>
          <Box mt={2} display="flex" flexGrow="1">
            <Paper elevation={0} className="verticalFill">
              <Box p={3} className="verticalFill">
                <Latest />
              </Box>
            </Paper>
          </Box>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={6} alignItems="stretch" className="verticalFill">
          <Box pl={2} width={1} className="verticalFit" >
            <Workspaces />
          </Box>
        </Grid>
      </Grid>
    </Box>
  </>
};
