import React from 'react';
import logo from './logo.svg';

// unknown network deployed....
import greeterAbi from "@solidroid/core/deployed/unknown/greeter.json";
import { Greeter } from "@solidroid/core/typechain/Greeter"
import { ethers } from "ethers";

let greeter =  (new ethers.Contract(greeterAbi.address,greeterAbi.abi)) as Greeter



function App() {
  return (
    <div className="container bg-blue-300">
      SOLIDROID
      
    </div>
  );
}

export default App;
