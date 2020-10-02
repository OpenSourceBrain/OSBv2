import * as React from "react";

import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import { ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import SentryErrorBoundary from "./sentry/SentryErrorBoundary";

import HomePage from "./pages/HomePage";
import theme from "../theme";
import {
  Header,
  ErrorDialog,
  WorkspacePage,
  ProtectedRoute
} from "./index";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    overflow: "auto",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  }
}));

export const App = (props: any) => {
  const classes = useStyles();
  React.useEffect(() => {
    props.onLoadWorkspaces();
    props.onLoadModels();
  }, []);

  return (
    <SentryErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorDialog />
        <div className={classes.mainContainer}>
          <Header />
          <Router>
            <Switch>
              <Route exact={true} path="/">
                <HomePage />
              </Route>
              <ProtectedRoute exact={true} path="/workspace/:workspaceId">
                <WorkspacePage />
              </ProtectedRoute>
            </Switch>
          </Router>
        </div>
      </ThemeProvider>
    </SentryErrorBoundary>
  );
};
