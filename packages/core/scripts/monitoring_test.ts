import { ethers } from "hardhat"
import { contracts as deployContracts } from "./contracts";
import type { BotInstance } from "../typechain/BotInstance";
import { BotInstance__factory } from '../typechain/factories/BotInstance__factory';
import { SoliDroidManager__factory } from '../typechain/factories/SoliDroidManager__factory';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC20 } from '../typechain/ERC20';
import { ERC20__factory } from '../typechain/factories/ERC20__factory';
import chalk from "chalk";
import { Transaction } from "@ethersproject/transactions";
import { supportedNetworks } from "../utils/constants"
import { Position, strPosition } from '../test/Position';
import { getExistingContracts } from "../utils";

let owner: SignerWithAddress;
let token0: ERC20;
let token1: ERC20;


type ContractsNeeded = ReturnType<typeof deployContracts>;
const token0Address = "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063"; //DAI
const token1Address = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"; // WMATIC
const existingContracts = true;

const monitoringProvider = async () => {

    [owner] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    const contracts = await (existingContracts ? getExistingContracts(network.name) : deployContracts());

    const manager = await new SoliDroidManager__factory(
        contracts.libraries.libraryAddresses,
        owner)
        .attach(
            contracts.managerAbi.address
        );
    const botAddress = await manager.getBot();
    if (botAddress === "0x0000000000000000000000000000000000000000") {
        throw Error('No bot instance found')
    }
    // const bot = new BotInstance(botAddress, BotInstance__factory.abi, owner);
    const bot = await BotInstance__factory.connect(botAddress, owner);

    setInterval(async () => {
        try {
            // how is the bot going to trade without the token1?
            const position: Position = await bot.getPosition();
            if (await bot.wakeMe()) {
                const tx = await bot.botLoop();
                await tx.wait()
                logDetails(tx)
            }
            console.log('-'.repeat(23), "LOGGING POSITION")
            console.log(strPosition(position))
        } catch (e) {
            console.log("error while waking and looping bot", e)
        }
    }, 1000 * 60);

    async function logDetails(tx: Transaction) {
        console.log("-".repeat(23))
        console.log({ tx });
        const balance = await owner.getBalance();
        const botBalance = await ethers.provider.getBalance(bot.address);
        console.log("-".repeat(12));
        console.log("owner balance", balance.toNumber());
        console.log("botBalance", botBalance.toNumber());
        console.log("-".repeat(12));
        const tokenBalance0 = await token0.balanceOf(bot.address);
        const tokenBalance1 = await token1.balanceOf(bot.address);
        console.log("bot balance token0:", tokenBalance0.toNumber());
        console.log("bot balance token1", tokenBalance1.toNumber());
        console.log("-".repeat(12));
    }



}


monitoringProvider().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});