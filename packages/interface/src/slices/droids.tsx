import { createAction, createReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
export { droids as droidSlice };

