import React from 'react';
import logo from './logo.svg';

// unknown network deployed....
import greeterAbi from "@solidroid/core/deployed/unknown/greeter.json";
import { Greeter } from "@solidroid/core/typechain/Greeter"
import { ethers } from "ethers";
import { useAppSelector, useAppDispatch } from "../hooks";
import { setIsDark } from "../slices";
let greeter =  (new ethers.Contract(greeterAbi.address,greeterAbi.abi)) as Greeter



function App() {

  const theme = useAppSelector(state => state.theme);
  const dispatch = useAppDispatch();
  return (
    <div className="container bg-blue-300">
      <button onClick={()=>{dispatch(setIsDark(!theme))}}>{theme+""}</button>
      SOLIDROID
      
    </div>
  );
}

export default App;
