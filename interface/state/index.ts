import { configureStore } from "@reduxjs/toolkit";
import chunksReducer from "./chunks";

export const store = configureStore({
  reducer: {
    chunks: chunksReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
