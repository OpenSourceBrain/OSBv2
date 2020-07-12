import * as React from "react";
import { withRouter } from "react-router";
import {
  BrowserRouter as Router,
  useParams,
  Route,
} from "react-router-dom";
import { Grid, Paper } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import MainMenu from "./menu/MainMenu";
import { WorkspaceFrame } from ".";

import SentryErrorBoundary from "./sentry/SentryErrorBoundary";
import WorkspacePage from "./pages/WorkspacePage";
import HomePage from "./pages/HomePage";
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
          <Route exact={true} path="/workspace/:workspaceId">
            <WorkspacePage />
          </Route>
          <Route exact={true} path="/">
            <HomePage />
          </Route>
        </Router>
        </div>
      </ThemeProvider>
    </SentryErrorBoundary>
  );
};
