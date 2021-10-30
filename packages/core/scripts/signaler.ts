import { ethers } from "hardhat"
import { contracts as deployContracts } from "./contracts";
import { BotInstance } from "../typechain/BotInstance";
import { BotInstance__factory } from '../typechain/factories/BotInstance__factory';
import { SoliDroidManager } from '../typechain/SoliDroidManager';
import { SoliDroidManager__factory } from '../typechain/factories/SoliDroidManager__factory';

const signalProvider = async () => {


    const [owner] = await ethers.getSigners();
    const contracts = await deployContracts();

    const manager = await new SoliDroidManager__factory(
        contracts.libraries.libraryAddresses,
        owner)
        .attach(
            contracts.managerAbi.address
        );

    const token0 = "";
    const token1 = "";
    const defaultAmount = ethers.utils.parseEther("0.1");
    const stopLossValue = ethers.utils.parseUnits("10", 2);
    const tx = await manager.updateBot(token0, defaultAmount, stopLossValue, true);
    await tx.wait();
    console.log({ tx });
    const botAddress = await manager.getBot();
    if (botAddress === "0x0000000000000000000000000000000000000000") {
        throw Error('No bot instance found')
    }
    const bot = new BotInstance(botAddress, BotInstance__factory.abi, owner);

    setInterval(async () => {
        const path = await getPath();
        const tx = await bot.buySignal(path)

    }, 1000 * 60);

    async function getPath() {
        //logic to get the correct paths
        return []
    }




}


signalProvider().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});