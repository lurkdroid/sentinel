import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import * as chai from 'chai';
import { SoliDroidManager } from "../typechain/SoliDroidManager";
import { BotInstance } from "../typechain/BotInstance";
import { BotConfig, strConfig } from "../utils/BotConfig";
import chalk from "chalk";
import { context } from "../utils/context";
import { strPosition } from "../utils/Position";
import { BotInstance__factory } from "../typechain";
import { MockERC20__factory } from "../typechain/factories/MockERC20__factory";
const _addresses = require('../utils/solidroid-address.json');

describe("test bot signal", function () {

    let signer: Signer;
    let network: string;
    let acctAddr: string;
    let token0Addr: string;
    let token1Addr: string;
    let botInstance: BotInstance;
    let startBalance: BigNumber;

    before(async function () {
        console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
        console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
        signer = (await context.signers())[0];
        token0Addr = _addresses[network].tokens[0].address;
        token1Addr = _addresses[network].tokens[1].address;
    });

    beforeEach(async function () {
        startBalance = await signer.getBalance();
        console.log(chalk.yellow(`========== account balance ${startBalance.toString()} =================`));
    });
    afterEach(async function () {
        let endBalance = await signer.getBalance();
        console.log(chalk.yellow(`========== account balance ${endBalance.toString()} =================`));
        console.log(chalk.red(`========== cost ${startBalance.sub(endBalance).toString()}=================`));
    });

    it("Should get bot address from manager and output position ", async function () {

        let botAddress =  _addresses[network].manager.bots[0];

        console.log(`bot instance address: ${chalk.blue(botAddress)}`);

        let botInstance = await BotInstance__factory.connect(botAddress, signer);
        let config = await botInstance.getConfig();
        console.log("\n========= config =========");
        console.log(strConfig(config));

        let position = await botInstance.getPosition();
        console.log("========= position =========");
        console.log(strPosition(position));

        console.log(token0Addr);

        let mockERC20_0 = await MockERC20__factory.connect(token0Addr, signer);
        let token0balance = await mockERC20_0.balanceOf(botInstance.address);
        console.log(`\nbot instance ${chalk.green(await mockERC20_0.name())} balance: ${chalk.green(token0balance)}\n`);
        let mockERC20_1 = await MockERC20__factory.connect(token1Addr, signer);
        let token1balance = await mockERC20_1.balanceOf(botInstance.address);
        console.log(`\nbot instance ${chalk.green(await mockERC20_1.name())} balance: ${chalk.green(token1balance)}\n`);
        console.log("last ,,,,");
    });
});
