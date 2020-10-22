import { createSlice, PayloadAction, AnyAction, Action } from '@reduxjs/toolkit'

import { Workspace } from '../../types/workspace';

interface WorkspaceState {
  userWorkspaces: Workspace[],
  publicWorkspaces: Workspace[],
  selectedWorkspace: Workspace,
  showPublic: boolean
}

export const initialState: WorkspaceState = {
  userWorkspaces: null,
  publicWorkspaces: [],
  selectedWorkspace: null,
  showPublic: true
};


const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    showPublicWorkspaces(state, action: Action){
      return { ...state, showPublic: true };
    },
    showUserWorkspaces(state, action: Action){
      return { ...state, showPublic: false };
    },
    loadPublicWorkspaces(state, action: PayloadAction<Workspace[]>) {
      return { ...state, publicWorkspaces: action.payload };
    },
    selectWorkspace(state, action: PayloadAction<Workspace>) {
      return { ...state, selectedWorkspace: action.payload }
    },
    refreshWorkspace(state, action: AnyAction) {
      return { ...state, selectedWorkspace: action.payload }
    },
    loadUserWorkspaces(state, action: PayloadAction<Workspace[]>) {
      return { ...state, userWorkspaces: action.payload }
    }
  }
});

export const WorkspaceActions = workspaceSlice.actions;

export default workspaceSlice.reducer;
