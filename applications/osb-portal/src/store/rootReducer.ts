import { combineReducers } from "@reduxjs/toolkit";
import workspaces from "./reducers/workspaces";
import user from "./reducers/user";
import drawer from "./reducers/drawer";
import error from "./reducers/error";
import tags from "./reducers/tags";
import aboutDialog from "./reducers/aboutdialog";

const rootReducer = combineReducers({
  drawer,
  error,
  user,
  workspaces,
  tags,
  aboutDialog,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
