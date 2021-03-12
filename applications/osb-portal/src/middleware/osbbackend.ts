import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from "redux";
import * as Workspaces from '../store/actions/workspaces'
import { loadModelsActionType, fetchModelsActionType } from '../store/actions/models'
import { userLogin, userLogout, userRegister } from '../store/actions/user'
import { setError } from '../store/actions/error'
import { CallApiAction } from './backend';

import * as UserService from '../service/UserService';
import workspaceService from '../service/WorkspaceService';
import { ResourceStatus, Workspace } from "../types/workspace";


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

let refreshPending = false;

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

    case Workspaces.refreshWorkspace.toString():
      function refreshWorkspace(callback: (workspace: Workspace) => any) {
        const workspaceId = action.payload || store.getState().workspaces.selectedWorkspace.id;
        refreshPending = true;
        workspaceService.getWorkspace(workspaceId).then(
          (workspace: Workspace) => {
            callback(workspace);
            refreshPending = false;
            if (!refreshPending && workspace.resources.find((resource: any) => resource.status === ResourceStatus.pending)) {
              setTimeout(() => {

                refreshWorkspace(
                  (workspaceUpdated) => {

                    if (workspaceUpdated.resources.length !== workspace.resources.length ||
                      workspaceUpdated.resources.find((resource: any, idx) => resource.status !== workspace.resources[idx].status)) {
                      // update state only if something happened in resources
                      next({ ...action, payload: workspaceUpdated });
                    }

                  }
                );
              }, 15000);
            }

          },
          () => next(setError("Workspace not found or not accessible"))
        );
      }
      refreshWorkspace((workspace) => next({ ...action, payload: workspace }));

      break;

    case Workspaces.updateWorkspace.toString():
      workspaceService.updateWorkspace(action.payload).then(() => { next(action); refreshWorkspaces() });
      break;
    case Workspaces.deleteWorkspace.toString():
      workspaceService.deleteWorkspace(action.payload).then(() => { next(action); refreshWorkspaces() });
      break;
    default:
      return next(action);
    //
  }
};


export default callAPIMiddlewareFn;


