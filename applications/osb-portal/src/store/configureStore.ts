import { applyMiddleware, createStore, Action } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import loggerMiddleware from "redux-logger";
import rootReducer, { RootState } from "./rootReducer";
import callOSBAPIMiddleware from "../middleware/osbbackend";
import callAPIMiddleware from "../middleware/backend";

export default function configureStore() {
  const middlewares = [loggerMiddleware, callOSBAPIMiddleware, callAPIMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const composedEnhancers = composeWithDevTools(middlewareEnhancer);

  const store = createStore<RootState, Action<any>, {}, {}>(
    rootReducer,
    composedEnhancers
  );

  return store;
}