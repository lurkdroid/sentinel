import chalk from 'chalk';
import fs from 'fs';
import { ethers } from 'hardhat';
import path from 'path';

import { SoliDroidManager } from '../typechain';
import { BotInstanceLib__factory } from '../typechain/factories/BotInstanceLib__factory';
import { DroidWaker__factory } from '../typechain/factories/DroidWaker__factory';
import { PriceFeed__factory } from '../typechain/factories/PriceFeed__factory';
import {
  SoliDroidManager__factory,
  SoliDroidManagerLibraryAddresses,
} from '../typechain/factories/SoliDroidManager__factory';

export async function deployManager(
  _addresses: any,
  network: string
): Promise<SoliDroidManager> {
  console.log("deployManager at " + network);

  const [owner] = await ethers.getSigners();
  _addresses[network].owner = owner.address;

  const PositionLib = await ethers.getContractFactory("PositionLib");
  const positionLib = await PositionLib.deploy();
  await positionLib.deployed();
  const botInstanceLib = await new BotInstanceLib__factory(owner).deploy();

  const priceFeed = await new PriceFeed__factory(owner).deploy();

  const libraryAddresses: SoliDroidManagerLibraryAddresses = {
    "contracts/BotInstanceLib.sol:BotInstanceLib": botInstanceLib.address,
    "contracts/PositionLib.sol:PositionLib": positionLib.address,
  };

  console.log("owner is:", owner.address);
  console.log(chalk.blue(`library position address: ${positionLib.address}`));
  console.log(chalk.blue(`library bot address: ${botInstanceLib.address}`));

  console.log(`network: ${chalk.blue(network)}`);
  const uniswapV2Router = _addresses[network].uniswap_v2_router;
  const upKeepRegistryAddress = _addresses[network].up_Keep_registry;
  const linkAddress = _addresses[network].link;

  const manager = await new SoliDroidManager__factory(
    libraryAddresses,
    owner
  ).deploy(
    upKeepRegistryAddress,
    linkAddress,
    uniswapV2Router,
    priceFeed.address
  );
  _addresses[network].manager.address = manager.address;
  _addresses[network].manager.owner = owner.address;
  const droidWakerAddress = await manager.getWaker();
  _addresses[network].manager.waker = droidWakerAddress;

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

  const priceFeeName = PriceFeed__factory.name;
  const priceFeedAbi = {
    address: priceFeed.address,
    abi: PriceFeed__factory.abi,
    bytecode: PriceFeed__factory.bytecode,
  };
  fs.writeFileSync(
    path.resolve(deployedPath, priceFeeName + ".json"),
    JSON.stringify(priceFeedAbi)
  );
  console.log(
    "📰",
    `contract ${priceFeeName} ${network} address: `,
    chalk.blue(priceFeedAbi.address)
  );
  console.log("-".repeat(30));

  return manager;
}
