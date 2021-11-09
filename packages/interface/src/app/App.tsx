import React, { useEffect } from 'react';
import managerAbi from "@solidroid/core/deployed/unknown/SoliDroidManager.json";
import { ethers } from "ethers";
import Header from "../layout/header"
import { useAppSelector } from '../hooks/redux';
import DroidComponent, { DroidForm } from "../containers/droid";
import {DroidProps} from "../utils/types"
import { SoliDroidManager } from '@solidroid/core/typechain/SoliDroidManager';
import { BotInstance } from '@solidroid/core/typechain/BotInstance';
import { DroidStatus } from '../containers/droid/details';

const droids: DroidProps[] = [
  {
  tokens: ["token1","token2"],
  "balance": "23",
  "ethAmount":3,
  "stopLoss": 23,
  "symbol": "syml",
  created: Date.now(),
  trades: 3
},
{
  tokens: ["token1","token2"],
  "balance": "23",
  "ethAmount":3,
  "stopLoss": 23,
  "symbol": "syml",
  created: Date.now(),
  trades: 3
},
{
  tokens: ["token1","token2"],
  "balance": "23",
  "ethAmount":3,
  "stopLoss": 23,
  "symbol": "syml",
  created: Date.now(),
  trades: 3
},

]

function App() {

  const isDark = useAppSelector(state => state.dashboard.dark);

  useEffect( () => {
    (async()=>{
      try {
        // A Web3Provider wraps a standard Web3 provider, which is
        // what MetaMask injects as window.ethereum into each page
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        // The MetaMask plugin also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, you need the account signer...
        const signer = provider.getSigner()
        console.log("provider: ", provider )
        const manager =  await (new ethers.Contract(managerAbi.address,managerAbi.abi, signer)) as unknown as  SoliDroidManager;
        const botInstanceAddress = await manager.getBot();
        console.log("manager address is:",manager.address)
      } catch (e){
        console.log("error getting provider or manager", e)
      }


    })()  

  },[])


  return (
    <div className={`${isDark? 'dark':''} h-screen`}>
      <div className={"dark:bg-black-type1 h-full"}>
        <Header />
        <div className="flex items-center justify-center h-full p-2 m-2 mt-2">
          <DroidStatus/>
        </div>

        {/* <div className={"container mx-auto p-6  grid grid-cols-droids gap-4"}>
          {
            droids.map((droid, i)=>{
              return (
                <div key={i} className={`bg-secondary shadow-lg rounded-lg `}>
                  <DroidComponent  {...{...droid, isDark}} />
                </div>
              )
            })
          }
        </div> */}
      </div>

    </div>
  );
}

export default App;
