import { context } from "../utils/context";
import chalk from "chalk";
import { Signer } from "@ethersproject/abstract-signer";
import { BotInstance__factory } from "../typechain";
import { BotConfig, strConfig } from "../utils/BotConfig";
import { Position, strPosition } from "../utils/Position";

let signer: Signer;

async function main() {

    let network: string;
    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    console.log(`------- using network ${network} ---------`);

    const _addresses = require(`../utils/solidroid-address-${network}.json`);
    signer = (await context.signers())[0];
    let address = await signer.getAddress();

    console.log(new Date().toTimeString());
    const botInstance = await BotInstance__factory.connect(_addresses[network].manager.bots[0].address, signer);
    console.log(`bot address: ${chalk.blue(botInstance.address)}`);

    let config: BotConfig = await botInstance.getConfig();
    console.log(strConfig(config))

    let posintion: Position = await botInstance.getPosition();
    console.log(strPosition(posintion));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

