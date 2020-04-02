import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CallOSBApiAction } from '../../middleware/osbbackend'
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

export const loadModelsActionType = modelSlice.actions.loadModels.toString();
export const fetchModelsActionType = 'models/fetchModels';

export const fetchModels = (): CallOSBApiAction => {
  return ({
    type: fetchModelsActionType,
    meta: {
      callOSBApi: true
    }
  })
}

export default modelSlice.reducer;
