import { BigNumber } from "@ethersproject/bignumber";
import chalk from "chalk";
import { utils } from "ethers";
import { run } from "hardhat";
import { context } from "../test/context";
import { testData } from "../test/test-data";
import { deployManager } from "../scripts/deploy-for-test";
import { BotInstance__factory, MockERC20__factory } from "../typechain";
import { strConfig } from "../test/BotConfig";
import { strPosition } from "../test/Position";
import { trasferTokens } from "./trasfer-tokens";
import { createBot } from "./create-bot";

export async function setupManager() {
        const network = "localhost_matic"
        console.log(`------- using network ${network} ---------`);

        const _addresses = require('../utils/solidroid-address.json');
        const manager = await deployManager(_addresses, network);
        const signer0 = (await context.signers())[0];
        console.log("------- manager created ---------");

        //add supported pairs
        let token0Addr = _addresses[network].tokens[0].address;
        let token1Addr = _addresses[network].tokens[1].address;
        await manager.addSupportedPair(token0Addr, token1Addr);
        console.log("------- supported pairs added ---------");

        //craete bots
        _addresses[network].manager.bots = [];
        await createBot(signer0, network, manager, token0Addr);
        let botAddress0 = _addresses[network].manager.bots[0].address;
        console.log(`------- bot created ${botAddress0} ---------`);

        let botInstance = await BotInstance__factory.connect(botAddress0, signer0);
        console.log(strConfig(await botInstance.getConfig()));
        // console.log(strPosition(await botInstance.getPosition()));

        //trasfer to bot
        await trasferTokens(signer0, token0Addr, botAddress0)

        let supported = await manager.isPairSupported(token0Addr, token1Addr)
        console.log(supported);

        await manager.onSignal([token0Addr, token1Addr],{ gasLimit:555581});

        console.log(`------- bot position ---------`);
        console.log(strPosition(await botInstance.getPosition()));
        write_solidroid_address(_addresses)
}

setupManager().catch((error) => {
        console.error(error);
        process.exitCode = 1;
});

function write_solidroid_address(_addresses: any) {
        const fs = require('fs');
        let data = JSON.stringify(_addresses, null, 2);
        fs.writeFile('./utils/solidroid-address.json', data, (err: any) => {
                if (err) throw err;
        });
}