import React from 'react';
import greeterAbi from "@solidroid/core/deployed/unknown/greeter.json";
import { Greeter } from "@solidroid/core/typechain/Greeter"
import { ethers } from "ethers";
import Header from "../layout/header"
import { useAppSelector } from '../hooks/redux';
import { useWallets } from '../hooks/wallets';
let greeter =  (new ethers.Contract(greeterAbi.address,greeterAbi.abi)) as unknown as  Greeter



function App() {

  const isDark = useAppSelector(state => state.dashboard.dark);

  return (
    <div className={`${isDark? 'dark':''}`}>
      <Header />
    </div>
  );
}

export default App;
