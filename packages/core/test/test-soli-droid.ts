import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import * as chai from 'chai';
import { SoliDroidManager } from "../typechain/SoliDroidManager";
import { deployManager } from "../scripts/deploy-for-test";
import { BotInstance } from "../typechain/BotInstance";
import { BotConfig } from "./BotConfig";
import { BotInstance__factory } from "../typechain/";

describe("test bot signal", function () {

    // tokens and liquidity on rinkeby testnet
    let token0Addr = "0x6b4A9f9ECBA6c7EaeDa648f1e9aa0CF7Fa4F071e";
    let token1Addr = "0xC803789A6D1e80fD859343f2DB5306aF9DD2dD39";
    let defaultAmount = BigNumber.from(ethers.utils.parseEther("100"));
    let stopLossPercent = BigNumber.from("450");
    let loop = true;
    let acct1: Signer;
    let acct1Addr: string;
    let manager: SoliDroidManager;
    let botInstance: BotInstance;

    beforeEach(async function () {

        const accounts = await ethers.getSigners();
        acct1 = accounts[0];
        acct1Addr = accounts[0].address;
        acct1.getAddress().then(console.log);

        manager = await deployManager();
        console.log(`manager address: ${manager.address}`)
        await manager.updateBot(token0Addr, defaultAmount, stopLossPercent, loop);

        let botAddress = await manager.getBot();
        console.log(`instance address: ${botAddress}`)
        botInstance = await BotInstance__factory.connect(botAddress, acct1);
        console.log("========== before each end =================");
    });


    it("Should create an instance... ", async function () {

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
        await manager.onSignal(token0Addr, token1Addr);
        position = await botInstance.getPosition();
        console.log(position)
    });
});