import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from "redux";


import { RootState } from "../store/rootReducer";


/**
 * @private
 */
const callAPIMiddlewareFn: Middleware = ({ getState }: { getState: () => RootState }) => next => async (action: AnyAction) => {



  switch (action.type) {

    
    default:
      return next(action);
    //
  }
};


export default callAPIMiddlewareFn;


