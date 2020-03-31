import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// import { AppThunk, AppDispatch } from '../store'

import { UserInfo } from '../../types/user'

export const initialState: UserInfo = null;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogin(state, action: PayloadAction<UserInfo>) {
        return {...action.payload};
      },
    userLogout(state, action: PayloadAction<UserInfo>) {
        return null;
      },
    }
});

export const { userLogin, userLogout } = userSlice.actions;

export default userSlice.reducer;
