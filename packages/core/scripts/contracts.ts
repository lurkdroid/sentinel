import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import chalk from "chalk";

import { SoliDroidManager__factory, SoliDroidManagerLibraryAddresses } from '../typechain/factories/SoliDroidManager__factory';
import { BotInstanceLib__factory } from '../typechain/factories/BotInstanceLib__factory';
import { DroidWaker__factory } from '../typechain/factories/DroidWaker__factory';
import { meta } from "../utils/constants"
import type { SoliDroidManager, DroidWaker } from '../typechain';


console.log(chalk.blue('-'.repeat(10), 'STARTING DEPLOYMENT'), chalk.blue('-'.repeat(10)));
export const contracts = async () => {
  const [owner] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log({ network })
  const networkName = network.name as "matic";
  const upKeepRegistryAddress = meta[networkName].upKeepRegistry;
  const linkAddress = meta[networkName].link;
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
  const droidWakerAddress = await manager.getWaker();




  const deployedPath = path.resolve(__dirname, `../deployed/${network.name}`);
  if (!fs.existsSync(deployedPath)) {
    fs.mkdirSync(deployedPath, { recursive: true });
  }
  console.log("-".repeat(30));
  const managerName = "SoliDroidManager";
  const managerAbi = { address: manager.address, abi: SoliDroidManager__factory.abi, bytecode: SoliDroidManager__factory.bytecode };
  fs.writeFileSync(path.resolve(deployedPath, managerName + '.json'), JSON.stringify(managerAbi));
  console.log('📰', `contract ${managerName} ${network.name} address: `, chalk.blue(manager.address));
  console.log("-".repeat(30));
  const droidWakerName = "DroidWaker";
  const droidWakerAbi = { address: droidWakerAddress, abi: DroidWaker__factory.abi, bytecode: DroidWaker__factory.bytecode }
  fs.writeFileSync(path.resolve(deployedPath, droidWakerName + '.json'), JSON.stringify(droidWakerAbi));
  console.log('📰', `contract ${droidWakerName} ${network.name} address: `, chalk.blue(droidWakerAddress));
  console.log("-".repeat(30));

  fs.writeFileSync(path.resolve(deployedPath, "libraryAddresses" + '.json'), JSON.stringify(libraryAddresses));
  console.log('📰', `contract libraryAddresses BotInstanceLib ${network.name} address: `, chalk.blue(libraryAddresses["contracts/BotInstanceLib.sol:BotInstanceLib"]));
  console.log('📰', `contract libraryAddresses PositionLib ${network.name} address: `, chalk.blue(libraryAddresses["contracts/PositionLib.sol:PositionLib"]));
  console.log("-".repeat(30));

  return {
    droidWakerAbi,
    managerAbi,
    libraries: {
      libraryAddresses,
      position: positionLib,
      bot: botInstanceLib
    }
  }
}

contracts().then(console.log).catch(console.log)