import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Token } from "../utils/data/Token";
import { getNetworkShortName } from '../utils/chains';
import type { networks } from "../utils/tokens"
import { ethers } from "ethers";
import { managerAddress } from "../utils/data/sdDatabase";
import managerAbi from "@solidroid/core/deployed/unknown/SoliDroidManager.json";
import { any } from "underscore";

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
    manager: any,
    botAddress: string
}
const initialState: App = {
    getTokens: {},
    tokens: [],
    network: "",
    chainId: 0,
    modal: false,
    manager: {},
    botAddress: "0x0000000000000000000000000000000000000000"

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
            provider.getNetwork().then(network=>{
                //FIXME validate the nextwork is like 'name' from above
                const manager = new ethers.Contract(managerAddress(network.name), managerAbi.abi, provider.getSigner());
                state.manager=manager;
                return manager.getBot()
            }).then(botAddress=>{
                state.botAddress=botAddress;
            });
        },

        setInfoModal(state, action: PayloadAction<boolean>){
            state.modal = action.payload;
        }
      
    }
});

export const { setApp, setInfoModal } = slice.actions
export { slice as appSlice };



