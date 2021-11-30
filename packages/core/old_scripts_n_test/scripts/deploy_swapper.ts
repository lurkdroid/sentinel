import { run, ethers } from "hardhat";
import { Swapper } from "../typechain/Swapper";

export async function deploySwapper(): Promise<any> {
    await run("compile");
    const Swapper = await ethers.getContractFactory("Swapper");
    return await Swapper.deploy();
}
