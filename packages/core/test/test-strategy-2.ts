import { ethers } from "hardhat";
import * as chai from 'chai';
import { BigNumber } from "@ethersproject/bignumber"
import { StrategyTest } from "../typechain/StrategyTest";

describe("strategy test", function () {

  let strategyTest: StrategyTest;

  before(async function () {

    const SignalStrategy = await ethers.getContractFactory("SignalStrategy");
    const signalStrategy = await SignalStrategy.deploy();
    console.log("deployed signal strategy " + signalStrategy.address);

    const StrategyTest = await ethers.getContractFactory("StrategyTest");
    this.strategyTest = await StrategyTest.deploy(signalStrategy.address);
    console.log("deployed strategyTest " + this.strategyTest.address);
  });

  it("test strategy should sell - stoploss", async function () {
    // bot address: 0x472132145C8f85E65A187bE9c766F66eFbCcE9AD
    // quoteAsset: 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270
    // defaultAmount: 1000000000000000000
    // stopLossPercent: 250
    // loop: true
    // defaultAmountOnly false

    let position = {
      baseAsset: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      openReserveA: BigNumber.from("7557340295114497789961507"),
      openReserveB: BigNumber.from("4848733844162929696425"),
      blockTimestamp: BigNumber.from("1640196864"),
      amount: BigNumber.from("639667937862144"),
      sells: BigNumber.from(0),
      buys: BigNumber.from(1),
      open: true
    }
    //lost less than stoploss
    chai.expect(
      await this.strategyTest.shouldSell(
        position,
        BigNumber.from("7302913132947552622879845"),
        BigNumber.from("4755259798219007702485"),
        BigNumber.from(25)
      )
    ).to.be.eql(BigNumber.from(0));
    //lost more than stoploss
    chai.expect(
      await this.strategyTest.shouldSell(
        position,
        BigNumber.from("9700000000000000000000"),
        BigNumber.from("10300000000000000000000"),
        BigNumber.from(50)
      )
    ).to.be.eql(position.amount);
  });

  it("test strategy should sell - targets", async function () {
    let position = {
      baseAsset: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      openReserveA: BigNumber.from("10000000000000000000000"),
      openReserveB: BigNumber.from("10000000000000000000000"),
      blockTimestamp: BigNumber.from("1639509191"),
      amount: BigNumber.from("48011649782951378"),
      sells: BigNumber.from(0),
      buys: BigNumber.from(1),
      open: true
    }
    chai.expect(
      await this.strategyTest.shouldSell(
        position,
        BigNumber.from("10080000000000000000000"),
        BigNumber.from("9920000000000000000000"),
        BigNumber.from(50)
      )
    ).to.be.eql(BigNumber.from("12196507807765874"));

    position.sells = BigNumber.from(1);

    chai.expect(
      await this.strategyTest.shouldSell(
        position,
        BigNumber.from("10080000000000000000000"),
        BigNumber.from("9920000000000000000000"),
        BigNumber.from(50)
      )
    ).to.be.eql(BigNumber.from(0));

    chai.expect(
      await this.strategyTest.shouldSell(
        position,
        BigNumber.from("10300000000000000000000"),
        BigNumber.from("9880000000000000000000"),
        BigNumber.from(50)
      )
    ).to.be.eql(BigNumber.from("16684210282199702"));

    position.sells = BigNumber.from(2);

    chai.expect(
      await this.strategyTest.shouldSell(
        position,
        BigNumber.from("10500000000000000000000"),
        BigNumber.from("9860000000000000000000"),
        BigNumber.from(50)
      )
    ).to.be.eql(BigNumber.from("51128024616733211"));
  });
});
