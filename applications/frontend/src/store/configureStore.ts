import { applyMiddleware, createStore, Action } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import loggerMiddleware from "redux-logger";
import rootReducer, { RootState } from "./rootReducer";
import callAPIMiddleware from "../middleware/backend";

export default function configureStore(preloadedState: RootState) {
  const middlewares = [loggerMiddleware, callAPIMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const composedEnhancers = composeWithDevTools(middlewareEnhancer);

  const store = createStore<RootState, Action<any>, {}, {}>(
    rootReducer,
    preloadedState,
    composedEnhancers
  );

  return store;
}