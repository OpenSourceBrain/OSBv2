import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";


import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import theme from "./theme";
import { initApis, popLoginRedirect } from "./service/UserService";



declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  // tslint:disable-next-line:no-empty-interface
  interface DefaultTheme extends Theme {}
}



const styles = {
  mainContainer: {

    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",

    height: { md: "100vh" },
    overflow: { md: "hidden", xs: "auto" },

  },
};

// Lands the user back where they were before the auth round-trip. Reads the
// stored path only on mount, i.e. only when the /login route actually matches.
const LoginRedirect = () => <Navigate to={popLoginRedirect()} replace={true} />;

export const App = (props: any) => {

  // Sets up the API clients from the gatekeeper token before the first render.
  initApis();

  return (
    // tslint:disable-next-line:jsx-boolean-value
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>

          <CssBaseline />

          {!props.error &&
            <Router>
              <Box sx={styles.mainContainer}>
                  <Header />
                  <Routes>
                    <Route
                      path="/"
                      element={<HomePage />}
                    />
                    <Route
                      path="/login"
                      element={<LoginRedirect />}
                    />
                  </Routes>
              </Box>
            </Router>
          }

      </ThemeProvider>
    </StyledEngineProvider>
  );
};
