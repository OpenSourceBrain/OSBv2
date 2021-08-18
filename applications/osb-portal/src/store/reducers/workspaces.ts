import { createSlice, PayloadAction, AnyAction, Action } from '@reduxjs/toolkit'

import { Workspace } from '../../types/workspace';
import * as UserActions from '../actions/user';

interface WorkspaceState {
  userWorkspaces: Workspace[],
  publicWorkspaces: Workspace[],
  featuredWorkspaces: Workspace[],
  selectedWorkspace: Workspace,
  showPublic: boolean,
  showFeatured: boolean,
}

export const initialState: WorkspaceState = {
  userWorkspaces: null,
  publicWorkspaces: null,
  selectedWorkspace: null,
  featuredWorkspaces: null,
  showPublic: false,
  showFeatured: true,
};


const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    showPublicWorkspaces(state, action: Action) {
      return { ...state, showPublic: true, showFeatured: false };
    },
    showUserWorkspaces(state, action: Action) {
      return { ...state, showPublic: false };
    },
    showFeaturedWorkspaces(state, action: Action) {
      return { ...state, showFeatured: true, showPublic: false };
    },
    loadPublicWorkspaces(state, action: PayloadAction<Workspace[]>) {
      return { ...state, publicWorkspaces: action.payload };
    },
    loadFeaturedWorkspaces(state, action: PayloadAction<Workspace[]>) {
      return { ...state, featuredWorkspaces: action.payload };
    },
    selectWorkspace(state, action: PayloadAction<Workspace>) {
      return { ...state, selectedWorkspace: action.payload }
    },
    refreshWorkspace(state, action: AnyAction) {
      return { ...state, selectedWorkspace: action.payload }
    },
    loadUserWorkspaces(state, action: PayloadAction<Workspace[]>) {
      return { ...state, userWorkspaces: action.payload }
    },
    deleteWorkspace(state, action: PayloadAction<number>) {
      return state; // everything goes in the middleware
    },
    updateWorkspace(state, action: PayloadAction<Workspace>) {
      return { ...state, selectedWorkspace: action.payload };
    },
    resourceAdded(state, action: PayloadAction<Workspace>) {
      return state;
    }
  }
});



export const WorkspaceActions = workspaceSlice.actions;


function reduceRest(state: WorkspaceState, action: Action) {
  switch (action.type) {

    case UserActions.userLogin.type:
      return { ...state, showPublic: false }
  }
}

export default (state: WorkspaceState, action: Action) => ({ ...workspaceSlice.reducer(state, action), ...reduceRest(state, action) })