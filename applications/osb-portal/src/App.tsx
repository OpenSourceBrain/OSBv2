import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
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
import { RootState } from "./store/rootReducer";

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
  GroupsPage
} from "./components";
import Box from "@mui/material/Box";
import { UserInfo } from "./types/user";
import SampleIframePage from "./pages/SampleIframePage";
import NotFoundPage from "./pages/NotFoundPage";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const styles = {
  mainContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: {
      xs: "auto",
      md: "hidden",
    },
  },
};


interface AppProps {
  error: boolean;
  user: UserInfo;
}

export const App = () => {
  const error = useSelector((state: RootState) => state.error);
  
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <OSBErrorBoundary error={error} >
          <CssBaseline />
          <AboutDialog />
          {!error && (
            <Router>
              <Box sx={styles.mainContainer}>
                <Box id="header">
                  <Header />
                </Box>

                <Routes>
                  <Route
                    path="/"
                    element={
                      <SidebarPageLayout>
                        <HomePage />
                      </SidebarPageLayout>
                    }
                  />
                  <Route
                    path="/workspaces"
                    element={
                      <SidebarPageLayout>
                        <HomePage />
                      </SidebarPageLayout>
                    }
                  />
                  <Route
                    path="/workspaces/:workspaceId"
                    element={
                      <SidebarPageLayout>
                        <WorkspacePage />
                      </SidebarPageLayout>
                    }
                  />
                  <Route
                    path="/workspaces/open/:workspaceId/:app"
                    element={<ProtectedRoute><WorkspaceOpenPage /></ProtectedRoute>}
                  />
                  <Route
                    path="/workspaces/open/:workspaceId"
                    element={
                      <ProtectedRoute>
                        <WorkspaceOpenPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/workspace/:workspaceId"
                    element={
                      <SidebarPageLayout>
                        <WorkspacePage />
                      </SidebarPageLayout>
                    }
                  />
                  <Route
                    path="/workspace/open/:workspaceId/:app"
                    element={<ProtectedRoute><WorkspaceOpenPage /></ProtectedRoute>}
                  />
                  <Route
                    path="/workspace/open/:workspaceId"
                    element={
                      <ProtectedRoute>
                        <WorkspaceOpenPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/repositories"
                    element={
                      <SidebarPageLayout>
                        <RepositoriesPage />
                      </SidebarPageLayout>
                    }
                  />
                  <Route
                    path="/repositories/:repositoryId"
                    element={
                      <SidebarPageLayout>
                        <RepositoryPage />
                      </SidebarPageLayout>
                    }
                  />
                  <Route
                    path="/user/:userName"
                    element={
                      <SidebarPageLayout>
                        <UserPage />
                      </SidebarPageLayout>
                    }
                  />
                  <Route
                    path="/user/:userName/groups/:groupname"
                    element={
                      <SidebarPageLayout>
                        <GroupsPage />
                      </SidebarPageLayout>
                    }
                  />
                  <Route
                    path="/login"
                    element={<Navigate to="/" replace />}
                  />
                  <Route
                    path="/testapp"
                    element={
                      <SampleIframePage
                      />
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Box>
            </Router>

          )}

        </OSBErrorBoundary>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
