import * as React from "react";

import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";


import SentryErrorBoundary from "./sentry/SentryErrorBoundary";

import HomePage from "./pages/HomePage";
import theme from "../theme";
import {
  Header,
  ErrorDialog,
  WorkspacePage
} from "./index";

export const App = (props: any) => {
  React.useEffect(() => {
    props.onLoadWorkspaces();
    props.onLoadModels();
  }, []);

  return (
    <SentryErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorDialog />
        <div style={{ overflow: "hidden", height: "100vh", display: "flex", flexDirection: "column" }}>
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
