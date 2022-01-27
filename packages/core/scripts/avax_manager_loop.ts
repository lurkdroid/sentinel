import { SoliDroidManager, SoliDroidManager__factory } from "../typechain";
import { context } from "../utils/context";
import chalk from "chalk";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";


let manager: SoliDroidManager;
let signer: Signer;

async function main() {

    let network: string;
    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);

    const _addresses = require(`../utils/solidroid-address-${network}.json`);
    let managerAddress = _addresses[network].manager.address;
    signer = (await context.signers())[0];
    manager = await SoliDroidManager__factory.connect(managerAddress, signer);

    // let wake = manager.wakeBots();
    // console.log(wake);

    console.log(new Date().toTimeString());
    console.log(chalk.bgBlue(`========== will enter manager loop in 1000ms =================`));

    theLoop(1000);
}
let lastBalance: BigNumber = BigNumber.from(0);
let theLoop: (i: number) => void = (i: number) => {
    setTimeout(async () => {

        try {
            console.log("in the loop");
            console.log(`manager address is ${manager.address}`);
            console.log(new Date().toTimeString());

            let bot = await manager.getBot();
            console.log(`bot address is ${bot}`);

            console.log(chalk.magentaBright(`manager before wakeBots`));
            // let wake = manager.wakeBots();
            // // wake.then(console.log);

            let wake = await manager.wakeBots();
            console.log(`manager.wakeBots is ${wake}`);

            if (wake) {
                console.log(chalk.bgBlue(`========== calling manager preform =================`));

                let tx = await manager.perform(
                    { gasLimit: 555581 }
                );
                await tx.wait().then(tx => console.log("gas used:          " + tx.gasUsed.toString()));
            }

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
