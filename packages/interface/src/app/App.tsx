import React from 'react';
import greeterAbi from "@solidroid/core/deployed/unknown/greeter.json";
import { Greeter } from "@solidroid/core/typechain/Greeter"
import { ethers } from "ethers";
import Header from "../layout/header"
import { useAppSelector } from '../hooks/redux';
import { useWallets } from '../hooks/wallets';
import { getDefaultFormatCodeSettings } from 'typescript';
import DroidComponent from "../containers/droid";
import {DroidProps} from "../utils/types"
let greeter =  (new ethers.Contract(greeterAbi.address,greeterAbi.abi)) as unknown as  Greeter

const droids: DroidProps[] = [{
  tokens: ["token1","token2"],
  "balance": "23",
  "ethAmount":3,
  "stopLoss": 23,
  "symbol": "syml",
  created: Date.now(),
  trades: 3
}]

function App() {

  const isDark = useAppSelector(state => state.dashboard.dark);

  return (
    <div className={`${isDark? 'dark':''} h-screen`}>
      <div className={"dark:bg-black-type1 h-full"}>
        <Header />
        {/* <div className={"flex justify-center items-center container m-2"}> */}
        {/* <div className={"container mx-auto p-6  grid grid-cols-3 gap-4"}> */}
        <div className={"container mx-auto p-6  grid grid-cols-droids"}>
          {
            droids.map((droid, i)=>{
              return (
                <div key={i} className={`bg-secondary shadow-lg rounded-lg `}>
                  <DroidComponent  {...{...droid, isDark}} />
                </div>
              )
            })
          }
        </div>
      </div>

    </div>
  );
}

export default App;
