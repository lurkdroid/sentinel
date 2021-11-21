import chalk from 'chalk';
import fs from 'fs';
import { ethers } from 'hardhat';
import path from 'path';

import { BotInstanceLib__factory } from '../typechain/factories/BotInstanceLib__factory';
import { DroidWaker__factory } from '../typechain/factories/DroidWaker__factory';
import {
  SoliDroidManager__factory,
  SoliDroidManagerLibraryAddresses,
} from '../typechain/factories/SoliDroidManager__factory';
import { meta } from '../utils/constants';
import { context } from '../utils/context';
import { testData } from '../utils/test-data';

async function main() {
  // const network = await ethers.provider.getNetwork();
  const network = await context.netwrok(); //need to get this way for hradhat/ganache cli issue
  console.log({ network });
  const networkName = network as "kovan";
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
    "contracts/PositionLib.sol:PositionLib": positionLib.address,
  };

  console.log("owner is:", owner.address);
  console.log(chalk.blue(`library position address: ${positionLib.address}`));
  console.log(chalk.blue(`library bot address: ${botInstanceLib.address}`));

  let uniswapV2Router = testData[network].uniswapV2Router;
  const manager = await new SoliDroidManager__factory(
    libraryAddresses,
    owner
  ).deploy(uniswapV2Router, upKeepRegistryAddress, linkAddress);
  const droidWakerAddress = await manager.getWaker();

  const deployedPath = path.resolve(__dirname, `../deployed/${network}`);
  if (!fs.existsSync(deployedPath)) {
    fs.mkdirSync(deployedPath, { recursive: true });
  }
  console.log("-".repeat(30));
  const managerName = SoliDroidManager__factory.name;
  const managerAbi = {
    address: manager.address,
    abi: SoliDroidManager__factory.abi,
    bytecode: SoliDroidManager__factory.bytecode,
  };
  fs.writeFileSync(
    path.resolve(deployedPath, managerName + ".json"),
    JSON.stringify(managerAbi)
  );
  console.log(
    "📰",
    `contract ${managerName} ${network} address: `,
    chalk.blue(manager.address)
  );
  console.log("-".repeat(30));
  const droidWakerName = DroidWaker__factory.name;
  const droidWakerAbi = {
    address: droidWakerAddress,
    abi: DroidWaker__factory.abi,
    bytecode: DroidWaker__factory.bytecode,
  };
  fs.writeFileSync(
    path.resolve(deployedPath, droidWakerName + ".json"),
    JSON.stringify(droidWakerAbi)
  );
  console.log(
    "📰",
    `contract ${droidWakerName} ${network} address: `,
    chalk.blue(droidWakerAddress)
  );
  console.log("-".repeat(30));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
