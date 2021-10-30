import { network, ethers, waffle } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { BotInstance } from "../typechain";
import { deployBotInstance } from "../scripts/deploy_bot-instance"
import * as chai from 'chai';
import { MockERC20__factory } from "../typechain/factories/MockERC20__factory";
import { strPosition } from "./Position"
import bigDecimal from "js-big-decimal";
import chalk from "chalk";
import { testData } from "./test-data";
import { context } from "./context";
describe("test bot signal", function () {

  // tokens and liquidity on rinkeby testnet
  let token0Addr: string;
  let token1Addr: string;
  let acct1: Signer;

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
    acct1 = (await context.signers())[0];
    token0Addr = testData[network].token0Addr;
    token1Addr = testData[network].token1Addr;
  });

  beforeEach(async function () {
    console.log(ethers.utils.formatEther(await acct1.getBalance()));
    botInstance = await deployBotInstance(
      acctAddr,
      token0Addr,
      defaultAmount,
      stopLossPercent,
      loop);
    await botInstance.deployed();
  });

  it("Should reverted 'BotInstance: quote asset not supported'", async function () {
    await chai.expect(botInstance.buySignal([token1Addr, token0Addr]))
      .revertedWith("BotInstance: quote asset not supported")
  });

  it("Should revert BotInstance. insufficient balance", async function () {
    await chai.expect(botInstance.buySignal([token0Addr, token1Addr]))
      .revertedWith("BotInstance: insufficient balance")
  });

  it("Should swap", async function () {
    let mockERC20_0 = await MockERC20__factory.connect(token0Addr, acct1);
    let mockERC20_1 = await MockERC20__factory.connect(token1Addr, acct1);

    await mockERC20_0.approve(botInstance.address, defaultAmount);
    await mockERC20_0.transfer(botInstance.address, defaultAmount);

    let initialBotBalance0 = await mockERC20_0.balanceOf(botInstance.address);
    console.log("balance of 0 before swap :" + initialBotBalance0.toString());
    let initialBotBalance1 = await mockERC20_1.balanceOf(botInstance.address);
    console.log("balance of 1 before swap :" + initialBotBalance1.toString());

    chai.expect(initialBotBalance0).to.eql(defaultAmount);
    chai.expect(initialBotBalance1).to.eql(BigNumber.from(0));

    await botInstance.buySignal([token0Addr, token1Addr]);
    console.log("---------------------------------------");

    let afterSwapBotBalance = await mockERC20_0.balanceOf(botInstance.address);
    console.log("balance of 0 after swap :" + afterSwapBotBalance.toString());
    let afterSwapBotBalance1 = await mockERC20_1.balanceOf(botInstance.address);
    console.log("balance of 1 after swap :" + afterSwapBotBalance1.toString());

    chai.expect(afterSwapBotBalance).to.eql(BigNumber.from(0));
    chai.expect(afterSwapBotBalance1).to.be.gt(BigNumber.from(0));

    //== validate position 
    let position = await botInstance.getPosition();
    chai.expect(position.amount).to.eql(position.initialAmount);

    let percentfactor = new bigDecimal(stopLossPercent.toNumber() / 10000);
    console.log(percentfactor.getValue().toString())
    let dAmount: bigDecimal = new bigDecimal(defaultAmount.toString())
    let expectedStopLossAmount = percentfactor.multiply(dAmount);

    console.log(expectedStopLossAmount.getValue().toString())

    chai.expect(position.path).to.eql([token0Addr, token1Addr]);
    chai.expect(position.amount).to.gt(BigNumber.from("0"));
    chai.expect(position.lastPrice).to.eql(defaultAmount);
    chai.expect(position.targetsIndex).to.eql(0);
    chai.expect(position.underStopLoss).to.be.false;
    chai.expect(position.stopLossAmount.toString()).to.eql(expectedStopLossAmount.getValue().toString());

    console.log("position: \n---------------------------\n" + strPosition(position));
    let config = await botInstance.getConfig();
    console.log("config: \n---------------------------\n" + config);
  });
});
