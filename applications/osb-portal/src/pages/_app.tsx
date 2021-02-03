import * as React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline, makeStyles } from "@material-ui/core";
import { SSRKeycloakProvider, SSRCookies, getKeycloakInstance } from '@react-keycloak/ssr';
import axios from 'axios';

import { Provider } from 'react-redux';

import theme from "../theme";
import { Header, ErrorDialog } from "../components";
import store from '../store/store';
import { keycloakCfg  } from "../config";
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

export const App = ({ Component, pageProps, location, cookies, ...rest }: AppProps  & InitialProps) => {
  const classes = useStyles();

  return (
    <Provider store={store}>
        <SentryErrorBoundary>
        <ThemeProvider theme={theme}>
        <SSRKeycloakProvider
          keycloakConfig={keycloakCfg}
          persistor={SSRCookies(cookies)}
          initOptions={{silentCheckSsoRedirectUri: 'http://' + location + '/silent-check-sso.html'}}
        >
            <CssBaseline />
            <ErrorDialog />
            <div className={classes.mainContainer}>
            <Header />
            
            <Component {...pageProps } {...rest} />

            </div>
            </SSRKeycloakProvider>
        </ThemeProvider>
        </SentryErrorBoundary>
    </Provider>
  );
};


 
App.getInitialProps =  async (context: AppContext) => {
  // Extract cookies from AppContext
  const cookies = parseCookies(context?.ctx?.req);
  if(context.ctx.req) {
    // it runs on server side
    axios.defaults.headers.get.Cookie = context.ctx.req.headers.cookie;
  }
  const keycloak = getKeycloakInstance(keycloakCfg, SSRCookies(cookies));
  const publicWorkspaces = await workspaceService.fetchWorkspaces(true);
  // console.log("Cookies: ", cookies)
  // console.log("Token: ", keycloak.token)
  const userWorkspaces = keycloak.token ? await workspaceService.fetchWorkspaces(false) : null;
  
  return {
      cookies,
      location: context.ctx.req.headers.host,
      authenticated: keycloak.token,
      publicWorkspaces,
      userWorkspaces,
    }
}

export default App;