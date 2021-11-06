import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Token } from "./droidForm";
import { getNetworkShortName } from '../utils/chains';
import { supportedTokensByNetwork } from "../utils/tokens"
import type { networks } from "../utils/tokens"

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
    chainId: number
}
const initialState: App = {
    getTokens: {},
    tokens: [],
    network: "",
    chainId: 0
}
const slice = createSlice({
    "name": "app",
    initialState,
    "reducers": {

        setApp(state, action: PayloadAction<number>){
            const name = getNetworkShortName(action.payload) as networks;
            state.chainId = action.payload;
            state.network = name;
            state.getTokens = supportedTokensByNetwork[name] as { [token: string]: Token } ;
            state.tokens = Object.values(supportedTokensByNetwork[name] ||{});

        },
      
    }
});
export const { setApp,  } = slice.actions
export { slice as appSlice };



