import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import * as chai from 'chai';
import { SoliDroidManager } from "../typechain/SoliDroidManager";
import { BotInstance } from "../typechain/BotInstance";
import { BotConfig, strConfig } from "../utils/BotConfig";
import chalk from "chalk";
import { context } from "../utils/context";
import { testData } from "../test/test-data";
import { strPosition } from "../utils/Position";
import { BotInstance__factory, SoliDroidManager__factory } from "../typechain";
import { MockERC20__factory } from "../typechain/factories/MockERC20__factory";

describe("test bot signal", function () {

    let acct1: Signer;
    let network: string;
    let acctAddr: string;
    let token0Addr: string;
    let token1Addr: string;
    let manager: SoliDroidManager;
    let botInstance: BotInstance;
    let startBalance: BigNumber;

    before(async function () {
        console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
        console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
        acct1 = (await context.signers())[0];
        token0Addr = testData[network].token0Addr;
        token1Addr = testData[network].token1Addr;
    });

    beforeEach(async function () {
        startBalance = await acct1.getBalance();
        console.log(chalk.yellow(`========== account balance ${startBalance.toString()} =================`));
    });
    afterEach(async function () {
        let endBalance = await acct1.getBalance();
        console.log(chalk.yellow(`========== account balance ${endBalance.toString()} =================`));
        console.log(chalk.red(`========== cost ${startBalance.sub(endBalance).toString()}=================`));
    });

    it("Should invoke bot instance buy signal ", async function () {
        //connect to manager and get bot
        // let manager = await SoliDroidManager__factory.connect("", acct1);
        // let botAddress = await manager.getBot()
        let botAddress = testData[network].botInstance;
        console.log(`bot instance address: ${chalk.blue(botAddress)}`);
        let botInstance = await BotInstance__factory.connect(botAddress, acct1);

        let mockERC20_0 = await MockERC20__factory.connect(token0Addr, acct1);
        let token0balance = await mockERC20_0.balanceOf(botInstance.address);
        console.log(`\nbot instance 0 balance: ${chalk.green(token0balance)}\n`);

        let mockERC20_1 = await MockERC20__factory.connect(token1Addr, acct1);
        let token1balance = await mockERC20_1.balanceOf(botInstance.address);
        console.log(`\nbot instance 1 balance: ${chalk.green(token1balance)}\n`);

        console.log("------------- invoking buySignal ------------------");
        await botInstance.buySignal([token0Addr, token1Addr]);
        console.log("------------- exit buySignal ------------------");

    });
});