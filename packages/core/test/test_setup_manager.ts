import { BigNumber, Signer, utils } from "ethers";
import { context } from "../utils/context";
import chalk from "chalk";
import { deployBotInstance } from "../scripts/deploy_bot-instance";
import * as chai from 'chai';
import { BotConfig } from "../utils/BotConfig";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { deployManager } from "../scripts/deploy-manager";

const _addresses = require('../utils/solidroid-address.json');

describe("test setup manager", function () {

    let network: string;
    let signerAddr: string;
    let manager;
    let _addresses = require('../utils/solidroid-address.json');

    before(async function () {

        context.setNetwork("localhost"/*envNetwork*/);
        network = await context.netwrok();
        console.log(`------- using network ${network} ---------`);

        const signers: SignerWithAddress[] = await context.signers();
        signerAddr = await signers[0].getAddress();
        console.log(`------- using signer ${signerAddr} ---------`);

        console.log("------- deploy manager ---------");
        manager = await deployManager(_addresses, network);

        console.log("------- manager created ---------");
    });

    it("Should deploy manager", async function () {
        this.timeout(0);

    });
});