import chalk from "chalk";
import { context } from "../test/context";
import { deployManager } from "../scripts/deploy-for-test";
import { BotInstance__factory, MockERC20__factory, SoliDroidManager, SoliDroidManager__factory } from "../typechain";
import { strPosition } from "../test/Position";
import { printPosition, setupBot } from "./create-setup-bot";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { setupSigner } from "./setup-signers";
// import { ethers } from "ethers";
import hardhat from "hardhat"


export async function setupManager() {

        let envNetwork = process.env.network;
        if(!envNetwork) throw Error('network not defined');
        
        context.setNetwork("fork_matic"/*envNetwork*/);
        const network = await context.netwrok();
        console.log(`------- using network ${network} ---------`);
   
        const _addresses = require('../utils/solidroid-address.json');
        const manager = await deployManager(_addresses, network);
        const signers:SignerWithAddress[] = await context.signers();
        console.log("------- manager created ---------");

        //add supported pairs
        let token0Addr = _addresses[network].tokens[0].address;
        let token1Addr = _addresses[network].tokens[1].address;
        await manager.addSupportedPair(token0Addr, token1Addr);
        console.log("------- supported pairs added ---------");

        //craete bots
        _addresses[network].manager.bots = [];

        //========= craete bot for address 0
        for (let signerIndex = 0; signerIndex < 2; signerIndex++) {
            await setupSigner(signerIndex)
            await setupBot( signerIndex);
        }
        //======== end craete bot for address 0
        console.log(chalk.magentaBright(`manager before signal`));
        
        let tx = await manager.onSignal([token0Addr, token1Addr],{ gasLimit:995581});
        await tx.wait().then(tx => console.log(chalk.redBright("gas used: " + tx.gasUsed.toString())));

        for (let signerIndex = 0; signerIndex < 2; signerIndex++) {
                await printPosition(signerIndex);
        }

        console.log(chalk.magentaBright(`manager before wakeBots`));
        let wake = await manager.wakeBots();
        console.log(chalk.magentaBright(`manager after wakeBots ${wake}`));
        await manager.perform();
        let performTx = await manager.perform({ gasLimit:995581});
        await performTx.wait().then(tx => console.log(chalk.redBright("gas used: " + tx.gasUsed.toString())));
        
        //======================= write values==========================
        write_solidroid_address(_addresses)
}

function write_solidroid_address(_addresses: any) {
        const fs = require('fs');
        let data = JSON.stringify(_addresses, null, 2);
        fs.writeFile('./utils/solidroid-address.json', data, (err: any) => {
                if (err) throw err;
        });
}

setupManager().catch((error) => {
        console.error(error);
        process.exitCode = 1;
});

// function delay(ms: number) {
//         return new Promise( resolve => setTimeout(resolve, ms) );
//     }