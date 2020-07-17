import { combineReducers } from '@reduxjs/toolkit'
import workspaces from './reducers/workspaces'
import user from './reducers/user'
import drawer from './reducers/drawer';
import error from './reducers/error';
import models from './reducers/models';

const rootReducer = combineReducers({
  drawer,
  error,
  user,
  workspaces,
  models
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer