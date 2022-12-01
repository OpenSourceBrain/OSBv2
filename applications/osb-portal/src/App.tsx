import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import OSBErrorBoundary from "./components/handlers/OSBErrorBoundary";
import HomePage from "./pages/HomePage";
import theme from "./theme";

import {
  Header,
  AboutDialog,
  WorkspaceOpenPage,
  ProtectedRoute,
  RepositoryPage,
  WorkspacePage,
  UserPage,
} from "./components";

import {RepositoriesPage} from "./pages/RepositoriesNew";

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const useStyles = makeStyles(() => ({
  mainContainer: {
    overflow: "auto",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      height: "100vh",
      overflow: "hidden",
    },
  },
  appHeader: {
    height: '30px',
    borderBottom: '1px solid #434343',
  }
}));

export const App = (props: any) => {
  const classes = useStyles();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <OSBErrorBoundary>
          <CssBaseline />
          <AboutDialog />
          {!props.error && (
            <Router>
              <div className={classes.mainContainer}>
                <div id="header" className={classes.appHeader}>
                  <Header />
                </div>

                <OSBErrorBoundary>
                  <Switch>
                    <Route exact={true} path="/">
                      <HomePage />
                    </Route>
                    <Route exact={true} path="/workspace/:workspaceId">
                      <WorkspacePage />
                    </Route>
                    <ProtectedRoute
                      exact={true}
                      path="/workspace/open/:workspaceId/:app"
                    >
                      <WorkspaceOpenPage />
                    </ProtectedRoute>
                    <ProtectedRoute
                      exact={true}
                      path="/workspace/open/:workspaceId"
                    >
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
                </OSBErrorBoundary>
              </div>
            </Router>
          )}
        </OSBErrorBoundary>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
