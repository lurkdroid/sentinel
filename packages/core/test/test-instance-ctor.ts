import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { BotInstance } from "../typechain";
import { BotConfig } from "./BotConfig"
import * as chai from 'chai';
import { context } from "./context";
import chalk from "chalk";
import { deployBotInstance } from "../scripts/1_deploy_bot-instance";
import { testData } from "./test-data";

describe("test bot signal", function () {

    let network: string;
    let acctAddr: string;

    let botInstance: BotInstance;
    let quoteAsset: string;
    let defaultAmount: BigNumber = BigNumber.from(ethers.utils.parseEther("100"));
    let stopLossPercent: BigNumber = BigNumber.from("450");
    let loop: boolean = true;

    before(async function () {
        console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
        console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
        quoteAsset = testData[network].token0Addr;
    });

    beforeEach(async function () {

    });

    it("Should initialize bot ctor", async function () {

        botInstance = await deployBotInstance(
            testData[network].uniswapV2Router,
            acctAddr,
            quoteAsset,
            defaultAmount,
            stopLossPercent,
            loop);
        await botInstance.deployed();

        console.log("bot instance address: " + botInstance.address);
        let config: BotConfig = await botInstance.getConfig();
        console.log(config)
        chai.expect(config.defaultAmount).to.eql(defaultAmount);
        chai.expect(config.defaultAmountOnly).to.be.false;
        chai.expect(config.loop).to.be.true;
        chai.expect(config.quoteAsset).to.eql(quoteAsset);
        chai.expect(config.stopLossPercent).to.eql(stopLossPercent);
    });


    it("Should get error - amount 0", async function () {
        await chai.expect(deployBotInstance(
            testData[network].uniswapV2Router,
            acctAddr, quoteAsset,
            BigNumber.from(0),
            stopLossPercent,
            loop))
            .to.be.revertedWith('BotInstance: value must be > 0');
    });

    it("Should get error - BotInstance: stoploss must be between 0 and 10000", async function () {
        await chai.expect(deployBotInstance(
            testData[network].uniswapV2Router,
            acctAddr, quoteAsset,
            defaultAmount,
            BigNumber.from(0),
            loop))
            .to.be.revertedWith('BotInstance: stoploss must be between 0 and 10000');

        await chai.expect(deployBotInstance(
            testData[network].uniswapV2Router,
            acctAddr, quoteAsset,
            defaultAmount,
            BigNumber.from(10000),
            loop))
            .to.be.revertedWith('BotInstance: stoploss must be between 0 and 10000');

    });
});
