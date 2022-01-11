import { BotInstance__factory } from "../typechain";
import { BotConfig, strConfig } from "../utils/BotConfig"
import { context } from "../utils/context";
import chalk from "chalk";
import { Position, strPosition } from "../utils/Position";
import assert from "assert";

async function main() {

    let network: string;
    let acctAddr: string;

    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    const _addresses = require(`../utils/solidroid-address-${network}.json`);
    assert(network === "matic");
    console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
    let signer = (await context.signers())[0];

    let botInstance = await BotInstance__factory.connect(_addresses[network].manager.bots[0].address, signer);
    console.log(`bot address: ${chalk.blue(botInstance.address)}`);

    let config: BotConfig = await botInstance.getConfig();
    console.log(strConfig(config));

    let posintion: Position = await botInstance.getPosition();
    try {
        console.log(strPosition(posintion));
    } catch (err) {
        console.log(err);
    }

    console.log(chalk.bgBlue(`========== calling bot loop =================`));
    let tx = await botInstance.botLoop(
        { gasLimit: 555581, gasPrice: 90000000000 }
    );
    console.log(chalk.bgBlue(`===========================`));
    await tx.wait().then(tx => console.log("gas used:          " + tx.gasUsed.toString()));
    console.log(chalk.bgBlue(`===========================`));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
