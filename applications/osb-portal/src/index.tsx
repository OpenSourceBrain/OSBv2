import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./components/index";
import store from "./store/store";
import { Provider } from "react-redux";
import { userLogin } from "./store/actions/user";
import { retrieveAllTags } from "./store/actions/tags";

import { CONFIGURATION } from "./config";
import { initErrorHandler } from "./service/ErrorHandleService";
import { initUser } from "./service/UserService";

import { UserInfo } from "./types/user";

const renderMain = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("main")
  );
};

const appName = CONFIGURATION.appName;

const timeout = (ms: number, promise: Promise<any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
};

timeout(20000, initUser())
  .then((user: UserInfo) => {
    if (user) {
      store.dispatch(userLogin(user));
    }
  })
  .finally(renderMain);

initErrorHandler(appName);

store.dispatch(retrieveAllTags);
