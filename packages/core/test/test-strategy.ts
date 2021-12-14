import { ethers } from "hardhat";
import * as chai from 'chai';
import { Position } from '../utils/Position'
import { BigNumber } from "@ethersproject/bignumber"
import { SignalStrategy } from '../typechain/SignalStrategy';
import { utils } from "ethers";
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

  it("test strategy buy", async function () {

    let position = {
      baseAsset: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      openReserveA: BigNumber.from(0),
      openReserveB: BigNumber.from(0),
      blockTimestamp: BigNumber.from(0),
      amount: BigNumber.from(5),
      sells: BigNumber.from(0),
      buys: BigNumber.from(0),
      open: false
    }

    chai.expect(
      await this.strategyTest.shouldBuy(
        position,
        BigNumber.from(0),
        BigNumber.from(0)
      )
    ).to.be.eql(position.amount);

    position.blockTimestamp = BigNumber.from(1);
    chai.expect(
      await this.strategyTest.shouldBuy(
        position,
        BigNumber.from(0),
        BigNumber.from(0)
      )
    ).to.be.eql(BigNumber.from(0));

  });
});
