import { combineReducers, configureStore, Tuple } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { thunk } from "redux-thunk";

import { alertSliceReducer } from "./features/alert.slice";
import { commonLoaderSliceReducer } from "./features/loader.slice";
import { addNoteSliceReducer } from "./features/add-note.slice";
import { tagsSliceReducer } from "./features/tags.slice";

const rootPersistConfig = {
  key: "root",
  storage,
};

const combinedAsyncSlices = combineReducers({
  addNote: persistReducer({ key: "addNote", storage }, addNoteSliceReducer),
  tags: persistReducer(
    {
      key: "tags",
      storage,
    },
    tagsSliceReducer,
  ),
  alert: alertSliceReducer,
  loader: commonLoaderSliceReducer,
});

const rootPersistReducer = persistReducer(
  rootPersistConfig,
  combinedAsyncSlices,
);

export const globalStore = configureStore({
  reducer: {
    root: rootPersistReducer,
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
  setError,
  setInfo,
  setWarning,
  setSuccess,
  resetAlert,
} from "./features/alert.slice";
export { showLoader, hideLoader } from "./features/loader.slice";
export {
  setShowAddInputMenu,
  setModal,
  setInputModifyInProgress,
  addNewField,
  removeField,
  repositionField,
  setRepositionElement,
  setResizeElement,
  fieldValueOnChange,
  saveForm,
  type InputModifyInfoType,
} from "./features/add-note.slice";
export { fetchTagsByGroupId } from "./features/tags.slice";
