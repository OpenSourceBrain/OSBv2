import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from "redux";
import { loadWorkspacesActionType, fetchWorkspacesActionType } from '../store/reducers/workspaces'
import { loadNWBFilesActionType, fetchNWBFilesActionType } from '../store/reducers/nwbfiles'
import { loadModelsActionType, fetchModelsActionType } from '../store/reducers/models'
import { CallApiAction } from './backend'

// public call osb action type
export type CallOSBApiAction = {
  type: string;
  meta: {
    callOSBApi: true;
  };
};

// callapi middle actions
const fetchWorkspaces = (): CallApiAction => {
  return ({
    type: 'api/fetchWorkspaces',
    payload: {
      url: '/api-mocks/workspaces',
      successAction: loadWorkspacesActionType,
      errorAction: 'ERROR'
    },
    meta: {
      callApi: true
    }
  })
}

const fetchNWBFiles = (): CallApiAction => {
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

const fetchModels = (): CallApiAction => {
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
        apiAction = fetchWorkspaces()
        break
      case fetchNWBFilesActionType:
        apiAction = fetchNWBFiles()
        break
      case fetchModelsActionType:
        apiAction = fetchModels()
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