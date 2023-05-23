import {
  createSlice,
  PayloadAction,
  AnyAction,
  Action,
} from "@reduxjs/toolkit";

import { Workspace } from "../../types/workspace";
import * as UserActions from "../actions/user";

interface WorkspaceState {
  counter: number;
  selectedWorkspace: Workspace;
}

export const initialState: WorkspaceState = {
  counter: 0,
  selectedWorkspace: null,
};

const workspaceSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {
    selectWorkspace(state, action: PayloadAction<Workspace>) {
      return { ...state, selectedWorkspace: action.payload };
    },
    refreshWorkspace(state, action: PayloadAction<Workspace>) {
      return {
        ...state,
        selectedWorkspace: action.payload,
        counter: state.counter + 1,
      };
    },
    refreshWorkspaceResources(state, action: AnyAction) {
      return state;
    },
    refreshWorkspaces(state, action: AnyAction) {
      console.log(action.payload, action, "action");

      return { ...state, counter: state.counter + 1 };
    },
    deleteWorkspace(state, action: PayloadAction<number>) {
      return { ...state, counter: state.counter + 1 }; // everything goes in the middleware
    },
    updateWorkspace(state, action: PayloadAction<Workspace>) {
      return {
        ...state,
        selectedWorkspace: action.payload,
        counter: state.counter + 1,
      };
    },
    resourceAdded(state, action: PayloadAction<Workspace>) {
      return state;
    },
  },
});

export const WorkspaceActions = workspaceSlice.actions;

function reduceRest(state: WorkspaceState, action: Action) {
  switch (action.type) {
    case UserActions.userLogin.type:
      return { ...state, showPublic: false };
  }
}

export default (state: WorkspaceState, action: Action) => ({
  ...workspaceSlice.reducer(state, action),
  ...reduceRest(state, action),
});
