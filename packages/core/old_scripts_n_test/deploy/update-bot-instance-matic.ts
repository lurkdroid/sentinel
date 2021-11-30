import chalk from "chalk";
import { context } from "../utils/context";
import { BotInstance__factory, SoliDroidManager, SoliDroidManager__factory } from "../typechain";
import { Signer } from "@ethersproject/abstract-signer";
import { utils, BigNumber } from "ethers";

export async function updateBotInstance(signerIndex:number) {

        // throw Error("don't write bot address to json correctly");
        const network = "matic";
        console.log(`------- using network ${network} ---------`);
   
        const _addresses = require('../utils/solidroid-address-matic.json');
        let managerAddress = _addresses[network].manager.address;
        let signer = (await context.signers())[signerIndex];
        let manager = await SoliDroidManager__factory.connect(managerAddress,signer);

        console.log("adding bot instance to manager: "+manager.address);

        let botAddress = _addresses[network].manager.bots[signerIndex].address;
        let botInstance = await BotInstance__factory.connect(botAddress, signer);
        console.log(`bot address: ${chalk.blue(botInstance.address)}`);

        let _dai = _addresses[network].tokens[2].address;

        await botInstance.update(_dai, utils.parseEther("5"), BigNumber.from(200), true);
        console.log(`------- signer ${signerIndex} bot updated ${chalk.greenBright(botAddress)} ---------`);
}


updateBotInstance(0).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});