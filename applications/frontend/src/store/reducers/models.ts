import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CallApiAction } from '../../middleware/backend'
import { Model } from '../../types/model'

const initialState: Model[] = [];

const modelSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    loadModels(state, action: PayloadAction<Model[]>) {
      return action.payload;
    },
  }
});

export const fetchModels = (): CallApiAction => {
  return ({
    type: 'models/fetchModels',
    payload: {
      url: '/api/models',
      successAction: modelSlice.actions.loadModels.toString(),
      errorAction: 'ERROR'
    },
    meta: {
      callApi: true
    }
  })
}

export default modelSlice.reducer;
