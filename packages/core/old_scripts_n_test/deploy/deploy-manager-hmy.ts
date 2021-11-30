import { deployManager } from "./deploy-manager";

export async function setupManager() {

        const network = "hmy";
        console.log(`------- using network ${network} ---------`);

        const _addresses = require('../utils/solidroid-address-hmy.json');

        if (_addresses[network].manager.address) {
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
