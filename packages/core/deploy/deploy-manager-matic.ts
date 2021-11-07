import chalk from "chalk";
import { context } from "../test/context";
import { deployManager } from "../scripts/deploy-for-test";
import { strPosition } from "../test/Position";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import hardhat from "hardhat"
import { Token } from "./Tokne";

export async function setupManager() {

        const network = "matic";
        console.log(`------- using network ${network} ---------`);
   
        const _addresses = require('../utils/solidroid-address-matic.json');
        // const manager = await deployManager(_addresses, network);
        console.log("------- manager created ---------");

        //add supported pairs
        console.log("------- supported pairs added ---------");

        let myMap: Map<string, Token> = new Map<string, Token>();
        myMap.set("key1", new Token("BTC","zxcvb",true))
        myMap.set("key2", new Token("ETH","jjjjj",true))
        myMap.set("key2", new Token("USDC","mnbvc",true))

        
        let jsonString = JSON.stringify(Array.from(myMap.entries()));
        console.log(jsonString);

        let restoredMap: Map<string, Token> = new Map(JSON.parse(jsonString));
        console.log(restoredMap.get("key2"));
        // let token0Addr = _addresses[network].tokens[0].address;
        // let token1Addr = _addresses[network].tokens[1].address;
        // await manager.addSupportedPair(token0Addr, token1Addr);

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
