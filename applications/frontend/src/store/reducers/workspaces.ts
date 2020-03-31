import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CallApiAction } from '../../middleware/backend'
import { Workspace } from '../../types/workspace'

const initialState: Workspace[] = [];

const workspaceSlice = createSlice({
    name: 'workspaces',
    initialState,
    reducers: {
        loadWorkspaces(state, action: PayloadAction<Workspace[]>) {
            return action.payload;
        },
    }
});

export const fetchWorkspaces = (): CallApiAction => {
    return ({
      type: 'models/fetchModels',
      payload: {
        url: '/api/models',
        successAction: workspaceSlice.actions.loadWorkspaces.toString(),
        errorAction: 'ERROR'
      },
      meta: {
        callApi: true
      }
    })
  }

export default workspaceSlice.reducer;
