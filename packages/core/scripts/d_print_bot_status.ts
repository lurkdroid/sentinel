import { BotInstance__factory, BotInstance } from "../typechain";
import { context } from "../utils/context";
import chalk from "chalk";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { BotConfig, strConfig } from "../utils/BotConfig";
import { Position, strPosition, _strPosition } from "../utils/Position";

let botInstance:BotInstance;
let signer: Signer;
let botAddress:string;
async function main() {

    botAddress = process.env.bot_address||"missing";
    if(botAddress=="missing") throw Error(chalk.redBright("bot address missing"));
    const network = "matic";
    console.log(`------- using network ${network} ---------`);
    console.log(`------- bot address ${botAddress} ---------`);

    signer = (await context.signers())[0];
    botInstance = await BotInstance__factory.connect(botAddress, signer);

    console.log(`bot address: ${chalk.blue(botInstance.address)}`);

    let config: BotConfig = await botInstance.getConfig();
    console.log(strConfig(config));

    let posintion: Position = await botInstance.getPosition();
    try{
        console.log(strPosition(posintion));
    }catch(err){
        console.log(err);
    }

    console.log(new Date().toTimeString());
    console.log(chalk.bgBlue(`========== will enter print bot status in 1000ms =================`));

    theLoop(1000);
}

let lastBalance: BigNumber = BigNumber.from(0);
let theLoop: (i: number) => void = (i: number) => {
    setTimeout(async () => {

        try {
            console.log("in the loop");
            console.log(`bot address: ${chalk.blue(botInstance.address)}`);
            console.log(new Date().toTimeString());
    
            let result: any[] = await botInstance.getPositionAndAmountOut();
            console.log(_strPosition(result[0], result[1]));

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