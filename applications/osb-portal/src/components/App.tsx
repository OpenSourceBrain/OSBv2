import * as React from "react";
import { withRouter } from 'react-router'
import { BrowserRouter as Router, useRouteMatch, Route } from 'react-router-dom';

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';

import SentryErrorBoundary from "./sentry/SentryErrorBoundary";

import { Latest } from "./latest/Latest";

import { Header, Banner, WorkspaceDrawer, Workspaces, WorkspaceToolBox, ErrorDialog, WorkspaceFrame } from "./index";
import { MainMenu } from "./menu/MainMenu";

const grey = "#434343";
const black = "#111111";

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: black,
      paper: grey
    },
  },
});

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
        <Header />
        <Router>
          <Route exact={true} path="/workspace/:id">
            <WorkspaceDrawer>
              <WorkspaceFrame/>
            </WorkspaceDrawer>
          </Route>
          <Route exact={true} path="/">
            <MainMenu />
            <Banner />
            <Grid container={true}>
              <Grid item={true} xs={6}>
                <WorkspaceToolBox />
              </Grid>
              <Grid item={true} xs={6}>
                <Latest />
              </Grid>
            </Grid>
            <Workspaces />
          </Route>
        </Router>
      </ThemeProvider>
    </SentryErrorBoundary>
  );
}
