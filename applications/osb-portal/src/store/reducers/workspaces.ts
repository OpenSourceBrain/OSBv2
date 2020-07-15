import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Workspace } from '../../types/workspace';

interface WorkspaceState {
  userWorkspaces: Workspace[],
  publicWorkspaces: Workspace[],
  selectedWorkspace: Workspace
}

const initialState: WorkspaceState = {
  userWorkspaces: null,
  publicWorkspaces: [],
  selectedWorkspace: null
};


const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    loadWorkspaces(state, action: PayloadAction<Workspace[]>) {
      return { ...state, publicWorkspaces: action.payload };
    },
    selectWorkspace(state, action: PayloadAction<Workspace>) {
      return { ...state, selectedWorkspace: action.payload }
    },
    loadUserWorkspaces(state, action: PayloadAction<Workspace[]>) {
      return { ...state, userWorkspaces: action.payload }
    }
  }
});

export const WorkspaceActions = workspaceSlice.actions;
export default workspaceSlice.reducer;
