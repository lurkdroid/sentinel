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

    botInstance = await BotInstance__factory.connect("0xCd098F27D71E49466b5Baf0A8aeaB7C3Fc48cf3d", acct1);
    console.log(`bot address: ${chalk.blue(botInstance.address)}`);

    let config: BotConfig = await botInstance.getConfig();
    console.log(strConfig(config));

    let posintion: Position = await botInstance.getPosition();
    console.log(strPosition(posintion));

    // theLoop(1000);
}
let lastBalance: BigNumber = BigNumber.from(0);
let theLoop: (i: number) => void = (i: number) => {
    setTimeout(async () => {
        console.log("in the loop");

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
