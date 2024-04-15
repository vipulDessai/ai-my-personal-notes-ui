import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface TagsStateType {
  tags: [string, string][];
  isLoading: boolean;
  error: any;
}

const initialState: TagsStateType = {
  tags: [],
  isLoading: false,
  error: null,
};

export const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    getTags: (
      state,
      action: PayloadAction<{
        value: boolean;
      }>,
    ) => {},
    clearTags: (state) => {
      state.tags = [];
    },
  },
});

export const { getTags, clearTags } = tagsSlice.actions;

export const tagsSliceReducer = tagsSlice.reducer;
