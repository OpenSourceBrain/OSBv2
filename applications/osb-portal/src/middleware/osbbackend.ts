import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from "redux";
import * as Workspaces from '../store/actions/workspaces'
import { userLogin, userLogout, userRegister } from '../store/actions/user'
import { setError } from '../store/actions/error'


import * as UserService from '../service/UserService';
import workspaceService from '../service/WorkspaceService';
import workspaceResourceService from '../service/WorkspaceResourceService';
import { ResourceStatus, Workspace } from "../types/workspace";


const AUTO_REFRESH_PERIOD = 5000;
let refreshPending = false;

/**
 * @private
 */
const callAPIMiddlewareFn: Middleware = store => next => async (action: AnyAction) => {

  function refreshWorkspaces() {
    workspaceService.fetchWorkspaces(true).then((workspaces) => {
      next(Workspaces.loadPublicWorkspaces(workspaces));
    });
    workspaceService.fetchWorkspaces().then((workspaces) => {
      next(Workspaces.loadUserWorkspaces(workspaces));
    });
    workspaceService.fetchWorkspaces(true, true).then((workspaces) => {
      next(Workspaces.loadFeaturedWorkspaces(workspaces));
    })
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
    case Workspaces.showFeaturedWorkspaces.toString():
      if (!store.getState().workspaces.featuredWorkspaces) {
        workspaceService.fetchWorkspaces(true).then((workspaces) => {
          const featuredWorkspaces = workspaces.filter(ws => ws.featured === true);
          next(Workspaces.loadFeaturedWorkspaces(featuredWorkspaces));
        });
      }
      next(action);
      break;
    case Workspaces.refreshWorkspaces.toString(): {
      refreshWorkspaces();
      break;
    }
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
        const selectedWorkspaceId = action.payload || store.getState().workspaces.selectedWorkspace.id;
        refreshPending = true;
        workspaceService.getWorkspace(selectedWorkspaceId).then(
          (workspace: Workspace) => {
            callback(workspace);
            refreshPending = false;

            setTimeout(() => {
              if (!refreshPending && workspace.resources.find((resource: any) => resource.status === ResourceStatus.pending)) {
                refreshWorkspace(
                  (workspaceUpdated) => {

                    if (workspaceUpdated.resources.length !== workspace.resources.length ||
                      workspaceUpdated.resources.find((resource: any, idx) => resource.status !== workspace.resources[idx].status)) {
                      // update state only if something happened in resources
                      next({ ...action, payload: workspaceUpdated });
                    }

                  }
                );
              }
            }, AUTO_REFRESH_PERIOD);


          },
          () => next(setError("Workspace not found or not accessible"))
        );
      }
      refreshWorkspace((workspace) => next({ ...action, payload: workspace }));

      break;

    case Workspaces.updateWorkspace.toString():
      workspaceService.updateWorkspace(action.payload).then((workspace) => { next({ ...action, payload: workspace }); refreshWorkspaces() });
      break;
    case Workspaces.deleteWorkspace.toString():
      workspaceService.deleteWorkspace(action.payload).then(() => { next(action); refreshWorkspaces() });
      break;
    case Workspaces.resourceAdded.toString():
      const { path, name } = action.payload as { path: string, name: string };
      const workspaceId = store.getState().workspaces.selectedWorkspace.id;
      workspaceResourceService.resourceAdded({
        origin: {
          path
        },
        name,
        workspaceId
      }).then(resource => {
        workspaceService.getWorkspace(workspaceId).then(workspace => next(Workspaces.updateWorkspace(workspace)));

      });
      break;
    default:
      return next(action);
    //
  }
};


export default callAPIMiddlewareFn;


