import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from "redux";
import { loadWorkspacesActionType, fetchWorkspacesActionType } from '../store/actions/workspaces'
import { loadNWBFilesActionType, fetchNWBFilesActionType } from '../store/actions/nwbfiles'
import { loadModelsActionType, fetchModelsActionType } from '../store/actions/models'
import { setError } from '../store/actions/error'
import { CallApiAction } from './backend';

import * as workspaceApi from '../apiclient/workspaces/apis';
import { Configuration, RestApi } from '../apiclient/workspaces';
import { WorkspaceGetRequest } from "../apiclient/workspaces/apis/RestApi";

// public call osb action type
export type CallOSBApiAction = {
  type: string;
  meta: {
    callOSBApi: true;
  };
};

const workspacesApiUri = '/api/workspaces/api';
export let workspacesApi: RestApi = null;
export const initApis = (token: string) => {
  workspacesApi = new workspaceApi.RestApi(new Configuration({ basePath: workspacesApiUri, accessToken: token }));
}

// callapi middle actions
const fetchWorkspacesAction = (dispatch: any) => {
  // ToDo: pagination & size of pagination
  const wspr: WorkspaceGetRequest = {};
  workspacesApi.workspaceGet(wspr).then(({ pagination, workspaces }) => {
    dispatch({
      type: loadWorkspacesActionType,
      payload: workspaces
    });
  })
}

const fetchNWBFilesAction = (): CallApiAction => {
  return ({
    type: 'api/fetchNWBFiles',
    payload: {
      url: '/api-mocks/api/nwbfiles',
      successAction: loadNWBFilesActionType,
      errorAction: setError.toString()
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