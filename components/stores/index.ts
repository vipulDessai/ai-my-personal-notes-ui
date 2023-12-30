import { configureStore } from "@reduxjs/toolkit";

import { counterSliceReducer } from "./features/counter.slice";
import { alertSliceReducer } from "./features/alert.slice";
import { commonLoaderSliceReducer } from "./features/loader.slice";
import { addNoteSliceReducer } from "./features/add-note.slice";

export const globalStore = configureStore({
  reducer: {
    counter: counterSliceReducer,
    alert: alertSliceReducer,
    loader: commonLoaderSliceReducer,
    addNote: addNoteSliceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof globalStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof globalStore.dispatch;

// dispatch events
export {
  decrement,
  increment,
  incrementByAmount,
} from "./features/counter.slice";
export {
  setError,
  setInfo,
  setWarning,
  setSuccess,
  resetAlert,
} from "./features/alert.slice";
export { showLoader, hideLoader } from "./features/loader.slice";
export {
  addNewField,
  addFieldToParent,
  removeField,
  repositionField,
} from "./features/add-note.slice";
