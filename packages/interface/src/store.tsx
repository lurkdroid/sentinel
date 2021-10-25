import { configureStore } from "@reduxjs/toolkit";
import { dashboardSlice, userSlice } from "./slices"

const reducer = {
  dashboard: dashboardSlice.reducer,
  user: userSlice.reducer
};
export const store = configureStore({
  devTools: process.env["NODE_ENV"] === "development",
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
