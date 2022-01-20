import { BotInstance__factory, SoliDroidManager__factory } from "../typechain";
import { context } from "../utils/context";
import chalk from "chalk";
import { Token } from "../utils/Tokne"
import { Signer } from "@ethersproject/abstract-signer";
import { strPosition } from "../utils/Position";

async function main() {

    const network = "avax";
    console.log(`------- using network ${network} ---------`);

    const _addresses = require(`../utils/solidroid-address-${network}.json`);
    let managerAddress = _addresses[network].manager.address;
    let signer = (await context.signers())[0];
    let manager = await SoliDroidManager__factory.connect(managerAddress, signer);

    let token0Addr = _addresses[network].tokens[0].address;
    let token1Addr = _addresses[network].tokens[3].address;

    console.log(chalk.magentaBright(`manager (${manager.address}) before signal. ${token0Addr} - ${token1Addr}`));

    let tx = await manager.onSignal(token0Addr, token1Addr, { gasLimit: 995581 });
    // await tx.wait().then(tx => console.log(chalk.redBright("gas used: " + tx.gasUsed.toString())));
    await tx.wait().then(console.log);

    await printPosition(network, _addresses, signer);

}

export async function printPosition(network: string, _addresses: any, signer: Signer) {

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
