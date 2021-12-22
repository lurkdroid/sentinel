
import { BotInstance__factory, BotInstance } from "../typechain";
import { context } from "../utils/context";
import chalk from "chalk";
import { Position, strPosition } from "../utils/Position";
import { assert } from "console";
import { BotConfig, strConfig } from "../utils/BotConfig";

let botInstance: BotInstance;

async function main() {

    let network: string;
    let acctAddr: string;

    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    const _addresses = require(`../utils/solidroid-address-${network}.json`);
    assert(network === "matic");
    console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
    const signer = (await context.signers())[0];
    let token0Addr = _addresses[network].tokens[0].address;

    botInstance = await BotInstance__factory.connect(_addresses[network].manager.bots[0].address, signer);
    console.log(`bot address: ${chalk.blue(botInstance.address)}`);



    console.log("------------- invoking withdrow ------------------");
    let tx = botInstance.withdraw(token0Addr);
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