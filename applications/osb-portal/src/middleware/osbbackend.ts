import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from "redux";
import * as Workspaces from "../store/actions/workspaces";
import { userLogin, userLogout, userRegister } from "../store/actions/user";
import { setError } from "../store/actions/error";
import * as Tags from "../store/actions/tags";

import * as UserService from "../service/UserService";
import workspaceService from "../service/WorkspaceService";
import workspaceResourceService from "../service/WorkspaceResourceService";
import { ResourceStatus, Workspace } from "../types/workspace";
import RepositoryService from "../service/RepositoryService";
import { RootState } from "../store/rootReducer";

const AUTO_REFRESH_PERIOD = 5000;
let refreshPending = false;

/**
 * @private
 */
const callAPIMiddlewareFn: Middleware =
  ({ getState, dispatch }: { getState: () => RootState, dispatch: any }) =>
  (next) =>
  async (action: AnyAction) => {
    switch (action.type) {
      case userLogin.toString(): {
        if (!action.payload) {
          UserService.login().then((user: any) =>
            next({ ...action, payload: user })
          );
        } else {
          next(action);
        }

        break;
      }
      case userLogout.toString():
        UserService.logout();
        break;
      case userRegister.toString():
        UserService.register().then((user: any) =>
          next({ ...action, payload: user })
        );
        break;
      case Tags.retrieveAllTags.toString():
        RepositoryService.getAllTags(action.payload).then((tagDetails) => {
          next(Tags.loadTags(tagDetails.tags));
        });
        break;

      case Workspaces.refreshWorkspaceResources.toString():
        const selectedWorkspaceId =
            action.payload || getState().workspaces.selectedWorkspace?.id;
        workspaceService.refreshResources(selectedWorkspaceId).then(dispatch(Workspaces.refreshWorkspace(selectedWorkspaceId)));
        break;

      case Workspaces.selectWorkspace.toString():
      case Workspaces.refreshWorkspace.toString():
        async function refreshWorkspace(callback: (workspace: Workspace) => any) {
          const selectedWorkspaceId =
            action.payload || getState().workspaces.selectedWorkspace?.id;
          refreshPending = true;
          
          
          workspaceService.getWorkspace(selectedWorkspaceId).then(
            (workspace: Workspace) => {
              callback(workspace);
              refreshPending = false;

              setTimeout(() => {
                if (
                  !refreshPending &&
                  workspace.resources.find(
                    (resource: any) =>
                      resource.status === ResourceStatus.pending
                  )
                ) {
                  refreshWorkspace((workspaceUpdated) => {
                    if (
                      workspaceUpdated.resources.length !==
                        workspace.resources.length ||
                      workspaceUpdated.resources.find(
                        (resource: any, idx) =>
                          resource.status !== workspace.resources[idx].status
                      )
                    ) {
                      // update state only if something happened in resources
                      next({ ...action, payload:  workspaceUpdated });
                    }
                  });
                }
              }, AUTO_REFRESH_PERIOD);
            },
            () => next(setError("Workspace not found or not accessible"))
          );
        }
        refreshWorkspace((workspace) =>
          next({ ...action, payload: workspace })
        );

        break;

      case Workspaces.updateWorkspace.toString():
        workspaceService.updateWorkspace(action.payload).then((workspace) => {
          next({ ...action, payload: workspace });
        });
        break;
      case Workspaces.deleteWorkspace.toString():
        workspaceService.deleteWorkspace(action.payload).then(() => {
          next(action);
        });
        break;
      case Workspaces.resourceAdded.toString():
        const { path, name } = action.payload as { path: string; name: string };
        const workspaceId = getState().workspaces.selectedWorkspace.id;
        workspaceResourceService
          .resourceAdded({
            origin: {
              path,
            },
            name,
            workspaceId,
          })
          .then((resource) => {
            workspaceService
              .getWorkspace(workspaceId)
              .then((workspace) => next(Workspaces.updateWorkspace(workspace)));
          });
        break;
      default:
        return next(action);
      //
    }
  };

export default callAPIMiddlewareFn;
