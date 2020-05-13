import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from "redux";
import { loadWorkspacesActionType, fetchWorkspacesActionType } from '../store/actions/workspaces'
import { loadNWBFilesActionType, fetchNWBFilesActionType } from '../store/actions/nwbfiles'
import { loadModelsActionType, fetchModelsActionType } from '../store/actions/models'
import { CallApiAction } from './backend'
import { keycloak } from '../index'

// public call osb action type
export type CallOSBApiAction = {
  type: string;
  meta: {
    callOSBApi: true;
  };
};

// callapi middle actions
const fetchWorkspacesAction = (): CallApiAction => {
  // ToDo: pagination & size of pagination
  return ({
    type: 'api/fetchWorkspaces',
    payload: {
      url: '/api/workspaces/api/workspace?page=1&per_page=2000',
      successAction: loadWorkspacesActionType,
      errorAction: 'ERROR',
      params: {
        headers: {'Authorization': 'Bearer ' + keycloak.token}}
    },
    meta: {
      callApi: true
    }
  })
}

const fetchNWBFilesAction = (): CallApiAction => {
  return ({
    type: 'api/fetchNWBFiles',
    payload: {
      url: '/api-mocks/nwbfiles',
      successAction: loadNWBFilesActionType,
      errorAction: 'ERROR'
    },
    meta: {
      callApi: true
    }
  })
}

const fetchModelsAction = (): CallApiAction => {
  return ({
    type: 'api/fetchModels',
    payload: {
      url: '/api-mocks/models',
      successAction: loadModelsActionType,
      errorAction: 'ERROR'
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
        apiAction = fetchWorkspacesAction()
        break
      case fetchNWBFilesActionType:
        apiAction = fetchNWBFilesAction()
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