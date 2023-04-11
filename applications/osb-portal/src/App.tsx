import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import {
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import OSBErrorBoundary from "./components/handlers/OSBErrorBoundary";
import theme from "./theme";
import SidebarPageLayout from "./layouts/SidebarLayout";
import * as UserService from "./service/UserService";

import {
  Header,
  AboutDialog,
  WorkspaceOpenPage,
  ProtectedRoute,
  RepositoryPage,
  WorkspacePage,
  UserPage,
  RepositoriesPage,
  HomePage,
} from "./components";
import Box from "@mui/material/Box";
import { UserInfo } from "./types/user";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const styles = {
  mainContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    height: {
      md: "100vh",
    },
    overflow: {
      xs: "auto",
      md: "hidden",
    },
  },
};

const UserActionThenRedirect = ({ userAction, user }) => {
  const history = useHistory();
  React.useEffect(() => {
    if (user) {
      history.push("/");
    } else {
      userAction();
    }
  }, [history, user, userAction]);

  return <></>;
};

interface AppProps {
  error: boolean;
  user: UserInfo;
}

export const App = (props: AppProps) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <OSBErrorBoundary>
          <CssBaseline />
          <AboutDialog />
          {!props.error && (
            <Router>
              <Box sx={styles.mainContainer}>
                <Box id="header">
                  <Header />
                </Box>

                <Switch>
                  <Route exact={true} path="/">
                    <SidebarPageLayout>
                      <HomePage />
                    </SidebarPageLayout>
                  </Route>
                  <Route exact={true} path="/workspace/:workspaceId">
                    <SidebarPageLayout>
                      <WorkspacePage />
                    </SidebarPageLayout>
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
                    <SidebarPageLayout>
                      <RepositoriesPage />
                    </SidebarPageLayout>
                  </Route>
                  <Route exact={true} path="/repositories/:repositoryId">
                    <SidebarPageLayout>
                      <RepositoryPage />
                    </SidebarPageLayout>
                  </Route>
                  <Route exact={true} path="/user/:userName">
                    <SidebarPageLayout>
                      <UserPage />
                    </SidebarPageLayout>
                  </Route>
                  <Route exact={true} path="/login">
                    <UserActionThenRedirect
                      userAction={UserService.login}
                      user={props.user}
                    />
                  </Route>
                  <Route exact={true} path="/register">
                    <UserActionThenRedirect
                      userAction={UserService.register}
                      user={props.user}
                    />
                  </Route>
                </Switch>
              </Box>
            </Router>
          )}
        </OSBErrorBoundary>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
