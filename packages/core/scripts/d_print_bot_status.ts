import { BotInstance__factory, BotInstance, MockERC20__factory } from "../typechain";
import { context } from "../utils/context";
import chalk from "chalk";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { BotConfig, strConfig } from "../utils/BotConfig";
import { Position, strPosition } from "../utils/Position";
import { printBalance } from "../utils/TokensUtils";
import bigDecimal from "js-big-decimal";

let botInstance: BotInstance;
let botAddress: string;
let signer: Signer;
let _addresses: any;

async function main() {

    botAddress = process.env.bot_address || "missing";
    if (botAddress == "missing") throw Error(chalk.redBright("bot address missing"));

    let network: string;
    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    console.log(`------- using network ${network} ---------`);

    _addresses = require(`../utils/solidroid-address-${network}.json`);
    signer = (await context.signers())[0];
    // let address = await signer.getAddress();

    console.log(new Date().toTimeString());
    botInstance = await BotInstance__factory.connect(botAddress, signer);
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

    console.log(new Date().toTimeString());
    console.log(chalk.bgBlue(`========== will enter print bot status in 100ms =================`));

    theLoop(1000);
}

let lastBalance: BigNumber = BigNumber.from(0);
let theLoop: (i: number) => void = (i: number) => {
    setTimeout(async () => {

        try {
            console.log("in the loop");

            console.log(new Date().toTimeString());
            console.log(`bot instance address: ${chalk.blue(botInstance.address)}`);

            // let wakeMe = await botInstance.wakeMe();
            // console.log("wake me: " + wakeMe);

            let result: any[] = await botInstance.getPositionAndAmountOut();
            console.log(strPosition(result[0]));//, result[1], result[2]));

            if (result[0].open == 0) {
                console.log(chalk.red(`position is not open!`));
                return;
            }

            let s = `reserveA: ${chalk.blue(result[1].toString())}\n` +
                `reserveB: ${chalk.blue(result[2].toString())}\n`;
            console.log(s);

            let amount = result[0].amount;

            let amountAOrg = new bigDecimal(amount).multiply(new bigDecimal(result[0].openReserveA)).divide(new bigDecimal(result[0].openReserveB), 8);
            let amountAOut = new bigDecimal(amount).multiply(new bigDecimal(result[1])).divide(new bigDecimal(result[2]), 8);

            console.log("Original amount " + amountAOrg.getValue());
            console.log("Current  amount " + amountAOut.getValue());
            const _100 = new bigDecimal(100);
            let percent = amountAOut.divide(amountAOrg, 8).multiply(_100);
            if (percent.compareTo(_100) > 0) {
                console.log(chalk.green(`% ${percent.getValue()}`));
            } else {
                console.log(chalk.red(`% ${percent.getValue()}`));
            }
            console.log("\n");

            let currentBalance = await signer.getBalance();
            let cost = lastBalance.sub(currentBalance);
            lastBalance = currentBalance;
            console.log(chalk.yellow(`========== account balance  ${currentBalance.toString()} =================`));
            console.log(chalk.red(`========== transaction cost ${cost.toString()} =================`));

        } catch (error) {
            console.log(error);
        }
        if (--i) {
            theLoop(i);
        }
    }, 1000 * 60);
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});