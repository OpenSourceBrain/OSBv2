import { combineReducers } from '@reduxjs/toolkit'
import workspaces from './reducers/workspaces'
import user from './reducers/user'
import drawer from './reducers/drawer';
import models from './reducers/models';
import nwbfiles from './reducers/nwbfiles'

const rootReducer = combineReducers({
  drawer,
  user,
  workspaces,
  models,
  nwbfiles
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer