import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import managerInfo from "@solidroid/core/deployed/unknown/SoliDroidManager.json";
import { SoliDroidManager } from "@solidroid/core/typechain";
import { ethers } from "ethers";

import type { RootState } from "../store";
import { BotConfig } from "../utils/BotConfig";

interface IDroidForm extends BotConfig {
  isValid: boolean;
  droidAddress?: string;
  isSelected: boolean;
}

const initialState: IDroidForm = {
  quoteAsset: "",
  defaultAmount: "5",
  stopLossPercent: "10",
  loop: true,
  defaultAmountOnly: true,
  // validation
  isValid: false,
  isSelected: false,
};

const isValid = (state: BotConfig) => {
  return true;
  //FIXME - validate
  //   if (state.defaultAmount > 0) {
  //     if (state.defaultAmount > 0 && state.defaultAmount < 100) {
  //       if (state.tokenName.length > 2) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
};

export const createDroidInstance = createAsyncThunk(
  "droidform/createDroid",
  async (_, thunkAPI) => {
    // contract interaction
    console.log("submitthing");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const manager = new ethers.Contract(
      managerInfo.address,
      managerInfo.abi,
      signer
    ) as unknown as SoliDroidManager;
    const state = thunkAPI.getState() as RootState;
    let botAddress = "";
    manager.on("BotCreated", (...args) => {
      console.log({ args });
      botAddress = args[1];
    });

    const stopLoss = ethers.utils.parseUnits(
      state.formCreate.stopLossPercent + "",
      3
    );

    const tx = await manager.updateBot(
      state.formCreate.quoteAsset as string,
      ethers.utils.parseEther(state.formCreate.defaultAmount + ""),
      stopLoss,
      state.formCreate.loop
    );
    await tx.wait();

    console.log({ transaction: tx });
    return botAddress;
  }
);
const droidForm = createSlice({
  name: "droidForm",
  initialState,
  reducers: {
    setStopLoss(state, action: PayloadAction<string>) {
      state.stopLossPercent = action.payload || "5";
      state.isValid = isValid(state);
    },
    setToLoop(state, action: PayloadAction<boolean>) {
      state.loop = action.payload;
    },
    setAmount(state, action: PayloadAction<string>) {
      state.defaultAmount = action.payload;
      state.isValid = isValid(state);
    },
    setQuoteAsset(state, action: PayloadAction<string>) {
      state.quoteAsset = action.payload;
      state.isValid = isValid(state);
    },
    // setHasSelectedToken(state, action: PayloadAction<boolean>) {
    //   state.isSelected = action.payload;
    //   state.isValid = isValid(state);
    // },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(createDroidInstance.fulfilled, (state, action) => {
      // Add user to the state array
      state.droidAddress = action.payload;
    });
  },
});

export const {
  setStopLoss,
  setToLoop,
  setAmount,
  setQuoteAsset,
  //   setTokenName,
  //   setHasSelectedToken,
} = droidForm.actions;
export { droidForm as droidFormSlice };
