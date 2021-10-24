import { createAction, createReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";

// export const setIsDark = createAction<boolean>("@@THEME/DARK_MODE");
// const reducer = createReducer(true, (builder)=>{
//     builder.addCase(setIsDark,(state, {payload})=>{
//         state = payload;
//     })
//     .addDefaultCase((state,action)=> state)
// })
interface Droid {
    name: string
    tokenBase: string //address
    tokenSwap: string //address
    profit: number // %
    stopLoss?: number // %
    expiration?: number    
}
const initialState: Droid[] = []
const droids = createSlice({
    "name": "droids",
    initialState,
    "reducers": {
        insertDroid(state, action: PayloadAction<{index?: number, droid: Droid}>){
            if(action.payload.index && action.payload.index >= 0){
                return state.map((d,i)=> i==action.payload.index? action.payload.droid: d)
            } else {
                return state.concat(action.payload.droid)
            }
        }
    }
});
// export const { setIsDark } = slice.actions
export { droids as droisSlice };

