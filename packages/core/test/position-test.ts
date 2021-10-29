import { ethers } from "hardhat";
import * as chai from 'chai';
import { Position } from './Position'
import { BigNumber } from "@ethersproject/bignumber"
import { PositionTest } from '../typechain/PositionTest';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("positionTest", function () {
  let accounts: SignerWithAddress[];
  let positionTest: PositionTest

  beforeEach(async function () {

    accounts = await ethers.getSigners();

    const PositionLib = await ethers.getContractFactory("PositionLib");
    const positionLib = await PositionLib.deploy();
    await positionLib.deployed();
    const PositionTest = await ethers.getContractFactory("PositionTest", {
      libraries: {
        PositionLib: positionLib.address,
      },
    });
    positionTest = await PositionTest.deploy();
    await positionTest.deployed();
  });

  it("Should test position before initialize", async function () {
    let position: Position = await positionTest.getPosition();
    console.log("new position: " + position)
    chai.expect(position.path.length).to.eql(0);
    chai.expect(position.amount.toNumber()).to.eql(0);
    chai.expect(position.lastPrice.toNumber()).to.eql(0);
    chai.expect(position.targets).to.be.empty;
    chai.expect(position.targetsIndex).to.eql(0);
    chai.expect(position.stopLoss.toNumber()).to.eql(0);
    chai.expect(position.underStopLoss).to.be.false;
  });

  it("Should test position after initialize", async function () {
    let entryPrice = ethers.utils.parseEther("4000");// BigNumber.from("4000000000000000000000");// 4000 eth
    let stopLossPercent = 1000; // = %10
    let initialAmount = BigNumber.from("9999"); // = %10

    await positionTest.initialize(
      [
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"
      ],
      entryPrice, stopLossPercent, initialAmount);
    let position: Position = await positionTest.getPosition();

    console.log("initialize position: " + position)
    chai.expect(position.path).to.eql(["0x6B175474E89094C44Da98b954EedeAC495271d0F", "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"]);
    chai.expect(position.amount).to.eql(BigNumber.from("0"));
    chai.expect(position.lastPrice).to.eql(entryPrice);
    chai.expect(position.targets).to.eql([BigNumber.from("4100000000000000000000"), BigNumber.from("4200000000000000000000"), BigNumber.from("4400000000000000000000")]);
    chai.expect(position.targetsIndex).to.eql(0);
    chai.expect(position.stopLoss).to.eql(BigNumber.from("3600000000000000000000"));
    chai.expect(position.underStopLoss).to.be.false;
    chai.expect(position.stopLossAmount).to.eql(position.lastPrice.sub(position.stopLoss));
  });

  it("Should test position nextTarget function", async function () {
    let entryPrice = BigNumber.from("4000000000000000000000");// 4000 eth
    let stopLossPercent = 1000; // = %10
    let initialAmount = BigNumber.from("9999");

    await positionTest.initialize(["0x6B175474E89094C44Da98b954EedeAC495271d0F", "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"],
      entryPrice, stopLossPercent, initialAmount);

    chai.expect(await positionTest.nextTarget()).to.eql(BigNumber.from("4100000000000000000000"));
    await positionTest.targetsIndexPlusPlus();
    chai.expect(await positionTest.nextTarget()).to.eql(BigNumber.from("4200000000000000000000"));
    await positionTest.targetsIndexPlusPlus();
    chai.expect(await positionTest.nextTarget()).to.eql(BigNumber.from("4400000000000000000000"));
    chai.expect(await positionTest.isDone()).to.eql(false);
    await positionTest.targetsIndexPlusPlus();
    chai.expect(await positionTest.nextTarget()).to.eql(BigNumber.from("0"));
    chai.expect(await positionTest.isDone()).to.eql(true);

  });

  it("Should test position nextTargetQuantity function", async function () {
    let entryPrice = BigNumber.from("4000000000000000000000");// 1000 eth
    let stopLossPercent = 1000; // = %10
    let initialAmount = BigNumber.from("9999");

    await positionTest.initialize(["0x6B175474E89094C44Da98b954EedeAC495271d0F", "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"],
      entryPrice, stopLossPercent, initialAmount);

    chai.expect(await positionTest.nextTargetQuantity()).to.eql(BigNumber.from("0"));
    const initialQuantity: BigNumber = BigNumber.from("400");
    //add and check fisrt quantity
    await positionTest.amountAdd(initialQuantity);
    let amount: BigNumber = (await positionTest.getPosition()).amount;
    console.log("current amount " + amount.toString());

    let expectedFirstQuantity: BigNumber = initialQuantity.div(BigNumber.from(4));
    console.log("expectedFirstQuantity " + expectedFirstQuantity.toString());
    console.log("actual FirstQuantity " + (await positionTest.nextTargetQuantity()).toString());
    chai.expect(await positionTest.nextTargetQuantity()).to.eql(expectedFirstQuantity);

    //sub and check amount
    await positionTest.amountSub(expectedFirstQuantity);
    await positionTest.targetsIndexPlusPlus();
    amount = (await positionTest.getPosition()).amount;
    console.log("amount after sub " + amount.toString())
    chai.expect(amount).to.eql(await initialQuantity.sub(expectedFirstQuantity));

    let expectedSecondQuantity: BigNumber = amount.div(BigNumber.from(3));
    console.log("expectedSecondQuantity " + expectedSecondQuantity.toString())
    console.log("actual SecondQuantity " + (await positionTest.nextTargetQuantity()).toString());
    chai.expect(await positionTest.nextTargetQuantity()).to.eql(expectedSecondQuantity);

    await positionTest.amountSub(expectedSecondQuantity);
    await positionTest.targetsIndexPlusPlus();
    amount = (await positionTest.getPosition()).amount;
    console.log("amount after sub " + amount.toString())
    chai.expect(await positionTest.nextTargetQuantity()).to.eql(amount);
    console.log("last quanitty " + (await positionTest.nextTargetQuantity()).toString());

    await positionTest.amountSub(amount);
    await positionTest.targetsIndexPlusPlus();
    console.log("end quanitty " + (await positionTest.nextTargetQuantity()).toString());
    chai.expect(await positionTest.nextTargetQuantity()).to.eql(BigNumber.from("0"));
    chai.expect(await positionTest.isDone()).to.eql(true);
  });

  it("Should test position after initialize with odd numbers", async function () {
    let entryPrice = BigNumber.from("59599760000000000");// 1000 eth
    let stopLossPercent = 400; // = %10
    let initialAmount = BigNumber.from("9999");

    await positionTest.initialize(["0x6B175474E89094C44Da98b954EedeAC495271d0F", "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"],
      entryPrice, stopLossPercent, initialAmount);
    let position: Position = await positionTest.getPosition();

    // console.log("initialize position: " + position)
    chai.expect(position.lastPrice).to.eql(entryPrice);
    chai.expect(position.stopLossAmount).to.eql(position.lastPrice.sub(position.stopLoss));

    console.log("initial price " + position.lastPrice.toString())
    console.log("stoploass " + position.stopLoss.toString())

    console.log("last target " + position.targets[2])
    console.log("initial price + stoplss amout " + position.lastPrice.add(position.stopLossAmount).toString());
    chai.expect(position.targets[2]).to.eql(position.lastPrice.add(position.stopLossAmount));

    console.log("first target " + position.targets[0]);
    let temp: BigNumber = position.stopLossAmount.div(BigNumber.from("4"));
    chai.expect(position.targets[0]).to.eql(entryPrice.add(temp));

    let temp2: BigNumber = position.stopLossAmount.div(BigNumber.from("2"));
    chai.expect(position.targets[1]).to.eql(entryPrice.add(temp2));
  });
});
