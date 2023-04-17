import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";

import { App } from "./components";
import store from "./store/store";
import { Provider } from "react-redux";
import { userLogin } from "./store/actions/user";
import { retrieveAllTags } from "./store/actions/tags";

import { CONFIGURATION } from "./config";
import { initErrorHandler } from "./service/ErrorHandleService";
import { initUser, checkUser } from "./service/UserService";

import { UserInfo } from "./types/user";

const root = ReactDOMClient.createRoot(document.getElementById("main"));

const appName = CONFIGURATION.appName;

const timeout = (ms: number, promise: Promise<any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
};

console.log(root, App);






timeout(10000, checkUser()).then((user: UserInfo) => {
  if (user) {
    store.dispatch(userLogin(user));
  } 
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}, () => root.render(
  <Provider store={store}>
    <App />
  </Provider>
));
initErrorHandler(appName);

store.dispatch(retrieveAllTags);
