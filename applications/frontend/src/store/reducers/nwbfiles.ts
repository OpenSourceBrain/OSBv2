import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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

export const NWBFileActions = NWBFileSlice.actions;
export default NWBFileSlice.reducer;
