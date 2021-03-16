
import { WorkspaceActions } from '../reducers/workspaces'

export const { loadPublicWorkspaces: loadPublicWorkspaces, loadUserWorkspaces, selectWorkspace, refreshWorkspace, showPublicWorkspaces, showUserWorkspaces, deleteWorkspace, updateWorkspace, resourceAdded } = WorkspaceActions;

export const postWorkspacesActionType = 'workspaces/postWorkspace';
export const refreshWorkspacesActionType = 'workspaces/refreshWorkspace';

// public call osb action type
export type CallOSBApiAction = {
  type: string;
  meta: {
    callOSBApi: true;
  };
};


export const refreshWorkspaces = () => ({ type: refreshWorkspacesActionType });


export const postWorkspacesAction = (): CallOSBApiAction => {
  return ({
    type: postWorkspacesActionType,
    meta: {
      callOSBApi: true
    }
  })
}
