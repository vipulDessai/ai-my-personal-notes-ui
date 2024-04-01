import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UserStateType {
  authToken: string | undefined;
  isLoading: boolean;
  error: any;
}
interface UserTokenRes {
  data: {
    token: string;
  };
}

const initialState: UserStateType = {
  authToken: "",
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAuthToken.fulfilled, (state, action) => {
      state.authToken = action.payload.token;
      state.isLoading = false;
    });
    builder.addCase(fetchAuthToken.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAuthToken.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
  },
});

export const userSliceReducer = userSlice.reducer;

export const fetchAuthToken = createAsyncThunk(
  "user/authenticate",
  async () => {
    const headers = {
      "Content-Type": "application/json",
    };

    return new Promise((res, rej) => {
      res({
        payload: {
          data: {},
        },
      });
    });
  },
);
