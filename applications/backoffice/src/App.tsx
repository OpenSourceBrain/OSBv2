import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";


import HomePage from "./pages/HomePage";
import theme from "./theme";



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

export const App = (props: any) => {


  return (
    // tslint:disable-next-line:jsx-boolean-value
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>

          <CssBaseline />

          {!props.error &&
            <Router>
              <Box sx={styles.mainContainer}>

                  <Routes>
                    <Route
                      path="/"
                      element={<HomePage />}
                    />
                  </Routes>
              </Box>
            </Router>
          }

      </ThemeProvider>
    </StyledEngineProvider>
  );
};
