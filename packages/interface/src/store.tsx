import { configureStore } from "@reduxjs/toolkit";
import { themeSlice } from "./slices"

const reducer = {
  theme: themeSlice.reducer
};
export const store = configureStore({
  devTools: process.env["NODE_ENV"] === "development",
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
