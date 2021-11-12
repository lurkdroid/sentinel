import { ethers } from "ethers";
import { useAppSelector } from "../hooks";
import {BotInstance__factory} from '@solidroid/core/typechain/factories/BotInstance__factory'
/*
bot service will buy, sell, deposit, withdrow and edit
*/
export class BotServices {

    buy(token0:string,token1:string) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const theApp = useAppSelector(state => state.app);
        let botInstance = new ethers.Contract(theApp.botAddress, BotInstance__factory.abi, provider.getSigner());
        // let botInstance = BotInstance__factory.connect(theApp.botAddress,provider.getSigner());
        // botInstance.buySignal([token0, token1])
        // .then(tx:=>{

        // })
    }

    sell(){

    }

    deposit(){

    }

    withdrow(){

    }

    edit(){

    }
}