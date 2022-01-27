import { context } from "../utils/context";
import chalk from "chalk";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { utils } from "ethers";
import { BotInstance, BotInstance__factory } from "../typechain";
import { ethers } from "hardhat";

let signer: Signer;
let botInstance: BotInstance;

async function main() {

    let network: string;

    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    console.log(`using network ${network} ---------`);

    const _addresses = require(`../utils/solidroid-address-${network}.json`);
    signer = (await context.signers())[0];
    let address = await signer.getAddress();

    console.log(new Date().toTimeString());
    console.log(chalk.bgBlue(`========== start bot instance update =================`));

    botInstance = await BotInstance__factory.connect(_addresses[network].manager.bots[0].address, signer);
    console.log(`bot address: ${chalk.blue(botInstance.address)}`);

    let quoteAsset = _addresses[network].tokens[0].address;
    let defaultAmount = utils.parseEther(_addresses[network].bot_config.amount);
    let stopLossPercent = BigNumber.from(_addresses[network].bot_config.percent);


    const SignalStrategy = await ethers.getContractFactory("SignalStrategy");
    const signalStrategy = await SignalStrategy.deploy();
    console.log("deployed signal strategy " + signalStrategy.address);

    let signalStrategy_address = signalStrategy.address;// _addresses[network].signal_strategy;
    // const SignalStrategy = await ethers.getContractFactory("SignalStrategy");
    // const signalStrategy = await SignalStrategy.deploy();
    // console.log("deployed signal strategy " + signalStrategy_address);

    botInstance.update(
        signalStrategy_address,
        quoteAsset,
        defaultAmount,
        stopLossPercent,
        true);

    console.log(`bot address: ${chalk.blue(botInstance.address)}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//0x472132145C8f85E65A187bE9c766F66eFbCcE9AD
