import { BigNumber } from "@ethersproject/bignumber";
import chalk from "chalk";
import { utils } from "ethers";
import { run, ethers } from "hardhat";
import { context } from "../test/context";
import { strPosition } from "../test/Position";
import { testData } from "../test/test-data";
import { BotInstance, MockERC20__factory } from "../typechain";

export async function deployBotInstance(
    uniswapV2Router: string,
    beneficiary: string,
    baseAsset: string,
    tradeAmount: BigNumber,
    stopLossPercent: BigNumber,
    loop: boolean):

    Promise<BotInstance> {

    await run("compile");
    const BotInstanceLib = await ethers.getContractFactory("BotInstanceLib");
    const botInstanceLib = await BotInstanceLib.deploy();
    await botInstanceLib.deployed();

    const PositionLib = await ethers.getContractFactory("PositionLib");
    const positionLib = await PositionLib.deploy();
    await positionLib.deployed();

    const BotInstance = await ethers.getContractFactory("BotInstance", {
        libraries: {
            PositionLib: positionLib.address,
            BotInstanceLib: botInstanceLib.address
        },
    });

    console.log("deploy contract: BotInstance");

    return BotInstance.deploy(
        uniswapV2Router,
        beneficiary,
        baseAsset,
        tradeAmount,
        stopLossPercent,
        loop);
};

export async function publishAndInitBot() {

    let network: string;
    let acctAddr: string;
    let token0Addr: string;
    let token1Addr: string;

    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    let signer = (await context.signers())[0];
    console.log(`signer address: ${chalk.blue(signer.address)}`);
    token0Addr = testData[network].token0Addr;
    token1Addr = testData[network].token1Addr;

    let defaultAmount: BigNumber = utils.parseEther('4.5');//BigNumber.from("2595988885165088891");
    let stopLossPercent: BigNumber = BigNumber.from("250");
    console.log('ctor!');

    let botInstance = await deployBotInstance(
        testData[network].quickV2Router02,
        signer.address,
        token0Addr,
        defaultAmount,
        stopLossPercent,
        true);

    await botInstance.deployed();

    console.log(`bot address: ${chalk.blue(botInstance.address)}`);

    console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
    let acct1 = (await context.signers())[0];
    let mockERC20_0 = await MockERC20__factory.connect(token0Addr, acct1);
    let token0balance = await mockERC20_0.balanceOf(await acct1.getAddress());
    await mockERC20_0.approve(botInstance.address, token0balance);
    await mockERC20_0.transfer(botInstance.address, token0balance);

    console.log("------------- invoking buySignal ------------------");
    await botInstance.buySignal([token0Addr, token1Addr]);
    console.log("------------- exit buySignal ------------------");

    let position = await botInstance.getPosition();
    console.log("========= position =========");
    console.log(strPosition(position));
};


publishAndInitBot().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});