import { BigNumber, Signer, utils } from "ethers";
import { context } from "../utils/context";
import chalk from "chalk";
import { deployBotInstance } from "../scripts/deploy_bot-instance";
import * as chai from 'chai';
import { BotConfig } from "../utils/BotConfig";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { deployManager } from "../scripts/deploy-manager";
import { setupSigner } from "./test-manager/setup-signers";
import { printPosition, setupBot } from "./test-manager/create-setup-bot";
import { ethers } from "hardhat";

const _addresses = require('../utils/solidroid-address.json');

describe("test setup manager", function () {

    let network: string;
    let signerAddr: string;
    let manager;
    // let _addresses = require('../utils/solidroid-address.json');

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
        console.log(`------- manager address: ${manager.address}  ---------`);
        console.log(JSON.stringify(_addresses));

    });

    it("Should add supported pairs", async function () {
        this.timeout(0);
        let token0Addr = _addresses[network].tokens[0].address;
        let token1Addr = _addresses[network].tokens[1].address;

        chai.expect(
            await manager.isPairSupported(token0Addr, token1Addr)
        ).to.be.false;

        await manager.addSupportedPair(token0Addr, token1Addr);
        console.log("------- supported pairs added ---------");

        chai.expect(
            await manager.isPairSupported(token0Addr, token1Addr)
        ).to.be.true;

        await chai.expect(
            manager.addSupportedPair(token0Addr, token0Addr)
        ).to.be.revertedWith('addSupportedPair:invalid');

        const SignalStrategy = await ethers.getContractFactory("SignalStrategy");
        const signalStrategy = await SignalStrategy.deploy();
        console.log("deployed signal strategy " + signalStrategy.address);

        const signers: SignerWithAddress[] = await context.signers();

        for (let signerIndex = 0; signerIndex < 2; signerIndex++) {

            await setupSigner(signerIndex, _addresses)

            console.log(`signer[${signerIndex}] ETH balance ${await signers[signerIndex].getBalance()}`);

            await setupBot(signerIndex, _addresses, signalStrategy.address);

            await printPosition(signerIndex, network, _addresses);

        }

        console.log(chalk.magentaBright(`\n\nmanager before signal`));

        let tx = await manager.onSignal(token0Addr, token1Addr, { gasLimit: 995581 });
        await tx.wait().then(tx => console.log(chalk.redBright("gas used: " + tx.gasUsed.toString())));

        for (let signerIndex = 0; signerIndex < 2; signerIndex++) {
            await printPosition(signerIndex, network, _addresses);
        }

        console.log(chalk.magentaBright(`manager before wakeBots`));
        let wake = await manager.wakeBots();
        console.log(chalk.magentaBright(`manager after wakeBots ${wake}`));
        let performTx = await manager.perform({ gasLimit: 995581 });
        await performTx.wait().then(tx => console.log(chalk.redBright("gas used: " + tx.gasUsed.toString())));
    });
});