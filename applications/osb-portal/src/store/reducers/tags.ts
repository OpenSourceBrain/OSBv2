import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tag } from "../../apiclient/workspaces/models/Tag";

export const initialState: Tag[] = [];

export const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    retrieveAllTags(state, action: PayloadAction<number>) {
      return state;
    },
    loadTags(state, action: PayloadAction<Tag[]>) {
      return action.payload;
    },
  },
});

export const TagsActions = tagsSlice.actions;

export default tagsSlice.reducer;
