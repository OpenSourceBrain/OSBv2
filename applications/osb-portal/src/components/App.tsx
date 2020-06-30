import * as React from "react";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";

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
        <Header />
        <WorkspaceDrawer />
        <Box p={1}>
          <Grid container alignItems="stretch" spacing={1}>
            <Grid item xs={12}>
              <Banner />
            </Grid>
            <Grid item xs={6}>
              <WorkspaceToolBox />
            </Grid>
            <Grid item xs={6}>
              <Latest />
            </Grid>
          </Grid>
        </Box>
        <Workspaces />
      </ThemeProvider>
    </SentryErrorBoundary>
  );
};
