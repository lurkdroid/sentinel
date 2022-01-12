import { BigNumber, Signer } from "ethers";
import { BotInstance__factory, BotInstance } from "../typechain";
import { BotConfig, strConfig } from "../utils/BotConfig"
import { context } from "../utils/context";
import chalk from "chalk";
import { Position, strPosition } from "../utils/Position";
import assert from "assert";
import bigDecimal from "js-big-decimal";

let botInstance: BotInstance;
let signer;

async function main() {

    let network: string;
    let acctAddr: string;

    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    const _addresses = require(`../utils/solidroid-address-${network}.json`);
    assert(network === "matic");
    console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
    signer = (await context.signers())[0];

    botInstance = await BotInstance__factory.connect(_addresses[network].manager.bots[0].address, signer);
    console.log(`bot address: ${chalk.blue(botInstance.address)}`);

    let config: BotConfig = await botInstance.getConfig();
    console.log(strConfig(config));

    let posintion: Position = await botInstance.getPosition();
    try {
        console.log(strPosition(posintion));
    } catch (err) {
        console.log(err);
    }
    theLoop(1000);
    // theLoop(1);
}

let lastBalance: BigNumber = BigNumber.from(0);
let theLoop: (i: number) => void = (i: number) => {
    setTimeout(async () => {

        try {
            console.log("in the loop");
            console.log(new Date().toTimeString());

            let wakeMe = await botInstance.wakeMe();
            console.log("wake me: " + wakeMe);

            if (wakeMe) {
                console.log(chalk.bgBlue(`========== calling bot loop =================`));

                let tx = await botInstance.botLoop();
                console.log(chalk.bgBlue(`===========================`));
                // console.log(am);
                await tx.wait().then(tx => console.log("gas used:          " + tx.gasUsed.toString()));
                console.log(chalk.bgBlue(`===========================`));
            }

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
