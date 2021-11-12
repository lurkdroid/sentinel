import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Token } from "../utils/data/Token";
import { getNetworkShortName } from '../utils/chains';
import type { networks } from "../utils/tokens"
import { ethers } from "ethers";
import { managerAddress } from "../utils/data/sdDatabase";
import managerAbi from "@solidroid/core/deployed/unknown/SoliDroidManager.json";

// export const setIsDark = createAction<boolean>("@@THEME/DARK_MODE");
// const reducer = createReducer(true, (builder)=>{
//     builder.addCase(setIsDark,(state, {payload})=>{
//         state = payload;
//     })
//     .addDefaultCase((state,action)=> state)
// })

declare interface App {
    getTokens: { [token: string]: Token } ,
    tokens: Token[],
    network: string,
    chainId: number,
    modal: boolean,
    manager: any
}
const initialState: App = {
    getTokens: {},
    tokens: [],
    network: "",
    chainId: 0,
    modal: false,
    manager: {}
}
const slice = createSlice({
    "name": "app",
    initialState,
    "reducers": {

        setApp(state, action: PayloadAction<number>){
            const name = getNetworkShortName(action.payload) as networks;
            state.chainId = action.payload;
            state.network = name;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            state.manager = new ethers.Contract(managerAddress(name), managerAbi.abi, provider.getSigner());
        },
        setInfoModal(state, action: PayloadAction<boolean>){
            state.modal = action.payload;
        }
      
    }
});
export const { setApp, setInfoModal } = slice.actions
export { slice as appSlice };



