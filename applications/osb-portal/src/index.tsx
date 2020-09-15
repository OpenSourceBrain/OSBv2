import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from './components/index';
import store from './store/store';
import { Provider } from 'react-redux';
import { userLogin } from './store/actions/user';


import { CONFIGURATION } from "./config";
import { initErrorHandler } from './service/ErrorHandleService';
import { initUser } from './service/UserService';

import { UserInfo } from "./types/user";

const renderMain = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('main')
  );
}



const appName = CONFIGURATION.appName;


function timeout(ms: number, promise: Promise<any>) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("timeout"))
    }, ms)
    promise.then(resolve, reject)
  })
}

timeout(1000, fetch('/hello')).then(function(response) {
  // process response
}).catch(function(error) {
  // might be a timeout error
})


timeout(1000, initUser()).then((user: UserInfo) => {
  if (user) {
    store.dispatch(userLogin(user));
  }
}).finally(renderMain);

initErrorHandler(appName);

