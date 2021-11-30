import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { BotInstance, MockERC20, MockERC20__factory } from "../typechain";
import { deployBotInstance } from "../scripts/1_deploy_bot-instance"
import * as chai from 'chai';
import { Swapper } from "../typechain/Swapper";
import chalk from "chalk";
import { context } from "../utils/context";
const _addresses = require('../utils/solidroid-address.json');
import {swapToWETH, transfer} from "../utils/TokensUtils"

describe("test bot loop", function () {

  let swapper: Swapper

  let acct1Addr: string;
  let mockERC20_0: MockERC20;
  let mockERC20_1: MockERC20;
  let startBotBalance0: BigNumber;
  ////////////////////////////////////////////////
  let token0Addr: string;
  let token1Addr: string;
  let signer: Signer;

  let network: string;
  let acctAddr: string;

  let botInstance: BotInstance;
  let quoteAsset: string;
  let defaultAmount: BigNumber = BigNumber.from(ethers.utils.parseEther("10"));
  let stopLossPercent: BigNumber = BigNumber.from("450");
  let loop: boolean = true;

  before(async function () {
    signer = (await context.signers())[0];
    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    console.log(`signer address: ${chalk.blue(acct1Addr = await context.signerAddress())}`);
    token0Addr = _addresses[network].tokens[0].address;
    token1Addr = _addresses[network].tokens[1].address;
  });

  beforeEach(async function () {

    // swapper = await deploySwapper();
    // swapper.deployed();

    botInstance = await deployBotInstance(
      _addresses[network].uniswap_v2_router,
      acct1Addr,
      token0Addr,
      defaultAmount,
      stopLossPercent,
      loop);

    //transfer some tokens to the bot
    mockERC20_0 = await MockERC20__factory.connect(token0Addr, signer);
    mockERC20_1 = await MockERC20__factory.connect(token1Addr, signer);

    await swapToWETH(signer,token0Addr,defaultAmount);
    await transfer(signer, token0Addr, botInstance.address, defaultAmount)

    startBotBalance0 = await mockERC20_0.balanceOf(botInstance.address);
    console.log("> start balance of 0 :" + startBotBalance0.toString());
    let startBotBalance1 = await mockERC20_1.balanceOf(botInstance.address);
    console.log("> start balance of 1 :" + startBotBalance1.toString());

  });

  it("Should successfuly call loop", async function () {
    // this.timeout(0);
    // await botInstance.buySignal([token0Addr, token1Addr], { gasLimit: 2500000 });
    // console.log("--------- on signal success -------------");
    // await botInstance.botLoop();
  });
});
