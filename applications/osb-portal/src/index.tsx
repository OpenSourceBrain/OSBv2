import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from './components/index';
import store from './store/store';
import { Provider } from 'react-redux';

import Keycloak from 'keycloak-js';
import { userLogin } from './store/actions/user';
import { fetchWorkspacesAction } from './store/actions/workspaces';
import { initApis } from "./middleware/osbbackend";

import { CONFIGURATION } from "./config";
import * as Sentry from '@sentry/react';

const appName = CONFIGURATION.appName;
const commonUrl = window.location.host.replace('www', 'common') + '/api/sentry/getdsn/' + appName;
fetch(commonUrl)
  .then(response => response.json())
  .then(sentryDSN => Sentry.init({ dsn: sentryDSN.dsn }))
  .catch(err => {
    // continue without Sentry
  });

export const keycloak = Keycloak('/keycloak.json');
keycloak.init({
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
}).then(async (authorized: boolean) => {
  if (authorized) {
    const userInfo: any = await keycloak.loadUserInfo();
    store.dispatch(userLogin({
      id: userInfo.sub,
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
      emailAddress: userInfo.email
      })
    );
  }
  initApis(keycloak.token);
}).finally(() => {
  store.dispatch(fetchWorkspacesAction());
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('main')
  );
});

// set token refresh to 5 minutes
keycloak.onTokenExpired = () => {
  keycloak.updateToken(5).success((refreshed) => {
    if (refreshed) {
      initApis(keycloak.token);
      store.dispatch(fetchWorkspacesAction());
    } else {
      alert('not refreshed ' + new Date());
    }
  }).error(() => {
    alert('Failed to refresh token ' + new Date());
  });
}
