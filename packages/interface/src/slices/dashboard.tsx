import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getNetworkName } from '../utils/chains';

// export const setIsDark = createAction<boolean>("@@THEME/DARK_MODE");
// const reducer = createReducer(true, (builder)=>{
//     builder.addCase(setIsDark,(state, {payload})=>{
//         state = payload;
//     })
//     .addDefaultCase((state,action)=> state)
// })

declare interface Dashboard {
  menu: boolean;
  dark: boolean;
  network: string | null;
}
const initialState: Dashboard = {
  menu: false,
  dark: false,
  network: null,
};
const slice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setIsDark(state, action: PayloadAction<boolean>) {
      state.dark = action.payload;
    },
    setMenu(state, action: PayloadAction<boolean>) {
      state.menu = action.payload;
    },
    setNetwork(state, action: PayloadAction<number>) {
      state.network = getNetworkName(action.payload);
    },
  },
});
export const { setIsDark, setMenu, setNetwork } = slice.actions;
export { slice as dashboardSlice };
