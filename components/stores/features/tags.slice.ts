import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface TagsStateType {
  tags: string[];
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTagsByGroupId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchTagsByGroupId.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tags = action.payload;
    });
    builder.addCase(fetchTagsByGroupId.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const { getTags } = tagsSlice.actions;

export const tagsSliceReducer = tagsSlice.reducer;

const tags = ["tag1", "tag2", "tag3", "tag4", "tag5"];
export const fetchTagsByGroupId = createAsyncThunk(
  "tags/group",
  async (userId: number, thunkAPI) => {
    const response: any = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(tags);
      }, 1000);
    });
    return response;
  },
);
