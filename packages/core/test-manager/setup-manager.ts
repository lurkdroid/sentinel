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

export async function setupManager() {
        const network = "localhost_matic"

        const _addresses = require('../utils/solidroid-address.json');
        const manager = await deployManager(_addresses, network);

        //add supported pairs
        let token0Addr = _addresses[network].tokens[0].address;
        let token1Addr = _addresses[network].tokens[1].address;
        await manager.addSupportedPair(token0Addr, token1Addr);

        //craete bots
        let defaults = _addresses[network].bot_config;
        await manager.updateBot(
                token0Addr,
                utils.parseEther(defaults.amount),
                BigNumber.from(defaults.percent),
                true);

        let botAddress = await manager.getBot();
        _addresses[network].manager.bots = [];
        _addresses[network].manager.bots.push({ "owner": _addresses[network].owner, "address": botAddress });

        let signer = (await context.signers())[0];
        let botInstance = await BotInstance__factory.connect(botAddress, signer);
        console.log(strConfig(await botInstance.getConfig()));
        console.log(strPosition(await botInstance.getPosition()));

        //teransfer token to bot
        let mockERC20_0 = await MockERC20__factory.connect(token0Addr, signer);
        let token0balance = await mockERC20_0.balanceOf(await signer.getAddress());
        console.log(`account ${await mockERC20_0.symbol()} balance: ${chalk.green(token0balance)}`);

        let bot0balance = await mockERC20_0.balanceOf(await botInstance.address);
        console.log(`bot ${await mockERC20_0.symbol()} balance: ${chalk.green(bot0balance)}`);

        await mockERC20_0.approve(botInstance.address, token0balance);
        await mockERC20_0.transfer(botInstance.address, token0balance);

        token0balance = await mockERC20_0.balanceOf(await signer.getAddress());
        console.log(`account ${await mockERC20_0.symbol()} balance: ${chalk.green(token0balance)}`);
        bot0balance = await mockERC20_0.balanceOf(await botInstance.address);
        console.log(`bot ${await mockERC20_0.symbol()} balance: ${chalk.green(bot0balance)}`);


        await manager.onSignal([token0Addr, token1Addr]);
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