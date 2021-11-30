import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { BotInstance__factory, BotInstance } from "../typechain";
import { BotConfig, strConfig } from "../utils/BotConfig"
import * as chai from 'chai';
import { context } from "../utils/context";
import chalk from "chalk";
import { testData } from "../utils/test-data";
import { Position, strPosition, _strPosition } from "../utils/Position";
import { Config } from "@ethereum-waffle/compiler";

let botInstance: BotInstance;
let acct1: Signer;

async function main() {

    let network: string;
    let acctAddr: string;

    let token0Addr: string;
    let token1Addr: string;

    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
    acct1 = (await context.signers())[0];
    token0Addr = testData[network].token0Addr;
    token1Addr = testData[network].token1Addr;

    let botAddress = testData[network].botInstance;
    botInstance = await BotInstance__factory.connect(botAddress, acct1);
    console.log(`bot address: ${chalk.blue(botInstance.address)}`);

    let config: BotConfig = await botInstance.getConfig();
    console.log(strConfig(config));

    let posintion: Position = await botInstance.getPosition();
    try{
        console.log(strPosition(posintion));
    }catch(err){
        console.log(err);
    }

    theLoop(1000);
    // theLoop(1);

}
let lastBalance: BigNumber = BigNumber.from(0);
let theLoop: (i: number) => void = (i: number) => {
    setTimeout(async () => {

        try {
            console.log("in the loop");
            console.log(new Date().toTimeString());
    
            let wakeMe = await botInstance.wakeMe();
            console.log("wake me: "+wakeMe);
            
            if (wakeMe) {
                console.log(chalk.bgBlue(`========== calling bot loop =================`));
    
                let tx = await botInstance.botLoop(
                    { gasLimit:555581}
                );
                await tx.wait().then(tx => console.log("gas used:          " + tx.gasUsed.toString()));
                // await tx.wait().then(tx => console.log("cumulativeGasUsed: " + tx.cumulativeGasUsed.toString()));
    
                // if (tx.effectiveGasPrice) await tx.wait().then(tx => console.log("effectiveGasPrice: " + tx.effectiveGasPrice.toString()));
                // await tx.wait().then(tx => console.log("tx cost: " + tx.gasUsed.mul(tx.effectiveGasPrice).toString()));
            }
    
            let result: any[] = await botInstance.getPositionAndAmountOut();
            console.log(_strPosition(result[0], result[1]));
    
            let currentBalance = await acct1.getBalance();
            let cost = lastBalance.sub(currentBalance);
            lastBalance = currentBalance;
            console.log(chalk.yellow(`========== account balance  ${currentBalance.toString()} =================`));
            console.log(chalk.red(`========== transaction cost ${cost.toString()} =================`));
        } catch (error) {
            console.log(error);
        }

        if (--i) {
            theLoop(i);
        }
        // }, 1000 * 2);
    }, 1000 * 60);
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
