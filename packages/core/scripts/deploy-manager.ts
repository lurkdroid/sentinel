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
  console.log("owner: " + owner.address);

  _addresses[network].owner = owner.address;

  const botInstanceLib = await new BotInstanceLib__factory(owner).deploy();
  await botInstanceLib.deployTransaction.wait();
  console.log("deployed bot instance lib");

  const libraryAddresses: SoliDroidManagerLibraryAddresses = {
    "contracts/libraries/BotInstanceLib.sol:BotInstanceLib": botInstanceLib.address,
  };

  const priceFeed = await new PriceFeed__factory(owner).deploy();
  await priceFeed.deployTransaction.wait();
  console.log("deployed price feed lib");

  console.log("owner is:", owner.address);
  console.log(chalk.blue(`library bot address: ${botInstanceLib.address}`));

  console.log(`network: ${chalk.blue(network)}`);
  console.log("meta addresses: ", _addresses[network]);

  const uniswapV2Router = _addresses[network].uniswap_v2_router;
  const uniswapV2Factory = _addresses[network].uniswap_V2_Factory;
  const upKeepRegistryAddress = _addresses[network].up_Keep_registry;
  const linkAddress = _addresses[network].link;
  console.log("before manager deploy");

  const manager = await new SoliDroidManager__factory(
    libraryAddresses,
    owner
  ).deploy(
    upKeepRegistryAddress,
    linkAddress,
    uniswapV2Router,
    uniswapV2Factory,
    priceFeed.address
  );

  await manager.deployTransaction.wait();
  console.log("after manager deploy");

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
