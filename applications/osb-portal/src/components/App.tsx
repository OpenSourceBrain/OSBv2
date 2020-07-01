import * as React from "react";
import { withRouter } from "react-router";
import {
  BrowserRouter as Router,
  useRouteMatch,
  Route,
} from "react-router-dom";
import { Grid, Paper } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import MainMenu from "./menu/MainMenu";
import { WorkspaceFrame } from ".";

import SentryErrorBoundary from "./sentry/SentryErrorBoundary";

import { Latest } from "./latest/Latest";
import theme from "../theme";
import {
  Header,
  Banner,
  WorkspaceDrawer,
  Workspaces,
  WorkspaceToolBox,
  ErrorDialog,
} from "./index";

export const App = (props: any) => {
  React.useEffect(() => {
    props.onLoadWorkspaces();
    props.onLoadModels();
    props.onLoadNWBFiles();
  }, []);
  return (
    <SentryErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorDialog />
        <div style={{overflow: "hidden", height: "100vh", display: "flex", flexDirection: "column"}}>
        <Header />
        <Router>
          <Route exact={true} path="/workspace/:id">
            <WorkspaceDrawer>
              <WorkspaceFrame />
            </WorkspaceDrawer>
          </Route>
          <Route exact={true} path="/">
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
          </Route>
        </Router>
        </div>
      </ThemeProvider>
    </SentryErrorBoundary>
  );
};
