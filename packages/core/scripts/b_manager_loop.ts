import { BotInstance__factory, SoliDroidManager__factory } from "../typechain";
import { context } from "../test/context";
import chalk from "chalk";
import {Token} from "../deploy/Tokne" 
import { Signer } from "@ethersproject/abstract-signer";
import { strPosition } from "../test/Position";

async function main() {

    const network = "matic";
    console.log(`------- using network ${network} ---------`);

    const _addresses = require(`../utils/solidroid-address-${network}.json`);
    let managerAddress = _addresses[network].manager.address;
    let signer = (await context.signers())[0];
    let manager = await SoliDroidManager__factory.connect(managerAddress,signer);

    console.log(chalk.magentaBright(`manager (${manager.address}) before wake bots.`));
    
    let wake = await manager.wakeBots();
    console.log(`manager.wakeBots is ${wake}`);

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
