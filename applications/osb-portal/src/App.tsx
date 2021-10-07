import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline, makeStyles } from "@material-ui/core";
import SentryErrorBoundary from "./components/sentry/SentryErrorBoundary";
import HomePage from "./pages/HomePage";
import theme from "./theme";

import { Header, ErrorDialog, WorkspaceOpenPage, ProtectedRoute, RepositoriesPage, RepositoryPage, WorkspacePage, UserPage } from "./components/index";

const useStyles = makeStyles(() => ({
  mainContainer: {
    overflow: "auto",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      height: "100vh",
      overflow: "hidden",
    }
  },
}));

export const App = (props: any) => {
  const classes = useStyles();

  return (
    <SentryErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorDialog />
        {!props.error &&
          <Router>
            <div className={classes.mainContainer}>
              <Header />


              <Switch>
                <Route exact={true} path="/">
                  <HomePage />
                </Route>
                <Route exact={true} path="/workspace/:workspaceId">
                  <WorkspacePage />
                </Route>
                <ProtectedRoute exact={true} path="/workspace/open/:workspaceId/:app">
                  <WorkspaceOpenPage />
                </ProtectedRoute>
                <Route exact={true} path="/repositories">
                  <RepositoriesPage />
                </Route>
                <Route exact={true} path="/repositories/:repositoryId">
                  <RepositoryPage />
                </Route>
                <Route exact={true} path="/user/:userId">
                  <UserPage />
                </Route>
              </Switch>

            </div>
          </Router>
        }
      </ThemeProvider>
    </SentryErrorBoundary>
  );
};
