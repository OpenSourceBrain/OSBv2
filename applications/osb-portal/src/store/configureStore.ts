import { applyMiddleware, createStore, Action } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import loggerMiddleware from "redux-logger";
import rootReducer, { RootState } from "./rootReducer";
import osbMiddleware from "../middleware/osbbackend";

export default function configureStore() {
  const middlewares = [loggerMiddleware, osbMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const composedEnhancers = composeWithDevTools(middlewareEnhancer);

  const store = createStore<RootState, Action<any>, {}, {}>(
    rootReducer,
    composedEnhancers
  );

  return store;
}
