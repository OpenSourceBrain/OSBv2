import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from "redux";
import { loadWorkspacesActionType, fetchWorkspacesActionType, selectWorkspace } from '../store/actions/workspaces'
import { loadModelsActionType, fetchModelsActionType } from '../store/actions/models'
import { userLogin, userLogout, userRegister } from '../store/actions/user'
import { setError } from '../store/actions/error'
import { CallApiAction } from './backend';

import * as UserService from '../service/UserService';
import workspaceService from '../service/WorkspaceService';
import { Workspace } from "../apiclient/workspaces";

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

const callAPIMiddlewareFn: Middleware<Dispatch> = ({
  dispatch
}: MiddlewareAPI) => next => async (action: AnyAction | CallApiAction) => {

  switch (action.type) {
    case fetchWorkspacesActionType:
      // fetch workspaces from workspaces app
      fetchWorkspacesAction(dispatch)
      break
    case fetchModelsActionType:
      next(fetchModelsAction());
      break
    case userLogin.toString(): {
      if (!action.payload) {
        UserService.login().then((user: any) => next({ ...action, payload: user }));
      } else {
        next(action);
      }

      break;
    }
    case userLogout.toString():
      UserService.logout();
      break;
    case userRegister.toString():
      UserService.register().then((user: any) => next({ ...action, payload: user }));
      break;
    case selectWorkspace.toString():
      workspaceService.getWorkspace(action.payload).then((workspace: Workspace) => next({ ...action, payload: workspace }));
    default:
      return next(action);
    //
  }
};


export default callAPIMiddlewareFn;