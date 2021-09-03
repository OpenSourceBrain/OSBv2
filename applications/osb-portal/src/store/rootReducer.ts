import { combineReducers } from '@reduxjs/toolkit'
import workspaces from './reducers/workspaces'
import user from './reducers/user'
import drawer from './reducers/drawer';
import error from './reducers/error';
import tags from './reducers/tags';

const rootReducer = combineReducers({
  drawer,
  error,
  user,
  workspaces,
  tags,
})


export type RootState = ReturnType<typeof rootReducer>

export default rootReducer