import { context } from "../utils/context";
import chalk from "chalk";
import { Signer } from "@ethersproject/abstract-signer";
import { BotInstance__factory, MockERC20__factory } from "../typechain";
import { BotConfig, strConfig } from "../utils/BotConfig";
import { Position, strPosition } from "../utils/Position";
import { printBalance } from "../utils/TokensUtils";

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

    let token0Addr = _addresses[network].tokens[0].address;
    let token1Addr = _addresses[network].tokens[3].address;

    let mockERC20_0 = await MockERC20__factory.connect(token0Addr, signer);
    let mockERC20_1 = await MockERC20__factory.connect(token1Addr, signer);

    printBalance(mockERC20_0, botInstance.address, "bot");
    printBalance(mockERC20_1, botInstance.address, "bot");

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

