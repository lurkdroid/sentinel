import { configureStore } from '@reduxjs/toolkit';

import { appSlice, dashboardSlice, droidFormSlice, droidStatusSlice, userSlice } from './slices';

const reducer = {
  app: appSlice.reducer,
  dashboard: dashboardSlice.reducer,
  user: userSlice.reducer,
  formCreate: droidFormSlice.reducer,
  droid: droidStatusSlice.reducer
};
export const store = configureStore({
  devTools: process.env["NODE_ENV"] === "development",
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
