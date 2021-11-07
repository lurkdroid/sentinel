import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import * as chai from 'chai';
import { SoliDroidManager } from "../typechain/SoliDroidManager";
import { deployManager } from "../scripts/deploy-for-test";
import chalk from "chalk";
import { testData } from "../utils/test-data";
import { context } from "../utils/context";

describe("test bot signal", function () {

    let network: string;
    let acctAddr: string;
    let token0Addr: string;
    let token1Addr: string;
    let manager: SoliDroidManager;

    // before(async function () {
    //     console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    //     console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
    //     token0Addr = testData[network].testToken0Addr;
    //     token1Addr = testData[network].testToken1Addr;
    // });

    // beforeEach(async function () {
    //     manager = await deployManager();
    //     console.log(`manager address: ${manager.address}`)
    // });

    // it("Should add a valid pair ", async function () {
    //     //test add supported pair
    //     await chai.expect(manager.addSupportedPair(token0Addr, "0x0000000000000000000000000000000000000000"))
    //         .to.be.revertedWith('addSupportedPair:invalid');
    //     await chai.expect(manager.addSupportedPair(token0Addr, token0Addr))
    //         .to.be.revertedWith('addSupportedPair:invalid');
    //     await manager.addSupportedPair(token0Addr, token1Addr);
    //     //test is supported
    //     chai.expect(await manager.isPairSupported(token0Addr, token1Addr)).to.be.true;
    // });

    // it("Should test manager send buy signal", async function () {
    //     //manager add supported pair
    //     await manager.addSupportedPair(token0Addr, token1Addr);
    //     //manager buy signal
    //     await chai.expect(manager.onSignal([token0Addr, "0x0000000000000000000000000000000000000000"))
    //         .to.be.revertedWith('onSignal:unsupported');
    //     await chai.expect(manager.onSignal([token0Addr, token0Addr]))
    //         .to.be.revertedWith('onSignal:unsupported');
    //     await chai.expect(manager.onSignal([token0Addr, token1Addr])).not.to.reverted;
    // });
});