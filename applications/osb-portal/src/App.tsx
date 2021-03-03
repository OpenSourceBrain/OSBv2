import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline, makeStyles } from "@material-ui/core";
import SentryErrorBoundary from "./components/sentry/SentryErrorBoundary";
import HomePage from "./pages/HomePage";
import theme from "./theme";
import { Header, ErrorDialog, WorkspacePage, ProtectedRoute } from "./components/index";

const useStyles = makeStyles(() => ({
  mainContainer: {
    overflow: "auto",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      maxHeight: "100vh",
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
          <>
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
          </>
        }
      </ThemeProvider>
    </SentryErrorBoundary>
  );
};
