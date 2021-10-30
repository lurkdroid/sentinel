import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import * as chai from 'chai';
import { SoliDroidManager } from "../typechain/SoliDroidManager";
import { deployManager } from "../scripts/deploy-for-test";
import { BotInstance } from "../typechain/BotInstance";
import { BotConfig } from "./BotConfig";
import { BotInstance__factory } from "../typechain/";
import chalk from "chalk";
import { context } from "./context";
import { testData } from "./test-data";
import { strPosition } from "./Position";
import { MockERC20__factory } from "../typechain/factories/MockERC20__factory";

describe("test bot signal", function () {


    let acct1: Signer;
    let network: string;
    let acctAddr: string;
    let token0Addr: string;
    let token1Addr: string;
    let manager: SoliDroidManager;
    let botInstance: BotInstance;

    let defaultAmount = BigNumber.from(ethers.utils.parseEther("100"));
    let stopLossPercent = BigNumber.from("450");
    let loop = true;

    before(async function () {
        console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
        console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
        acct1 = (await context.signers())[0];
        token0Addr = testData[network].token0Addr;
        token1Addr = testData[network].token1Addr;
    });

    beforeEach(async function () {

        manager = await deployManager();
        console.log(`manager address: ${manager.address}`)
        await manager.updateBot(token0Addr, defaultAmount, stopLossPercent, loop);
        let botAddress = await manager.getBot();
        console.log(`instance address: ${botAddress}`)
        botInstance = await BotInstance__factory.connect(botAddress, acct1);

        console.log("========== before each end =================");
    });

    it("Should create an instance... ", async function () {
        await botInstance.deployed();
        let config: BotConfig = await botInstance.getConfig();
        console.log(config)
        chai.expect(config.defaultAmount).to.eql(defaultAmount);
        chai.expect(config.defaultAmountOnly).to.be.false;
        chai.expect(config.loop).to.be.true;
        chai.expect(config.quoteAsset).to.eql(token0Addr);
        chai.expect(config.stopLossPercent).to.eql(stopLossPercent);
    });

    it("Should trigger a buy using manager ", async function () {
        let position = await botInstance.getPosition();
        chai.expect(position.initialAmount).to.be.eql(BigNumber.from(0));
        //manager add supported pair
        await manager.addSupportedPair(token0Addr, token1Addr);
        //manager buy signal
        await chai.expect(manager.onSignal(token0Addr, "0x0000000000000000000000000000000000000000"))
            .to.be.revertedWith('onSignal:unsupported');
        //bot instance before deposit
        await chai.expect(manager.onSignal(token0Addr, token1Addr)).revertedWith("BotInstance: insufficient balance")

        //deposit token to bot instance
        let mockERC20_0 = await MockERC20__factory.connect(token0Addr, acct1);
        await mockERC20_0.approve(botInstance.address, defaultAmount);
        await mockERC20_0.transfer(botInstance.address, defaultAmount);

        await manager.onSignal(token0Addr, token1Addr)
        console.log("manager send signal");

        position = await botInstance.getPosition();
        console.log(strPosition(position))
        chai.expect(position.initialAmount).to.be.gt(BigNumber.from(0));
    });
});
//add manager and integration manager/instance test