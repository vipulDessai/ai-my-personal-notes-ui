import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loadingInProgress: false,
};

export const commonLoaderSlice = createSlice({
  name: "common-loader",
  initialState,
  reducers: {
    showLoader: (state) => {
      state.loadingInProgress = true;
    },
    hideLoader: (state) => {
      state.loadingInProgress = false;
    },
  },
});

export const { showLoader, hideLoader } = commonLoaderSlice.actions;

export const commonLoaderSliceReducer = commonLoaderSlice.reducer;
