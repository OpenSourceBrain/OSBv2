import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";
import { initUser, checkUser } from "./service/UserService";
import { App } from './App';
import { UserInfo } from "./types/user";


import { CONFIGURATION } from "./config";
import { initErrorHandler } from './service/ErrorHandleService';
const root = ReactDOMClient.createRoot(document.getElementById("main"));

const timeout = (ms: number, promise: Promise<any>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
};

console.log(root, App);



root.render(
  <App />
);




