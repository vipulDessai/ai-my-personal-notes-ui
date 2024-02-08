import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Severity = "error" | "warning" | "info" | "success";

export interface asyncTasksState {
  alert: {
    title: string;
    message: string;
    type: Severity;
  };
  loadingInProgress: boolean;
}

export interface alertStatePayload {
  title: string;
  message: string;
}

const initialState: asyncTasksState = {
  alert: {
    title: "",
    message: "",
    type: "info",
  },
  loadingInProgress: false,
};

export const appFeedbackSlice = createSlice({
  name: "common-loader",
  initialState,
  reducers: {
    showLoader: (state) => {
      state.loadingInProgress = true;
    },
    hideLoader: (state) => {
      state.loadingInProgress = false;
    },
    setError: (state, action: PayloadAction<alertStatePayload>) => {
      state.alert = {
        type: "error",
        message: action.payload.message,
        title: action.payload.title,
      };
    },
    setInfo: (state, action: PayloadAction<alertStatePayload>) => {
      state.alert.type = "info";
      state.alert.message = action.payload.message;
      state.alert.title = action.payload.title;
    },
    setWarning: (state, action: PayloadAction<alertStatePayload>) => {
      state.alert.type = "info";
      state.alert.message = action.payload.message;
      state.alert.title = action.payload.title;
    },
    setSuccess: (state, action: PayloadAction<alertStatePayload>) => {
      state.alert.type = "success";
      state.alert.message = action.payload.message;
      state.alert.title = action.payload.title;
    },
    resetAlert: (state) => {
      state.alert.type = "info";
      state.alert.message = "";
      state.alert.title = "";
    },
  },
});

export const {
  showLoader,
  hideLoader,
  setError,
  setInfo,
  setWarning,
  setSuccess,
  resetAlert,
} = appFeedbackSlice.actions;

export const appFeedbackSliceReducer = appFeedbackSlice.reducer;
