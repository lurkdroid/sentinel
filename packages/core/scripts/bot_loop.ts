import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { BotInstance__factory, BotInstance } from "../typechain";
import { BotConfig, strConfig } from "../test/BotConfig"
import * as chai from 'chai';
import { context } from "../test/context";
import chalk from "chalk";
import { testData } from "../test/test-data";
import { Position, strPosition } from "../test/Position";
import { Config } from "@ethereum-waffle/compiler";

let botInstance: BotInstance;

async function main() {

    let network: string;
    let acctAddr: string;
    let acct1: Signer;

    let token0Addr: string;
    let token1Addr: string;


    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
    acct1 = (await context.signers())[0];
    token0Addr = testData[network].token0Addr;
    token1Addr = testData[network].token1Addr;

    botInstance = await BotInstance__factory.connect("0x55DD96626cc18318a0013827A31049ea1d5B2D5F", acct1);
    console.log(`bot address: ${chalk.blue(botInstance.address)}`);

    let config: BotConfig = await botInstance.getConfig();
    console.log(strConfig(config));

    let posintion: Position = await botInstance.getPosition();
    console.log(strPosition(posintion));

    theLoop(1000);
}

let theLoop: (i: number) => void = (i: number) => {
    setTimeout(async () => {
        console.log("in the loop");
        await botInstance.botLoop();
        let position: Position = await botInstance.getPosition();

        console.log(new Date().toLocaleString());
        console.log(strPosition(position));

        if (--i) {
            theLoop(i);
        }
    }, 1000 * 60);
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
