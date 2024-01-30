import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postData } from "../../utils";

interface UserStateType {
  authToken: string;
  isLoading: boolean;
  error: any;
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
      state.authToken = action.payload;
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
    const res = await postData(
      `${process.env.NEXT_PUBLIC_API_HOST}/graphql`,
      payload,
      headers,
    );

    return res.data;
  },
);
