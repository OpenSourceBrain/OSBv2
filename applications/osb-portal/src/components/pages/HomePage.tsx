import * as React from "react";

import { Grid, Paper } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import MainMenu from "../menu/MainMenu";
import { makeStyles } from "@material-ui/core/styles";
import { Latest } from "../latest/Latest";

import {
  Header,
  Banner,
  WorkspaceDrawer,
  Workspaces,
  WorkspaceToolBox,
  ErrorDialog,
} from "..";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(2),
    overflow: "hidden",
  },
  moreMargin: {
    marginBottom: theme.spacing(4),
  },
}));


export default (props: any) => {
  const classes = useStyles();

  return <>
    <MainMenu />
    <Box p={1} className="verticalFit">
      <Grid container>
        <Grid item xs={12} sm={12} md={6} container className="leftContainer">
          <Grid item={true} xs={12}>
            <Paper className={classes.paper} elevation={0}>
              <Banner />
            </Paper>
          </Grid>
          <Grid item={true} xs={12}>
            <Paper className={classes.paper} elevation={0}>
              <Box p={3} >
                <WorkspaceToolBox />
              </Box>
            </Paper>
          </Grid>
          <Grid item={true} xs={12} className="verticalFit">
            <Paper className={classes.moreMargin} elevation={0}>
              <Box p={3} height="36vh">
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
};
