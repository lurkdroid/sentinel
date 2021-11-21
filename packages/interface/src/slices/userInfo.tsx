import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  name: string;
  address: string;
  parsedAddress: string;
}
const initialState: User = {
  name: "",
  address: "",
  parsedAddress: "",
};
const user = createSlice({
  name: "droids",
  initialState,
  reducers: {
    setAddress(state, action: PayloadAction<string>) {
      const address = action.payload;
      state.address = address;
      if (address && address.length > 6) {
        state.parsedAddress = `${address.slice(0, 5)}...${address.slice(-5)}`;
      } else {
        state.parsedAddress = action.payload;
      }
    },
  },
});
export const { setAddress } = user.actions;
export { user as userSlice };
