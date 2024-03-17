import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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

export const { getTags, clearTags } = tagsSlice.actions;

export const tagsSliceReducer = tagsSlice.reducer;

export const fetchTagsByGroupId = createAsyncThunk(
  "tags/group",
  async (groupId: string, thunkAPI) => {
    const response: any = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const tags: [string, string][] = [];
        for (let i = 0; i < 1000; ++i) {
          tags.push([`id${i}`, `tag${i + 1}`]);
        }
        resolve(tags);
      }, 1000);
    });
    return response;
  },
);
