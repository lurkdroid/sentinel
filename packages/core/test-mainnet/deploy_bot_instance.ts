import { ethers } from "hardhat";
import { BigNumber, Signer, utils } from "ethers";
import { BotInstance, MockERC20, MockERC20__factory } from "../typechain";
import { BotConfig, strConfig } from "../test/BotConfig"
import * as chai from 'chai';
import { context } from "../test/context";
import chalk from "chalk";
import { deployBotInstance } from "../scripts/deploy_bot-instance";
import { testData } from "../test/test-data";
import * as dotenv from "dotenv";

describe("test bot signal", function () {

    let network: string;
    let acctAddr: string;
    let acct1: Signer;

    let token0Addr: string;
    let token1Addr: string;
    let mockERC20_0: MockERC20;
    let mockERC20_1: MockERC20;

    before(async function () {
        console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
        console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
        acct1 = (await context.signers())[0];
        token0Addr = testData[network].token0Addr;
        token1Addr = testData[network].token1Addr;
        mockERC20_0 = await MockERC20__factory.connect(token0Addr, acct1);
        mockERC20_1 = await MockERC20__factory.connect(token1Addr, acct1);

        let token0balance = await mockERC20_0.balanceOf(await acct1.getAddress());
        console.log(`account ${await mockERC20_0.symbol()} balance: ${chalk.green(token0balance)}`);
    });

    beforeEach(async function () {

    });

    it("Should initialize bot ctor", async function () {
        this.timeout(0);

        let defaultAmount: BigNumber = utils.parseEther('4.5');//BigNumber.from("2595988885165088891");
        let stopLossPercent: BigNumber = BigNumber.from("250");

        let botInstance = await deployBotInstance(
            testData[network].uniswapV2Router,
            acctAddr,
            token0Addr,
            defaultAmount,
            stopLossPercent,
            true);
        await botInstance.deployed();

        console.log(`bot address: ${chalk.blue(botInstance.address)}`);

        let config: BotConfig = await botInstance.getConfig();
        console.log(strConfig(config))
        chai.expect(config.defaultAmount).to.eql(defaultAmount);
        chai.expect(config.defaultAmountOnly).to.be.false;
        chai.expect(config.loop).to.be.true;
        chai.expect(config.quoteAsset).to.eql(token0Addr);
        chai.expect(config.stopLossPercent).to.eql(stopLossPercent);
    });
});