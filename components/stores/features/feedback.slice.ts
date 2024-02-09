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
  notifications: string[];
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
  notifications: [],
};

export const appFeedbackSlice = createSlice({
  name: "app-feedback",
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
    addNotifications: (state, action: PayloadAction<string>) => {
      state.notifications.push(action.payload);
    },
    removeNotifications: (state, action: PayloadAction<{ index: number }>) => {
      state.notifications.splice(action.payload.index, 1);
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
  addNotifications,
  removeNotifications,
} = appFeedbackSlice.actions;

export const appFeedbackSliceReducer = appFeedbackSlice.reducer;
