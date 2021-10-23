import React from 'react';
import logo from './logo.svg';
import './App.css';

// unknown network deployed....
import greeterAbi from "@solidroid/core/deployed/unknown/greeter.json";
import { Greeter } from "@solidroid/core/typechain/Greeter"
import { ethers } from "ethers";

let greeter =  (new ethers.Contract(greeterAbi.address,greeterAbi.abi)) as Greeter



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
