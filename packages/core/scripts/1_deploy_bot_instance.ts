import { context } from "../utils/context";
import chalk from "chalk";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { deployBotInstance } from "./deploy_bot-instance";
import { utils } from "ethers";

let signer: Signer;

async function main() {

    let network: string;

    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    console.log(`using network ${network} ---------`);

    const _addresses = require(`../utils/solidroid-address-${network}.json`);
    signer = (await context.signers())[0];
    let address = await signer.getAddress();

    console.log(new Date().toTimeString());
    console.log(chalk.bgBlue(`========== start bot instance deploy =================`));

    let quoteAsset = _addresses[network].tokens[0].address;
    let defaultAmount = utils.parseEther(_addresses[network].bot_config.amount);
    let stopLossPercent = BigNumber.from(_addresses[network].bot_config.percent);

    let botInstance = await deployBotInstance(
        _addresses[network].uniswap_v2_router,
        _addresses[network].uniswap_v2_factory,
        address,
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
