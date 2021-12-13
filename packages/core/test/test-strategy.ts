import { ethers } from "hardhat";
import * as chai from 'chai';
import { Position } from '../utils/Position'
import { BigNumber } from "@ethersproject/bignumber"
import { SignalStrategy } from '../typechain/SignalStrategy';
import { utils } from "ethers";

describe("strategy test", function () {

  let signalStrategy: SignalStrategy

  before(async function () {
    const SignalStrategy = await ethers.getContractFactory("SignalStrategy");
    signalStrategy = await SignalStrategy.deploy();
    console.log("deployed signal strategy " + signalStrategy.address);
  });

  it("test strategy buy", async function () {
    // let position: Position = {
    //   baseAsset: "",
    //   openReserveA: BigNumber.from(0),
    //   openReserveB: BigNumber.from(0),
    //   blockTimestamp: 0,
    //   amount: BigNumber.from(0),
    //   sells: 0,
    //   buys: 0,
    //   open: false
    // }
    // chai.expect(

    await signalStrategy.shouldBuy(
      {
        baseAsset: "",
        openReserveA: BigNumber.from(0),
        openReserveB: BigNumber.from(0),
        blockTimestamp: BigNumber.from(0),
        amount: BigNumber.from(0),
        sells: BigNumber.from(0),
        buys: BigNumber.from(0),
        open: false
      },
      BigNumber.from(0),
      BigNumber.from(0));

    // ).eq(BigNumber.from(0));
  });

});
