import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from './components/index';
import store from './store/store';
import { Provider } from 'react-redux';



import { CONFIGURATION } from "./config";
import { initErrorHandler } from './service/ErrorHandleService';
import { initUser } from './service/UserService';

const renderMain = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('main')
  );
}



const appName = CONFIGURATION.appName;

initErrorHandler(appName).then(initUser).finally(renderMain);

