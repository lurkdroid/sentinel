import { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { MessageDialog } from '../components';
import { DroidStatus } from '../containers/droid/details';
import { useAppSelector } from '../hooks/redux';
import Header from '../layout/header';
import { Home } from '../views/Home';

// import { Route  } from 'react-router-dom'
// import managerAbi from "@solidroid/core/deployed/unknown/SoliDroidManager.json";
// import { ethers } from "ethers";
// import DroidComponent, { DroidForm } from "../containers/droid";
// import {DroidProps} from "../utils/types"
// import { SoliDroidManager } from '@solidroid/core/typechain/SoliDroidManager';
// import { BotInstance } from '@solidroid/core/typechain/BotInstance';
// import { setApp } from '../slices';

function App() {

  const isDark = useAppSelector(state => state.dashboard.dark);
  const modal = useAppSelector(state => state.app.modal);

  useEffect( () => {
    (async()=>{
      // try {     
        
      //   // A Web3Provider wraps a standard Web3 provider, which is
      //   // what MetaMask injects as window.ethereum into each page
      //   const provider = new ethers.providers.Web3Provider(window.ethereum)

      //   // The MetaMask plugin also allows signing transactions to
      //   // send ether and pay to change state within the blockchain.
      //   // For this, you need the account signer...
      //   const signer = provider.getSigner()
      //   console.log("provider: ", provider )
      //   const manager = await (new ethers.Contract(managerAbi.address,managerAbi.abi, signer)) as unknown as  SoliDroidManager;
      //   const botInstanceAddress = await manager.getBot();
      //   console.log("manager address is:",manager.address)
      // } catch (e){
      //   console.log("error getting provider or manager", e)
      // }
    })()  
  },[])

  return (
    <div className={`${isDark? 'dark':''} h-screen`}>
      <MessageDialog show={modal}/>
      <div className={"dark:bg-black-type1 h-full"}>
        <Header />
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/dashboard" exact render={()=> {

            console.log("RENDERING_ DASHBOARD:")
            return (
              <div className="flex justify-center p-2 m-2 mt-2">
                <DroidStatus/>
              </div>)
          }}/>

          <Redirect path="/" to={
            {
              pathname: "/"}
            }/>
        </Switch>
      </div>
    </div>
  );
}

export default App;