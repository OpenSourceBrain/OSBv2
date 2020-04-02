import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CallOSBApiAction } from '../../middleware/osbbackend'
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

export const loadNWBFilesActionType = NWBFileSlice.actions.loadNWBFiles.toString();
export const fetchNWBFilesActionType = 'nwbfiles/fetchNWBFiles';

export const fetchNWBFiles = (): CallOSBApiAction => {
  return ({
    type: fetchNWBFilesActionType,
    meta: {
      callOSBApi: true
    }
  })
}

export default NWBFileSlice.reducer;
