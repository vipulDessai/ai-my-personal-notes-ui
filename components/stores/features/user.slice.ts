import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UserStateType {
  isLoading: boolean;
  error: string;
}

const initialState: UserStateType = {
  isLoading: false,
  error: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserIsLoading: (
      state,
      action: PayloadAction<{
        value: boolean;
      }>,
    ) => {
      const { value } = action.payload;
      state.isLoading = value;
    },
    setUserDataError: (
      state,
      action: PayloadAction<{
        value: string;
      }>,
    ) => {
      const { value } = action.payload;
      state.error = value;
    },
  },
});

export const userSliceReducer = userSlice.reducer;

export const { setUserDataError, setUserIsLoading } = userSlice.actions;
