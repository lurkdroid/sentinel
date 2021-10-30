import { BigNumber } from "@ethersproject/bignumber";
import { run, ethers } from "hardhat";
import { BotInstance } from "../typechain";

export async function deployBotInstance(
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

    return BotInstance.deploy(beneficiary, baseAsset,
        tradeAmount,
        stopLossPercent,
        loop);
}