import chalk from "chalk";
import { context } from "../test/context";
import { deployManager } from "../scripts/deploy-for-test";
import { strPosition } from "../test/Position";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import hardhat from "hardhat"
import { Token } from "./Tokne";
import { threadId } from "worker_threads";

export async function setupManager() {

        const network = "matic";
        console.log(`------- using network ${network} ---------`);
   
        const _addresses = require('../utils/solidroid-address-matic.json');
        if(_addresses[network].manager.address){
                throw Error("manager alreay deployed");
        }
        const manager = await deployManager(_addresses, network);
        console.log("------- manager created ---------");
        //======================= write values==========================
        write_solidroid_address(_addresses)
}

function write_solidroid_address(_addresses: any) {
        const fs = require('fs');
        let data = JSON.stringify(_addresses, null, 2);
        fs.writeFile('./utils/solidroid-address-matic.json', data, (err: any) => {
                if (err) throw err;
        });
}

setupManager().catch((error) => {
        console.error(error);
        process.exitCode = 1;
});
