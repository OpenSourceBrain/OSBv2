import { createSlice, PayloadAction, AnyAction, Action } from '@reduxjs/toolkit'

import { Workspace } from '../../types/workspace';
import * as UserActions from '../actions/user';

export enum WorkspaceSelection {
  USER,
  PUBLIC,
  FEATURED,
}


interface WorkspaceState {
  workspaces: Workspace[],
  page: number,
  selectedWorkspace: Workspace,
  selection: WorkspaceSelection
}


export const initialState: WorkspaceState = {
  workspaces: null,
  selectedWorkspace: null,
  selection: WorkspaceSelection.FEATURED,
  page: 1
};


const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    showPublicWorkspaces(state, action: Action) {
      return { ...state, selection: WorkspaceSelection.PUBLIC, page: 1 };
    },
    showUserWorkspaces(state, action: Action) {
      return { ...state, selection: WorkspaceSelection.USER, page: 1 };
    },
    showFeaturedWorkspaces(state, action: PayloadAction<number>) {
      return { ...state, selection: WorkspaceSelection.FEATURED, page: 1 };
    },
    loadWorkspaces(state, action: PayloadAction<Workspace[]>) {
      return { ...state, workspaces: action.payload };
    },
    selectWorkspace(state, action: PayloadAction<Workspace>) {
      return { ...state, selectedWorkspace: action.payload }
    },
    refreshWorkspace(state, action: AnyAction) {
      return { ...state, selectedWorkspace: action.payload }
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