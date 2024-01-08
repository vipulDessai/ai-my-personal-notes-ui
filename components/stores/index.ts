import { configureStore, Tuple } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { thunk } from "redux-thunk";

import { counterSliceReducer } from "./features/counter.slice";
import { alertSliceReducer } from "./features/alert.slice";
import { commonLoaderSliceReducer } from "./features/loader.slice";
import { addNoteSliceReducer } from "./features/add-note.slice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedAddNoteSliceReducer = persistReducer(
  persistConfig,
  addNoteSliceReducer,
);

export const globalStore = configureStore({
  reducer: {
    counter: counterSliceReducer,
    alert: alertSliceReducer,
    loader: commonLoaderSliceReducer,
    addNote: persistedAddNoteSliceReducer,
  },
  // eslint-disable-next-line no-unused-vars
  middleware: (getDefaultMiddleware) => {
    return new Tuple(thunk);
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof globalStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof globalStore.dispatch;

export const persistedGlobalStore = persistStore(globalStore);

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
  setRepositionElement,
  setResizeElement,
  type InputModifyInfoType,
} from "./features/add-note.slice";
