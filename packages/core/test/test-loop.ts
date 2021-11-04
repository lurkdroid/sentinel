import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { BotInstance, MockERC20, MockERC20__factory } from "../typechain";
import { deployBotInstance } from "../scripts/1_deploy_bot-instance"
import { Position, strPosition } from "./Position";
import * as chai from 'chai';
import { Swapper } from "../typechain/Swapper";
import { deploySwapper } from "../scripts/deploy_swapper";
import chalk from "chalk";
import { context } from "./context";
import { testData } from "./test-data";

describe("test bot loop", function () {

  let swapper: Swapper

  let acct1Addr: string;
  let mockERC20_0: MockERC20;
  let mockERC20_1: MockERC20;
  let startBotBalance0: BigNumber;
  ////////////////////////////////////////////////
  let token0Addr: string;
  let token1Addr: string;
  let acct1: Signer;

  let network: string;
  let acctAddr: string;

  let botInstance: BotInstance;
  let quoteAsset: string;
  let defaultAmount: BigNumber = BigNumber.from(ethers.utils.parseEther("10"));
  let stopLossPercent: BigNumber = BigNumber.from("450");
  let loop: boolean = true;

  before(async function () {
    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    console.log(`signer address: ${chalk.blue(acct1Addr = await context.signerAddress())}`);
    acct1 = (await context.signers())[0];
    token0Addr = testData[network].testToken0Addr;
    token1Addr = testData[network].testToken1Addr;
  });

  beforeEach(async function () {
    console.log(ethers.utils.formatEther(await acct1.getBalance()));

    swapper = await deploySwapper();
    swapper.deployed();

    botInstance = await deployBotInstance(
      testData[network].uniswapV2Router,
      acct1Addr,
      token0Addr,
      defaultAmount,
      stopLossPercent,
      loop);
    await botInstance.deployed();

    //transfer some tokens to the bot
    mockERC20_0 = await MockERC20__factory.connect(token0Addr, acct1);
    mockERC20_1 = await MockERC20__factory.connect(token1Addr, acct1);

    await mockERC20_0.approve(botInstance.address, defaultAmount);
    await mockERC20_0.transfer(botInstance.address, defaultAmount);

    startBotBalance0 = await mockERC20_0.balanceOf(botInstance.address);
    console.log("> start balance of 0 :" + startBotBalance0.toString());
    let startBotBalance1 = await mockERC20_1.balanceOf(botInstance.address);
    console.log("> start balance of 1 :" + startBotBalance1.toString());

    await botInstance.buySignal([token0Addr, token1Addr]);
    console.log("--------- on signal success -------------");
  });

  it("Should successfuly call loop", async function () {
    this.timeout(0);
    await botInstance.botLoop();
  });

  // it("Should stop loss", async function () {
  //   this.timeout(0);
  //   // let test = await botInstance.testEntry();
  //   // console.log(test[0].toString(), test[1].toString(), test[2]);
  //   let position: Position = await botInstance.getPosition();
  //   console.log("position: \n" + strPosition(position))

  //   let positionBalance0 = await mockERC20_0.balanceOf(botInstance.address);
  //   console.log("> position balance of 0 :" + positionBalance0.toString());
  //   let positionBalance1 = await mockERC20_1.balanceOf(botInstance.address);
  //   console.log("> position balance of 1 :" + positionBalance1.toString());
  //   chai.expect(BigNumber.from(0)).to.eql(positionBalance0);

  //   let sellAmount = BigNumber.from(ethers.utils.parseEther("200"));
  //   await mockERC20_1.approve(swapper.address, sellAmount);
  //   await mockERC20_1.transfer(swapper.address, sellAmount);

  //   await swapper.swap(sellAmount, token1Addr, token0Addr);
  //   console.log("------- after swap --------");

  //   await botInstance.botLoop()

  //   console.log("position: \n" + strPosition(await botInstance.getPosition()))

  //   let endBotBalance0 = await mockERC20_0.balanceOf(botInstance.address);
  //   console.log("> balance of 0 after stoploss :" + endBotBalance0.toString());
  //   let endBotBalance1 = await mockERC20_1.balanceOf(botInstance.address);
  //   console.log("> balance of 1 after stoploss :" + endBotBalance1.toString());
  //   chai.expect(startBotBalance0).to.gt(endBotBalance0);
  //   chai.expect(positionBalance1).to.gt(endBotBalance1);
  //   chai.expect(BigNumber.from(0)).to.eql(endBotBalance1);
  // });
});
