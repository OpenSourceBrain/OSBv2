import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CallOSBApiAction } from '../../middleware/osbbackend'
import { Workspace } from '../../types/workspace'

const initialState: Workspace[] = [];

const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    loadWorkspaces(state, action: PayloadAction<Workspace[]>) {
      return action.payload;
    },
  }
});

export const loadWorkspacesActionType = workspaceSlice.actions.loadWorkspaces.toString();
export const fetchWorkspacesActionType = 'workspaces/fetchWorkspaces';

export const fetchWorkspaces = (): CallOSBApiAction => {
  return ({
    type: fetchWorkspacesActionType,
    meta: {
      callOSBApi: true
    }
  })
}

export default workspaceSlice.reducer;
