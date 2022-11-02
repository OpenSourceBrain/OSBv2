import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: boolean = false;

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    toggleDrawer(state, action: PayloadAction<boolean>) {
      return !state;
    },
  },
});

export const DrawerActions = drawerSlice.actions;

export default drawerSlice.reducer;
