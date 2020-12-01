import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from "redux";
import * as Workspaces from '../store/actions/workspaces'
import { loadModelsActionType, fetchModelsActionType } from '../store/actions/models'
import { userLogin, userLogout, userRegister } from '../store/actions/user'
import { setError } from '../store/actions/error'
import { CallApiAction } from './backend';

import * as UserService from '../service/UserService';
import workspaceService from '../service/WorkspaceService';
import { Workspace } from "../types/workspace";


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

  function refreshWorkspaces() {
    workspaceService.fetchWorkspaces(true).then((workspaces) => {
      next(Workspaces.loadPublicWorkspaces(workspaces));
    });
    workspaceService.fetchWorkspaces().then((workspaces) => {
      next(Workspaces.loadUserWorkspaces(workspaces));
    });
  }

  switch (action.type) {
    case Workspaces.showPublicWorkspaces.toString():
      if (!store.getState().workspaces.publicWorkspaces) {
        workspaceService.fetchWorkspaces(true).then((workspaces) => {
          next(Workspaces.loadPublicWorkspaces(workspaces));
        });
      }
      next(action);
      break;
    case Workspaces.showUserWorkspaces.toString():
        if (!store.getState().workspaces.userWorkspaces) {
          workspaceService.fetchWorkspaces(false).then((workspaces) => {
            next(Workspaces.loadUserWorkspaces(workspaces));
          });
        }
        next(action);
        break;
    case Workspaces.refreshWorkspacesActionType: {
      refreshWorkspaces();
    }
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
    case Workspaces.selectWorkspace.toString():
      workspaceService.getWorkspace(action.payload).then((workspace: Workspace) => next({ ...action, payload: workspace }));
      break;
    case Workspaces.refreshWorkspace.toString():
      workspaceService.getWorkspace(store.getState().workspaces.selectedWorkspace.id).then((workspace: Workspace) => next({ ...action, payload: workspace }));
      break;
      case Workspaces.updateWorkspace.toString():
        workspaceService.updateWorkspace(action.payload).then(() => { next(action); refreshWorkspaces()});
        break;
      case Workspaces.deleteWorkspace.toString():
        workspaceService.deleteWorkspace(action.payload).then(() => { next(action); refreshWorkspaces()});
        break;
    default:
      return next(action);
    //
  }
};


export default callAPIMiddlewareFn;


