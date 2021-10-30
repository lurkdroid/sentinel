import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import chalk from "chalk";

import { SoliDroidManager__factory, SoliDroidManagerLibraryAddresses } from '../typechain/factories/SoliDroidManager__factory';
import { BotInstanceLib__factory } from '../typechain/factories/BotInstanceLib__factory';
import { DroidWaker__factory } from '../typechain/factories/DroidWaker__factory';
import { meta } from "../utils/constants"
import { SoliDroidManager } from "../typechain";

export async function deployManager(): Promise<SoliDroidManager> {

  const network = await ethers.provider.getNetwork();
  console.log(network)
  const networkName = "localhost";// network.name as "kovan";
  const upKeepRegistryAddress = meta[networkName].upKeepRegistry;
  const linkAddress = meta[networkName].link;
  const [owner] = await ethers.getSigners();
  // typechain is not generating the PositionLib SOMEHOW :(
  const PositionLib = await ethers.getContractFactory("PositionLib");
  const positionLib = await PositionLib.deploy();
  await positionLib.deployed();
  const botInstanceLib = await new BotInstanceLib__factory(owner).deploy();
  // const droidWaker = await new DroidWaker__factory(owner).deploy(upKeepRegistryAddress, linkAddress)

  const libraryAddresses: SoliDroidManagerLibraryAddresses = {
    "contracts/BotInstanceLib.sol:BotInstanceLib": botInstanceLib.address,
    "contracts/PositionLib.sol:PositionLib": positionLib.address
  }

  console.log("owner is:", owner.address);
  console.log(chalk.blue(`library position address: ${positionLib.address}`));
  console.log(chalk.blue(`library bot address: ${botInstanceLib.address}`));

  const manager = await new SoliDroidManager__factory(libraryAddresses, owner).deploy(upKeepRegistryAddress, linkAddress);
  const droidWakerAddress = await manager.getWaker()



  const deployedPath = path.resolve(__dirname, `../deployed/${network.name}`);
  if (!fs.existsSync(deployedPath)) {
    fs.mkdirSync(deployedPath, { recursive: true });
  }
  console.log("-".repeat(30))
  const managerName = SoliDroidManager__factory.name
  const managerAbi = { address: manager.address, abi: SoliDroidManager__factory.abi, bytecode: SoliDroidManager__factory.bytecode }
  fs.writeFileSync(path.resolve(deployedPath, managerName + '.json'), JSON.stringify(managerAbi));
  console.log('📰', `contract ${managerName} ${network.name} address: `, chalk.blue(manager.address));
  console.log("-".repeat(30))
  const droidWakerName = DroidWaker__factory.name;
  const droidWakerAbi = { address: droidWakerAddress, abi: DroidWaker__factory.abi, bytecode: DroidWaker__factory.bytecode }
  fs.writeFileSync(path.resolve(deployedPath, droidWakerName + '.json'), JSON.stringify(droidWakerAbi));
  console.log('📰', `contract ${droidWakerName} ${network.name} address: `, chalk.blue(droidWakerAddress));
  console.log("-".repeat(30))
  return manager;
}
