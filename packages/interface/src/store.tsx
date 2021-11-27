import { configureStore, ConfigureStoreOptions } from "@reduxjs/toolkit";

import {
  appSlice,
  dashboardSlice,
  droidFormSlice,
  droidStatusSlice,
  userSlice,
} from "./slices";

const reducer = {
  app: appSlice.reducer,
  dashboard: dashboardSlice.reducer,
  user: userSlice.reducer,
  formCreate: droidFormSlice.reducer,
  droid: droidStatusSlice.reducer,
};
let preloadedState = undefined;
const config: ConfigureStoreOptions = {
  devTools: process.env["NODE_ENV"] === "development",
  reducer,
};
if (localStorage) {
  preloadedState = localStorage.getItem("store");
  if (preloadedState) {
    preloadedState = JSON.parse(preloadedState);
    config.preloadedState = preloadedState;
  }
}

export const store = configureStore(config);

if (localStorage) {
  store.subscribe(() => {
    localStorage.setItem("store", JSON.stringify(store.getState()));
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
