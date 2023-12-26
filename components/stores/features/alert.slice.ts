import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Severity = "error" | "warning" | "info" | "success";

export interface alertState {
  title: string;
  message: string;
  type: Severity;
}

export interface alertStatePayload {
  title: string;
  message: string;
}

const initialState: alertState = {
  title: "",
  message: "",
  type: "info",
};

export const alertSlice = createSlice({
  name: "common-alert",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<alertStatePayload>) => {
      state.type = "error";
      state.message = action.payload.message;
      state.title = action.payload.title;
    },
    setInfo: (state, action: PayloadAction<alertStatePayload>) => {
      state.type = "info";
      state.message = action.payload.message;
      state.title = action.payload.title;
    },
    setWarning: (state, action: PayloadAction<alertStatePayload>) => {
      state.type = "info";
      state.message = action.payload.message;
      state.title = action.payload.title;
    },
    setSuccess: (state, action: PayloadAction<alertStatePayload>) => {
      state.type = "success";
      state.message = action.payload.message;
      state.title = action.payload.title;
    },
    resetAlert: (state) => {
      state.type = "info";
      state.message = "";
      state.title = "";
    },
  },
});

export const { setError, setInfo, setWarning, setSuccess, resetAlert } =
  alertSlice.actions;

export const alertSliceReducer = alertSlice.reducer;
