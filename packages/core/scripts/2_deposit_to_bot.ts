import { context } from "../utils/context";
import chalk from "chalk";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { utils } from "ethers";
import { BotInstance__factory, MockERC20__factory } from "../typechain";
import { transfer } from "../utils/TokensUtils"
import { BotConfig } from "../utils/BotConfig";


async function main() {

    let network: string;
    let signer: Signer;

    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    console.log(`------- using network ${network} ---------`);

    const _addresses = require(`../utils/solidroid-address-${network}.json`);
    signer = (await context.signers())[0];
    console.log(`signer address: ${chalk.blue(await signer.getAddress())}`);
    let botAddress = _addresses[network].manager.bots[0].address;
    console.log(new Date().toTimeString());
    const botInstance = await BotInstance__factory.connect(botAddress, signer);
    console.log(`bot address: ${chalk.blue(botInstance.address)}`);

    let config: BotConfig = await botInstance.getConfig();

    await transfer(signer, config.quoteAsset, botInstance.address, config.defaultAmount);

    let mockERC20_0 = await MockERC20__factory.connect(config.quoteAsset, signer);
    let initialBotBalance0 = await mockERC20_0.balanceOf(botInstance.address);
    console.log("balance of 0 after deposit :" + initialBotBalance0.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

