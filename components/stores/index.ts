import { combineReducers, configureStore, Tuple } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { thunk } from "redux-thunk";

import { appFeedbackSliceReducer } from "./features/feedback.slice";
import { addNoteSliceReducer } from "./features/add-note.slice";
import { tagsSliceReducer } from "./features/tags.slice";
import { userSliceReducer } from "./features/user.slice";

const combinedAsyncSlices = combineReducers({
  addNote: persistReducer({ key: "add-note", storage }, addNoteSliceReducer),
  tags: persistReducer(
    {
      key: "tags",
      storage,
    },
    tagsSliceReducer,
  ),
  appFeed: appFeedbackSliceReducer,
  user: persistReducer(
    {
      key: "user",
      storage,
    },
    userSliceReducer,
  ),
});

const rootPersistConfig = {
  key: "root",
  storage,
};
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

export {
  showLoader,
  hideLoader,
  setError,
  setInfo,
  setSuccess,
  setWarning,
  resetAlert,
  addNotifications,
  removeNotifications,
} from "./features/feedback.slice";
export {
  initialState,
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
export { fetchTagsByGroupId, clearTags, getTags } from "./features/tags.slice";
export { fetchAuthToken } from "./features/user.slice";
