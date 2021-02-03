import * as React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline, makeStyles } from "@material-ui/core";
import { SSRKeycloakProvider, SSRCookies, getKeycloakInstance } from '@react-keycloak/ssr';

import { Provider } from 'react-redux';

import theme from "../theme";
import { Header, ErrorDialog } from "../components";
import store from '../store/store';
import { keycloakCfg } from "../config";
import SentryErrorBoundary from "../components/sentry/SentryErrorBoundary";
import type { AppProps, AppContext } from 'next/app'
import { parseCookies } from "../utils";

import workspaceService from '../service/WorkspaceService';
import { Workspace } from "../types/workspace";




interface InitialProps {
  cookies: unknown,
  location: string,
  publicWorkspaces: Workspace[],
  userWorkspaces: Workspace[]

}

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

export const App = ({ Component, pageProps, location, cookies, ...rest }: AppProps & InitialProps) => {
  const classes = useStyles();

  return (
    <Provider store={store}>
      <SentryErrorBoundary>
        <ThemeProvider theme={theme}>
          <SSRKeycloakProvider
            keycloakConfig={keycloakCfg}
            persistor={SSRCookies(cookies)}
            initOptions={{ silentCheckSsoRedirectUri: 'http://' + location + '/silent-check-sso.html' }}
          >
            <CssBaseline />
            <ErrorDialog />
            <div className={classes.mainContainer}>
              <Header />

              <Component {...pageProps} {...rest} />

            </div>
          </SSRKeycloakProvider>
        </ThemeProvider>
      </SentryErrorBoundary>
    </Provider>
  );
};



App.getInitialProps = async (context: AppContext) => {
  // Extract cookies from AppContext
  const cookies = parseCookies(context?.ctx?.req);

  return {
    cookies,
    location: context.ctx.req.headers.host,
  }
}

export default App;