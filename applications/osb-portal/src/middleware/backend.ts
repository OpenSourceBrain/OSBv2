import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from "redux";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";

export type CallApiPayload = {
  successAction: string;
  errorAction: string;
  url: RequestInfo;
  params?: RequestInit;
}

export type CallApiAction = {
  type: string;
  payload: CallApiPayload,
  meta: {
    callApi: true;
  };
};

/**
 * @private
 */
const createCallAPIMiddleware = (
  fetchFn: (input: RequestInfo, init?: RequestInit) => Promise<Response>
) => {
  const callAPIMiddlewareFn: Middleware<Dispatch> = ({
    dispatch
  }: MiddlewareAPI) => next => (action: AnyAction | CallApiAction) => {
    if (!action.meta || !action.meta.callApi) {
      return next(action);
    }

    const { successAction, errorAction, url, params } = action.payload;

    const r = fetchFn(url, params)
      .then(res => {
        if (!res.ok) {
            throw Error(res.statusText);
        }
        return res;
      })
      .then(res => res.json())
      .then(res =>
        dispatch({
          type: successAction,
          payload: res.items
        })
      )
      .catch(res => {
          dispatch({
            type: errorAction,
            payload: res.message + ' : ' + url
          });
        }
      );
    return r;
  };

  return callAPIMiddlewareFn;
}

const callAPIMiddleware = createCallAPIMiddleware(fetch);

export default callAPIMiddleware;