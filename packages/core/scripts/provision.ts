import { ethers } from "hardhat"
import { contracts as deployContracts } from "./contracts";
import { BotInstance } from "../typechain/BotInstance";
import { BotInstance__factory } from '../typechain/factories/BotInstance__factory';
import { SoliDroidManager__factory } from '../typechain/factories/SoliDroidManager__factory';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC20 } from '../typechain/ERC20';
import { ERC20__factory } from '../typechain/factories/ERC20__factory';
import chalk from "chalk";
import { Transaction } from "@ethersproject/transactions";
import { supportedNetworks, meta } from "../utils/constants";
import { getExistingContracts, } from "../utils";
let owner: SignerWithAddress;

let existingContracts = true;
export const provisionBot = async (n?: any) => {
    [owner] = await ethers.getSigners();
    const network = await (n ? n : ethers.provider.getNetwork())
    console.log({ network })
    const contracts = await (existingContracts ? getExistingContracts(network.name) : deployContracts(network));
    const manager = await new SoliDroidManager__factory(
        contracts.libraries.libraryAddresses,
        owner)
        .attach(
            contracts.managerAbi.address
        );
    console.log("manager: ", manager.address)

    const token0Address = meta[network.name as "harmony"].viper;
    const token1Address = meta[network.name as "harmony"].busd;

    const tx_creationPair = await manager.addSupportedPair(token0Address, token1Address);
    console.log("added supported pair", { tx_creationPair })
    await tx_creationPair.wait();
    console.log({ tx_creationPair })

    const defaultAmount = ethers.utils.parseUnits("3", 6);
    const stopLossValue = "150"; //ethers.utils.parseUnits("0.15", 3); // -> 150

    const tx = await manager.updateBot(token0Address, defaultAmount, stopLossValue, true);
    await tx.wait();
    console.log({ tx });

    const botAddress = await manager.getBot();
    console.log({ botAddress })
    console.log({ managerAddress: manager.address })

    try {
        const tx = await manager.onSignal(token0Address, token1Address, { gasPrice: 100000000000, gasLimit: 350000 });
        console.log({ tx, token0Address, token1Address });
        await tx.wait();
        console.log({ tx, token0Address, token1Address });
    } catch (e) {
        console.log({ e })
    }


    // const bot = await BotInstance__factory.connect(botAddress, owner);

    // const tx = await bot.withdraw(token0Address, { gasPrice: 100000000000 })
    // await tx.wait();

    console.log({ tx });
};
