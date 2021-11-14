import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import managerInfo from '@solidroid/core/deployed/unknown/SoliDroidManager.json';
import { SoliDroidManager } from '@solidroid/core/typechain/SoliDroidManager';
import { ethers } from 'ethers';

import { Token } from '../utils/data/Token';

import type { RootState } from "../store"


interface IDroidForm {
    tokenName: string,
    token: Token | null,
    amount: number,
    stopLoss: number,
    toLoop: boolean,
    isValid: boolean,
    droidAddress?: string
    isSelected: boolean
}
const initialState: IDroidForm = {
    tokenName: "",
    amount: 1,
    stopLoss: 10,
    toLoop: false,
    // validation
    isValid: false,
    isSelected: false,
    token: null

};
const isValid = (state: IDroidForm)=> {
    if(state.amount>0){
        if(state.stopLoss>0){
            if(state.tokenName.length >2){
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
 
    const stopLoss = ethers.utils.parseUnits(state.formCreate.stopLoss+"",3);

    const tx = await manager.updateBot(
            state.formCreate.token?.address as string,
            ethers.utils.parseEther(state.formCreate.amount+""),
            stopLoss,
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
        setTokenName(state, action: PayloadAction<string>){
            state.tokenName = action.payload;
            state.isValid = isValid(state);
        },
        setToken(state, action: PayloadAction<Token|null>){
            state.token = action.payload;
            state.isValid = isValid(state);
        },
        setHasSelectedToken(state, action: PayloadAction<boolean>){
            state.isSelected = action.payload;
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

export const { setStopLoss, setToLoop, setAmount, setToken, setTokenName, setHasSelectedToken } = droidForm.actions;
export { droidForm as droidFormSlice };

