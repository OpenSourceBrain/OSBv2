import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import HomePage from "./pages/HomePage";
import theme from "./theme";



declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  // tslint:disable-next-line:no-empty-interface
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
    }
  },
}));

export const App = (props: any) => {
  const classes = useStyles();

  return (
    // tslint:disable-next-line:jsx-boolean-value
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>

          <CssBaseline />

          {!props.error &&
            <Router>
              <div className={classes.mainContainer}>

                  <Switch>
                    <Route exact={true} path="/">
                      <HomePage />
                    </Route>
                  </Switch>
              </div>
            </Router>
          }

      </ThemeProvider>
    </StyledEngineProvider>
  );
};
