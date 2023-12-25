import { configureStore } from "@reduxjs/toolkit";

import { counterSliceReducer } from "./features/counter.slice";

export const globalStore = configureStore({
  reducer: {
    counter: counterSliceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof globalStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof globalStore.dispatch;
