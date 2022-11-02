import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initialState: boolean = false;

export const aboutDialogSlice = createSlice({
  name: "aboutDialog",
  initialState,
  reducers: {
    openDialog(state) {
      state = true;
      return state;
    },
    closeDialog(state) {
      state = false;
      return state;
    },
  },
});

export const AboutDialogActions = aboutDialogSlice.actions;

export default aboutDialogSlice.reducer;
