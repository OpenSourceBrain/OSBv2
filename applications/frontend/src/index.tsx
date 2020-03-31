import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from './components/index';
import store from './store/store';
import { Provider } from 'react-redux';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('main')
);
