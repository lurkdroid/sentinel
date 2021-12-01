import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "hardhat";
import { BotInstance } from "../typechain";

export async function deployBotInstance(
    uniswapV2Router: string,
    beneficiary: string,
    baseAsset: string,
    tradeAmount: BigNumber,
    stopLossPercent: BigNumber,
    loop: boolean):

    Promise<BotInstance> {

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

    const PriceFeed = await ethers.getContractFactory("PriceFeed");
    const priceFeed = await PriceFeed.deploy();
    console.log("deployed price feed " + priceFeed.address);

    console.log("deploy contract: BotInstance");

    return BotInstance.deploy(
        uniswapV2Router,
        priceFeed.address,
        beneficiary,
        baseAsset,
        tradeAmount,
        stopLossPercent,
        loop);
};
