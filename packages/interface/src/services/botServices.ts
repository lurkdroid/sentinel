import { ethers, Transaction } from 'ethers';
import { from, Observable } from 'rxjs';

import { botInstance_abi } from '../utils/botInstanceAbi';

import type { BotInstance } from '@solidroid/core/typechain/BotInstance';
/*
bot service will buy, sell, deposit, withdrow and edit
*/

export function Buy(token0: string, token1: string, botAddress: string): Observable<Transaction> {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("calling to : " + botAddress);
        let botInstance = (new ethers.Contract(botAddress, botInstance_abi, provider.getSigner())) as unknown as BotInstance;
        let tx = botInstance.buySignal([token0, token1], { gasLimit: 555581 });
        console.log("buy returns");

        return from(tx);
};

export function Sell(botAddress: string): Observable<Transaction> {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("calling to : " + botAddress);
        let botInstance = new ethers.Contract(botAddress, botInstance_abi, provider.getSigner()) as unknown as BotInstance;
        let tx = botInstance.sellPosition({ gasLimit: 555581, });
        console.log("sell returns");

        return from(tx);
};

    // deposit(){

    // }


    // withdrow(){

    // }

    // edit(){

    // }
