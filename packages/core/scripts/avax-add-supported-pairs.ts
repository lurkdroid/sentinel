import { context } from "../utils/context";
import { Token } from "../utils/Tokne";
import { SoliDroidManager__factory } from "../typechain";

export async function addSupportedPairs() {

        const network = "avax";
        console.log(`------- using network ${network} ---------`);

        const _addresses = require('../utils/solidroid-address-avax.json');
        let managerAddress = _addresses[network].manager.address;
        console.log(`------- manager address ${managerAddress} ---------`);

        let signer = (await context.signers())[0];
        let manager = await SoliDroidManager__factory.connect(managerAddress, signer);

        console.log("adding pairs to manager: " + manager.address);

        let tokenArray: Array<Token> = _addresses[network].tokens;


        let isSupported = await manager.isPairSupported(tokenArray[0].address, tokenArray[3].address)
        if (isSupported) {
                console.log(`already supported pair: ${tokenArray[0].name} => ${tokenArray[3].name}`);
        } else {
                await manager.addSupportedPair(tokenArray[0].address, tokenArray[3].address);
        }

        // for (let i = 0; i < tokenArray.length; i++) {
        //         if (tokenArray[i].isQuote) {
        //                 for (let j = 0; j < tokenArray.length; j++) {
        //                         if (tokenArray[i] != tokenArray[j]) {
        //                                 let isSupported = await manager.isPairSupported(tokenArray[i].address, tokenArray[j].address)
        //                                 if (isSupported) {
        //                                         console.log(`already supported pair: ${tokenArray[i].name} => ${tokenArray[j].name}`);
        //                                         continue;
        //                                 }
        //                                 console.log(`add supported pair: ${tokenArray[i].name} => ${tokenArray[j].name}`);
        //                                 await manager.addSupportedPair(tokenArray[i].address, tokenArray[j].address)
        //                         }
        //                 }
        //         }
        // }
        //add supported pairs
        console.log("------- supported pairs added ---------");
}

addSupportedPairs().catch((error) => {
        console.error(error);
        process.exitCode = 1;
});