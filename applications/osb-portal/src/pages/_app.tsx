import * as React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline, makeStyles, Box } from "@material-ui/core";
import { SSRKeycloakProvider, SSRCookies, getKeycloakInstance } from '@react-keycloak/ssr';

import { Provider } from 'react-redux';

import theme from "../theme";
import { Header, ErrorDialog } from "../components";
import store from '../store/store';
import { keycloakCfg } from "../config";
import SentryErrorBoundary from "../components/sentry/SentryErrorBoundary";
import type { AppProps, AppContext } from 'next/app'
import { parseCookies } from "../utils";
import { useUserService } from "../service/UserService";
import { Workspace } from "../types/workspace";

import { TinaCMS, TinaProvider, useForm, usePlugin } from 'tinacms'



interface InitialProps {
  cookies: unknown,
  location: string,
  token: string,
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

const MainLayout = ({ token, Component, pageProps, ...rest }: any) => {

  const userService = useUserService();
  const classes = useStyles();

  const cms = new TinaCMS({ enabled: userService.getLoggedInUser() != null, sidebar: true })

  return <TinaProvider cms={cms}>
    <div className={classes.mainContainer}>

      <Header />

      <Component {...pageProps} {...rest} />

    </div>
  </TinaProvider>


}

export const App = (props: AppProps & InitialProps) => {

  const { Component, pageProps, location, cookies, token, ...rest } = props;




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

            <MainLayout {...props} />

          </SSRKeycloakProvider>
        </ThemeProvider>
      </SentryErrorBoundary>
    </Provider>
  );
};



App.getInitialProps = async (context: AppContext) => {
  // Extract cookies from AppContext
  const cookies = parseCookies(context?.ctx?.req);
  const keycloak = getKeycloakInstance(keycloakCfg, SSRCookies(cookies));

  return {
    cookies,
    token: keycloak.token,
    location: context.ctx.req.headers.host,
  }
}

export default App;