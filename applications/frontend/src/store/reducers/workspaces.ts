import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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

export const WorkspaceActions = workspaceSlice.actions
export default workspaceSlice.reducer;
