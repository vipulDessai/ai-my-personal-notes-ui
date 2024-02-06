import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postData } from "../../utils";

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
      state.authToken = action.payload.data?.token;
      state.isLoading = false;
    });
    builder.addCase(fetchAuthToken.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAuthToken.rejected, (state, action) => {
      state.error = action.payload;
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
    const payload = JSON.stringify({
      query: `mutation getTokenMutation {
          token(
            email: ${process.env.NEXT_PUBLIC_API_USER_ID}, 
            password: ${process.env.NEXT_PUBLIC_API_USER_PWD}
          )
        }`,
      variables: {},
    });
    return await postData<UserTokenRes>(
      `${process.env.NEXT_PUBLIC_API_HOST}/graphql`,
      payload,
      headers,
    );
  },
);
