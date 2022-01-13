
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
    let token1Addr = _addresses[network].tokens[3].address;

    botInstance = await BotInstance__factory.connect(_addresses[network].manager.bots[0].address, signer);
    console.log(`bot address: ${chalk.blue(botInstance.address)}`);

    let config: BotConfig = await botInstance.getConfig();
    console.log(strConfig(config))

    console.log("------------- invoking buySignal ------------------");
    let tx = await botInstance.buySignal(token0Addr, token1Addr, { gasLimit: 555581 });
    console.log(tx);
    // (await tx).wait().then(details => {
    //     console.log("gasUsed: " + details.gasUsed.toString());
    //     console.log("cumulativeGasUsed: " + details.cumulativeGasUsed.toString());
    //     console.log("effectiveGasPrice: " + details.effectiveGasPrice.toString());

    // });
    console.log("------------- exit buySignal ------------------");

    let posintion: Position = await botInstance.getPosition();
    console.log(strPosition(posintion));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});