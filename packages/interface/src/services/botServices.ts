import { ethers, Transaction } from 'ethers';
import { from, Observable } from 'rxjs';

import addresses from '../utils/addresses.json';
import { botInstance_abi } from '../utils/botInstanceAbi';

import type { BotInstance, SoliDroidManager } from '@solidroid/core/typechain';
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


export function withdrew(token: string, botAddress: string, network: string) {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let botInstance = new ethers.Contract(botAddress, botInstance_abi, provider.getSigner()) as unknown as BotInstance;
        let tx = botInstance.withdraw(token);
        console.log("withdrew returns");

        return from(tx);
}

export function createConfig(config: any, managerAddress, network: string) {
        const abi = addresses[network].manager.abi;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("calling to : " + managerAddress);
        let managerInstance = (new ethers.Contract(managerAddress, abi, provider.getSigner())) as unknown as SoliDroidManager;

        const stopLossPercent = ethers.utils.parseUnits(config.stopLossPercent, 2);
        const defaultAmount = ethers.utils.parseUnits(config.defaultAmount, config.token.decimals);
        const quoteAsset = config.token.address;
        const looping = config.looping;

        let tx = managerInstance.updateBot(
                quoteAsset, defaultAmount, stopLossPercent, looping
                , { gasLimit: 555581 });
        console.log("config CREATE returns");
        // console.log("config CREATE returns", { managerAddress, quoteAsset, stopLossPercent, looping, defaultAmount });
        return from(tx);
}

// Omit<BotConfig, 'defaultAmountOnly' | 'quoteAsset'> extends { token: DbToken },
export function editConfig(config: any, botAddress: string) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("calling to : " + botAddress);
        let botInstance = (new ethers.Contract(botAddress, botInstance_abi, provider.getSigner())) as unknown as BotInstance;


        const stopLossPercent = ethers.utils.parseUnits(config.stopLossPercent, 2);
        const defaultAmount = ethers.utils.parseUnits(config.defaultAmount, config.token.decimals);
        const quoteAsset = config.token.address;
        const looping = config.looping;

        let tx = botInstance.update(
                quoteAsset, defaultAmount, stopLossPercent, looping
                , { gasLimit: 1055581 });
        console.log("config UPDATE returns");
        return from(tx);
}
