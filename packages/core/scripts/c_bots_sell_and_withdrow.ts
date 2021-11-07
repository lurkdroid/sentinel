import { BotInstance__factory, SoliDroidManager__factory } from "../typechain";
import { context } from "../test/context";
import chalk from "chalk";
import {Token} from "../deploy/Tokne" 
import { Signer } from "@ethersproject/abstract-signer";
import { strPosition } from "../test/Position";
import { BotConfig, strConfig } from "../test/BotConfig";

async function main() {

    const network = "matic";
    console.log(`------- using network ${network} ---------`);

    const _addresses = require(`../utils/solidroid-address-${network}.json`);
    let signer = (await context.signers())[0];

    let bots = _addresses[network].manager.bots;
    for (let i = 0; i < bots.length; i++) {
        console.log(chalk.magentaBright(`bot (${bots[i].address}).`));
        let botInstance = BotInstance__factory.connect(bots[i].address, signer);
        let position = await botInstance.getPosition();

        console.log(`------- bot position ---------`);
        console.log(strPosition(position));
        
        console.log(`------- bot sell ---------`);
        let tx = await botInstance.sellPosition(
            { gasLimit:555581}
        );
        await tx.wait().then(tx => console.log("gas used:          " + tx.gasUsed.toString()));

        console.log(`------- bot position ---------`);
        position = await botInstance.getPosition();
        console.log(strPosition(position));

        let config: BotConfig = await botInstance.getConfig();
        console.log(strConfig(config));

        await botInstance.withdraw(config.quoteAsset);
    }
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
