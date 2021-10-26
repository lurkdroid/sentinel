import { createAction, createReducer, createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Moralis } from "moralis";
import { ethers } from "ethers";
import { SoliDroidManager } from '@solidroid/core/typechain/SoliDroidManager';
import managerInfo from "@solidroid/core/deployed/unknown/SoliDroidManager.json";
import type { RootState } from "../store"

interface IDroidForm {
    tokenAddress: string,
    amount: number,
    stopLoss: number,
    toLoop: boolean,
    isValid: boolean,
    droidAddress?: string
}
const initialState: IDroidForm = {
    tokenAddress: "",
    amount: 1,
    stopLoss: 10,
    toLoop: false,
    // validation
    isValid: false,
    // result from submition
};
const isValid = (state: IDroidForm)=> {
    if(state.amount>0){
        if(state.stopLoss>0){
            if(state.tokenAddress.length>8){
                return true;
            }
        }
    };
    return false;
}

export const createDroidInstance = createAsyncThunk(
    'droidform/createDroid',
    async (_, thunkAPI) => {
    // contract interaction
    console.log("submitthing")
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const manager = (new ethers.Contract(managerInfo.address, managerInfo.abi, signer)) as unknown as  SoliDroidManager;
    const state = thunkAPI.getState() as RootState;
    let botAddress = ""
    manager.on("BotCreated",(...args)=>{
        console.log({args})
        botAddress = args[1];
    })
    const tx = await manager.updateBot(
            state.formCreate.tokenAddress, 
            ethers.utils.parseEther(state.formCreate.amount+""),
            ethers.utils.parseUnits(state.formCreate.stopLoss+"",6),
            state.formCreate.toLoop
            );
    await tx.wait()

    console.log({transaction: tx})
    return botAddress
    }
  )
const droidForm = createSlice({
    "name": "droidForm",
    initialState,
    "reducers": {
        setStopLoss(state, action: PayloadAction<string>){
           state.stopLoss = Number(action.payload) || 0;
           state.isValid = isValid(state);
        },
        setToLoop(state, action: PayloadAction<boolean>){
            state.toLoop = action.payload;
        },
        setAmount(state, action: PayloadAction<string>){
            state.amount = Number(action.payload) || 0;
            state.isValid = isValid(state);
        },
        setToken(state, action: PayloadAction<string>){
            state.tokenAddress = action.payload;
            state.isValid = isValid(state);
        }
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(createDroidInstance.fulfilled, (state, action) => {
          // Add user to the state array
          state.droidAddress = (action.payload);
        })
      },
});

export const { setStopLoss, setToLoop, setAmount, setToken } = droidForm.actions;
export { droidForm as droidFormSlice };

