import { ethers } from "hardhat";

export async function deploySignalStrategy() {
    const SignalStrategy = await ethers.getContractFactory("SignalStrategy");
    const signalStrategy = await SignalStrategy.deploy();
    console.log("deployed signal strategy " + signalStrategy.address);
    return signalStrategy.address;
}
