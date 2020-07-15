import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from "redux";
import { loadWorkspacesActionType, fetchWorkspacesActionType } from '../store/actions/workspaces'
import { loadModelsActionType, fetchModelsActionType } from '../store/actions/models'
import { setError } from '../store/actions/error'
import { CallApiAction } from './backend';

import workspaceService from '../service/WorkspaceService';

// public call osb action type
export type CallOSBApiAction = {
  type: string;
  meta: {
    callOSBApi: true;
  };
};

// callapi middle actions
const fetchWorkspacesAction = (dispatch: any) => {
  // ToDo: pagination & size of pagination
  workspaceService.fetchWorkspaces().then((workspaces) => {
    dispatch({
      type: loadWorkspacesActionType,
      payload: workspaces
    });
  })
}


const fetchModelsAction = (): CallApiAction => {
  return ({
    type: 'api/fetchModels',
    payload: {
      url: '/api-mocks/api/models',
      successAction: loadModelsActionType,
      errorAction: setError.toString()
    },
    meta: {
      callApi: true
    }
  })
}

/**
 * @private
 */
function createOSBAPIMiddleware() {
  const callAPIMiddlewareFn: Middleware<Dispatch> = ({
    dispatch
  }: MiddlewareAPI) => next => (action: AnyAction | CallApiAction) => {
    if (!action.meta || !action.meta.callOSBApi) {
      return next(action);
    }

    let apiAction = null;
    switch (action.type) {
      case fetchWorkspacesActionType:
        // fetch workspaces from workspaces app
        fetchWorkspacesAction(dispatch)
        break
      case fetchModelsActionType:
        apiAction = fetchModelsAction()
        break
      default:
      //
    }
    if (apiAction) {
      // dispatch action to call api middleware
      dispatch(apiAction)
    }
  };
  return callAPIMiddlewareFn;
}

const callOSBAPIMiddleware = createOSBAPIMiddleware();

export default callOSBAPIMiddleware;