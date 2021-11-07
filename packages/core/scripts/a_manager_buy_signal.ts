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

    let tokenArray: Array<Token> = _addresses[network].tokens;
    let token0 = tokenArray[0];
    let token1 = tokenArray[1];

    console.log(chalk.magentaBright(`manager (${manager.address}) before signal. ${token0.name} - ${token1.name}`));
        
    let tx = await manager.onSignal([token0.address, token1.address],{ gasLimit:995581});
    await tx.wait().then(tx => console.log(chalk.redBright("gas used: " + tx.gasUsed.toString())));

    await printPosition(network,_addresses, signer);

}

export async function printPosition( network:string, _addresses:any, signer: Signer) {

    let manager = SoliDroidManager__factory.connect(_addresses[network].manager.address, signer);
    let botAddress = await manager.getBot();
    let botInstance = BotInstance__factory.connect(botAddress, signer);
    let position = await botInstance.getPosition();
    console.log(`------- bot (${botInstance.address}) position ---------`);
    console.log(strPosition(position));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
