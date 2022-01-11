
import { BotInstance__factory, BotInstance } from "../typechain";
import { context } from "../utils/context";
import chalk from "chalk";
import { assert } from "console";

let botInstance: BotInstance;

async function main() {

    let network: string;
    let acctAddr: string;

    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    const _addresses = require(`../utils/solidroid-address-${network}.json`);
    assert(network === "matic");
    console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
    const signer = (await context.signers())[0];

    botInstance = await BotInstance__factory.connect(_addresses[network].manager.bots[0].address, signer);

    console.log(`bot address: ${chalk.blue(botInstance.address)}`);

    console.log("------------- invoking sell ------------------");
    let tx = botInstance.sellPosition();
    (await tx).wait().then(details => {
        console.log("gasUsed: " + details.gasUsed.toString());
        console.log("cumulativeGasUsed: " + details.cumulativeGasUsed.toString());
        console.log("effectiveGasPrice: " + details.effectiveGasPrice.toString());
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});