import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from "redux";
import { loadWorkspacesActionType, fetchWorkspacesActionType, selectWorkspace, refreshWorkspace } from '../store/actions/workspaces'
import { loadModelsActionType, fetchModelsActionType } from '../store/actions/models'
import { userLogin, userLogout, userRegister } from '../store/actions/user'
import { setError } from '../store/actions/error'
import { CallApiAction } from './backend';

import * as UserService from '../service/UserService';
import workspaceService from '../service/WorkspaceService';
import { Workspace } from "../types/workspace";

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

const callAPIMiddlewareFn: Middleware = store => next => async (action: AnyAction | CallApiAction) => {

  switch (action.type) {
    case fetchWorkspacesActionType:
      // fetch workspaces from workspaces app
      fetchWorkspacesAction(store.dispatch)
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
      break;
    case refreshWorkspace.toString():
      workspaceService.getWorkspace(store.getState().workspaces.selectedWorkspace.id).then((workspace: Workspace) => next({ ...action, payload: workspace }));
      break;
    default:
      return next(action);
    //
  }
};


export default callAPIMiddlewareFn;