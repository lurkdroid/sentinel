import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getNetworkShortName } from "../utils/chains";
import { Token } from "../utils/data/Token";

import type { networks } from "../utils/tokens";

declare interface App {
  getTokens: { [token: string]: Token };
  tokens: Token[];
  network: string;
  chainId: number;
  modal: boolean;
  manager: any;
  botAddress: string;
  explorer: {
    harmony: string;
    bsc: string;
    matic: string;
    kovan: string;
  };
  logout: boolean;
  loading: boolean;
}
const initialState: App = {
  getTokens: {},
  tokens: [],
  network: "",
  chainId: 0,
  modal: false,
  manager: {},
  botAddress: "0x0000000000000000000000000000000000000000",
  explorer: {
    harmony: "https://explorer.harmony.one/",
    bsc: "https://bscscan.com/",
    matic: "https://polygonscan.com/address/",
    kovan: "https://kovan.etherscan.io/",
  },
  logout: false,
  loading: false,
};
const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setApp(state, action: PayloadAction<number>) {
      const name = getNetworkShortName(action.payload) as networks;
      state.chainId = action.payload;
      state.network = name;
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      //error Unhandled Rejection (TypeError): Cannot perform 'set' on a proxy that has been revoked
      // provider.getNetwork().then(network=>{
      //     //FIXME validate the nextwork is like 'name' from above
      //     const manager = new ethers.Contract(managerAddress(network.name), managerAbi.abi, provider.getSigner());
      //     state.manager=manager;
      //     return manager.getBot()
      // }).then(botAddress=>{
      //     state.botAddress=botAddress;
      // });
    },
    provisionApp(state, action: PayloadAction<any>) {
      console.log(action.payload);
    },

    setInfoModal(state, action: PayloadAction<boolean>) {
      state.modal = action.payload;
    },
    setLogout(state, action: PayloadAction<boolean>) {
      state.logout = action.payload;
      state.network = "";
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setApp, setInfoModal, provisionApp, setLogout, setLoading } =
  slice.actions;
export { slice as appSlice };
