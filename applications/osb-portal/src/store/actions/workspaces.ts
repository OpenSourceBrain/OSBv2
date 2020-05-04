import { CallOSBApiAction } from '../../middleware/osbbackend'

import { WorkspaceActions } from '../reducers/workspaces'

export const loadWorkspacesActionType = WorkspaceActions.loadWorkspaces.toString();
export const fetchWorkspacesActionType = 'workspaces/fetchWorkspaces';

export const fetchWorkspacesAction = (): CallOSBApiAction => {
  return ({
    type: fetchWorkspacesActionType,
    meta: {
      callOSBApi: true
    }
  })
}
