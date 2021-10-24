import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import * as chai from 'chai';
import { BotInstance } from "../typechain";

describe("SoliDroidManaget", function () {

    let accounts: Signer[];
    let manager: any;

    beforeEach(async function () {

        accounts = await ethers.getSigners();

        const SoliDroidManaget = await ethers.getContractFactory("SoliDroidManaget");
        manager = await SoliDroidManaget.deploy();
        await manager.deployed();
    });

    it("Should test BotInstance update", async function () {

        let newInstance: BotInstance = await manager.callStatic.updateBot(
            "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
            BigNumber.from("100"),
            BigNumber.from("500"),
            true,
        );

        // console.log(await newInstance.callStatic.getProperties())

        // expect(await newInstance.isContract(newInstance.address)).to.be.true;

        chai.expect(newInstance).not.to.eql("0x0000000000000000000000000000000000000000");
        // chai.expect(newInstance.)
        // let address = await manager.callStatic.getBot();
        // chai.expect(instanceAddress).to.eql(address);


        // console.log("======================================")
        // console.log(instanceAddress);
        // console.log("======================================")

    });
});