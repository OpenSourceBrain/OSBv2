import { CallOSBApiAction } from '../../middleware/osbbackend'

import { WorkspaceActions } from '../reducers/workspaces'

export const loadWorkspacesActionType = WorkspaceActions.loadWorkspaces.toString();
export const fetchWorkspacesActionType = 'workspaces/fetchWorkspaces';
export const postWorkspacesActionType = 'workspaces/postWorkspace';

export const fetchWorkspacesAction = (): CallOSBApiAction => {
  return ({
    type: fetchWorkspacesActionType,
    meta: {
      callOSBApi: true
    }
  })
}

export const postWorkspacesAction = (): CallOSBApiAction => {
  return ({
    type: postWorkspacesActionType,
    meta: {
      callOSBApi: true
    }
  })
}
