import {
  createSlice,
  PayloadAction,
  AnyAction,
  Action,
} from "@reduxjs/toolkit";

import { Workspace } from "../../types/workspace";
import * as UserActions from "../actions/user";

interface RepositoriesState {
  counter: number;
}

export const initialState: RepositoriesState = {
  counter: 0,
};

const repositoriesSlice = createSlice({
  name: "repositories",
  initialState,
  reducers: {
    refreshRepositories(state, action: AnyAction) {
      return { ...state, counter: state.counter + 1 };
    },
  },
});

export const RepositoriesActions = repositoriesSlice.actions;

function reduceRest(state: RepositoriesState, action: Action) {
  switch (action.type) {
    case UserActions.userLogin.type:
      return { ...state, showPublic: false };
  }
}

export default (state: RepositoriesState, action: Action) => ({
  ...repositoriesSlice.reducer(state, action),
  ...reduceRest(state, action),
});
