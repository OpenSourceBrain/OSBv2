import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from "redux";

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
function createCallAPIMiddleware(
  fetchFn: (input: RequestInfo, init?: RequestInit) => Promise<Response>
) {
  const callAPIMiddlewareFn: Middleware<Dispatch> = ({
    dispatch
  }: MiddlewareAPI) => next => (action: AnyAction | CallApiAction) => {
    if (!action.meta || !action.meta.callApi) {
      return next(action);
    }

    const { successAction, errorAction, url, params } = action.payload;

    return fetchFn(url, params)
      .then(res => res.json())
      .then(res =>
        dispatch({
          type: successAction,
          payload: res.data.result
        })
      )
      .catch(res =>
        dispatch({
          type: errorAction,
          payload: res
        })
      );
  };

  return callAPIMiddlewareFn;
}

const callAPIMiddleware = createCallAPIMiddleware(fetch);

export default callAPIMiddleware;