import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string = null;

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string>) {
      return action.payload;
    },
  },
});

export const ErrorActions = errorSlice.actions;

export default errorSlice.reducer;
