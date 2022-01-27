import chalk from "chalk";
import { context } from "../utils/context";
import { SoliDroidManager, SoliDroidManager__factory } from "../typechain";
import { Signer } from "@ethersproject/abstract-signer";
import { utils, BigNumber } from "ethers";

export async function addBotInstance(signerIndex: number) {

        const network = "avax";
        console.log(`------- using network ${network} ---------`);

        const _addresses = require('../utils/solidroid-address-avax.json');
        let managerAddress = _addresses[network].manager.address;
        let signer = (await context.signers())[signerIndex];
        let manager = await SoliDroidManager__factory.connect(managerAddress, signer);

        console.log("adding bot instance to manager: " + manager.address);

        await createBot(signer, network, manager, _addresses);
        let botAddress = _addresses[network].manager.bots[signerIndex].address;
        console.log(`------- signer ${signerIndex} bot created ${chalk.greenBright(botAddress)} ---------`);
}

async function createBot(signer: Signer, network: string, manager: SoliDroidManager, _addresses: any) {

        let defaults = _addresses[network].bot_config;
        console.log(defaults);

        let _wavax = _addresses[network].tokens[0].address;
        console.log(_wavax);

        let _strategy = _addresses[network].signal_strategy;
        console.log(_strategy);

        let tx = await manager.createBot(
                _wavax,
                _strategy,
                utils.parseEther(defaults.amount),
                BigNumber.from(defaults.percent),
                true);

        await tx.wait().then(tx => console.log("gas used:          " + tx.gasUsed.toString()));

        let botAddress = await manager.getBot();

        console.log(`bot instance created `, chalk.blue(botAddress));
        _addresses[network].manager.bots.push({ "owner": _addresses[network].owner, "address": botAddress });
        //======================= write values==========================
        write_solidroid_address(_addresses)
}

function write_solidroid_address(_addresses: any) {
        const fs = require('fs');
        let data = JSON.stringify(_addresses, null, 2);
        fs.writeFile('./utils/solidroid-address-avax.json', data, (err: any) => {
                if (err) throw err;
        });
}

addBotInstance(0).catch((error) => {
        console.error(error);
        process.exitCode = 1;
});