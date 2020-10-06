import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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

export const ModelActions = modelSlice.actions;
export default modelSlice.reducer;
