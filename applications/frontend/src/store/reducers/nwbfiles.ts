import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CallApiAction } from '../../middleware/backend'
import { NWBFile } from '../../types/nwbfile'

const initialState: NWBFile[] = [];

const NWBFileSlice = createSlice({
    name: 'nwbfiles',
    initialState,
    reducers: {
        loadNWBFiles(state, action: PayloadAction<NWBFile[]>) {
            return action.payload;
        },
    }
});

export const fetchNWBFiles = (): CallApiAction => {
    return ({
      type: 'models/fetchModels',
      payload: {
        url: '/api/models',
        successAction: NWBFileSlice.actions.loadNWBFiles.toString(),
        errorAction: 'ERROR'
      },
      meta: {
        callApi: true
      }
    })
  }

export default NWBFileSlice.reducer;
