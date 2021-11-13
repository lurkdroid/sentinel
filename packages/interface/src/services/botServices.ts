import { ethers } from "ethers";
import { useAppSelector } from "../hooks";
import { Observable , from } from "rxjs";
import { botInstance_abi } from "../utils/botInstanceAbi";
/*
bot service will buy, sell, deposit, withdrow and edit
*/

export function Buy (token0:string,token1:string,botAddress:string) : Observable<any>{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("calling to : "+botAddress);
        let botInstance = new ethers.Contract(botAddress, botInstance_abi, provider.getSigner());
        let tx = botInstance.buySignal([token0, token1], { gasLimit:555581} );
        console.log("buy returns");
        
        return from(tx);
};

export function Sell(botAddress:string) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("calling to : "+botAddress);
        let botInstance = new ethers.Contract(botAddress, botInstance_abi, provider.getSigner());
        let tx = botInstance.sellPosition( { gasLimit:555581, } );
        console.log("sell returns");
        
        return from(tx);
};

    // deposit(){

    // }
    

    // withdrow(){

    // }

    // edit(){

    // }
