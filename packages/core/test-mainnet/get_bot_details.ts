import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import * as chai from 'chai';
import { SoliDroidManager } from "../typechain/SoliDroidManager";
import { BotInstance } from "../typechain/BotInstance";
import { BotConfig, strConfig } from "../test/BotConfig";
import chalk from "chalk";
import { context } from "../test/context";
import { testData } from "../test/test-data";
import { strPosition } from "../test/Position";
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

    it("Should get bot address from manager and output position ", async function () {
        //connect to manager and get bot
        let manager = await SoliDroidManager__factory.connect("0x42aEA4B1BA24c98413C293520cBBB80462bd8d5F", acct1);
        let botAddress = await manager.getBot()
        console.log(`bot instance address: ${chalk.blue(botAddress)}`);

        let botInstance = await BotInstance__factory.connect(botAddress, acct1);
        let config = await botInstance.getConfig();
        console.log("\n========= config =========");
        console.log(strConfig(config));

        let position = await botInstance.getPosition();
        console.log("========= position =========");
        console.log(strPosition(position));

        console.log(token0Addr);

        let mockERC20_0 = await MockERC20__factory.connect(token0Addr, acct1);
        let token0balance = await mockERC20_0.balanceOf(botInstance.address);
        console.log(`\nbot instance balance: ${chalk.green(token0balance)}\n`);

    });
});
