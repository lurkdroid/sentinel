import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "hardhat";
import { BotInstance } from "../typechain";

export async function deployBotInstance(
    uniswapV2Router: string,
    uniswapV2Factory: string,
    beneficiary: string,
    baseAsset: string,
    tradeAmount: BigNumber,
    stopLossPercent: BigNumber,
    loop: boolean) {

    const SignalStrategy = await ethers.getContractFactory("SignalStrategy");
    const signalStrategy = await SignalStrategy.deploy();
    console.log("deployed signal strategy " + signalStrategy.address);

    return _deployBotInstance(
        signalStrategy.address,
        uniswapV2Router,
        uniswapV2Factory,
        beneficiary,
        baseAsset,
        tradeAmount,
        stopLossPercent,
        loop
    );
}


export async function _deployBotInstance(
    strategyAddress,
    uniswapV2Router: string,
    uniswapV2Factory: string,
    beneficiary: string,
    baseAsset: string,
    tradeAmount: BigNumber,
    stopLossPercent: BigNumber,
    loop: boolean):

    Promise<BotInstance> {

    const BotInstanceLib = await ethers.getContractFactory("BotInstanceLib");
    const botInstanceLib = await BotInstanceLib.deploy();
    await botInstanceLib.deployed();

    const botInstanceFactory = await ethers.getContractFactory("BotInstance"
        , {
            libraries: {
                BotInstanceLib: botInstanceLib.address
            },
        }
    );

    const PriceFeed = await ethers.getContractFactory("PriceFeed");
    const priceFeed = await PriceFeed.deploy();
    console.log("deployed price feed " + priceFeed.address);

    console.log("deploy contract: BotInstance");

    return botInstanceFactory.deploy(
        uniswapV2Router,
        uniswapV2Factory,
        priceFeed.address,
        beneficiary,
        baseAsset,
        strategyAddress,
        tradeAmount,
        stopLossPercent,
        loop);
};
