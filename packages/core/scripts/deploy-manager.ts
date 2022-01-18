import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chalk from 'chalk';
import fs from 'fs';
import { ethers } from 'hardhat';
import path from 'path';
import { SoliDroidManager } from '../typechain';
import { DroidWaker__factory } from '../typechain/factories/DroidWaker__factory';
import { PriceFeed__factory } from '../typechain/factories/PriceFeed__factory';
import {
  SoliDroidManager__factory,
} from '../typechain/factories/SoliDroidManager__factory';
import { context } from '../utils/context';

export async function deployManager(
  _addresses: any,
  network: string
): Promise<SoliDroidManager> {

  console.log("deployManager.  network: " + network);

  const signers: SignerWithAddress[] = await context.signers();
  const signerAddress = await signers[0].getAddress();
  console.log(`------- using signer ${signerAddress} ---------`);
  _addresses[network].owner = signerAddress;

  const BotInstanceLib = await ethers.getContractFactory("BotInstanceLib");
  const botInstanceLib = await BotInstanceLib.deploy();
  await botInstanceLib.deployed();
  console.log(`------- library bot instance address: ${botInstanceLib.address}`);

  const PriceFeed = await ethers.getContractFactory("PriceFeed");
  const priceFeed = await PriceFeed.deploy();
  console.log("------- deployed price feed " + priceFeed.address);

  // console.log(`------- network: ${chalk.blue(network)}`);
  // console.log("------- meta addresses: ", _addresses[network]);

  const uniswapV2Router = _addresses[network].uniswap_v2_router;
  const uniswapV2Factory = _addresses[network].uniswap_v2_factory;
  const upKeepRegistryAddress = _addresses[network].up_Keep_registry;
  const linkAddress = _addresses[network].link;
  console.log("before manager deploy");

  const soliDroidManagerFactory = await ethers.getContractFactory("SoliDroidManager"
    , {
      libraries: {
        BotInstanceLib: botInstanceLib.address
      },
    }
  );

  console.log(upKeepRegistryAddress);

  const manager = await soliDroidManagerFactory.deploy(
    upKeepRegistryAddress,
    linkAddress,
    uniswapV2Router,
    uniswapV2Factory,
    priceFeed.address
  );

  // console.log("after manager deploy");

  // _addresses[network].manager.address = manager.address;
  // _addresses[network].manager.owner = signerAddress;
  // const droidWakerAddress = await manager.getWaker();
  // _addresses[network].manager.waker = droidWakerAddress;

  // const deployedPath = path.resolve(__dirname, `../deployed/${network}`);
  // if (!fs.existsSync(deployedPath)) {
  //   fs.mkdirSync(deployedPath, { recursive: true });
  // }

  // console.log("-".repeat(30));
  // const managerName = SoliDroidManager__factory.name;

  // const managerAbi = {
  //   address: manager.address,
  //   abi: SoliDroidManager__factory.abi,
  //   bytecode: SoliDroidManager__factory.bytecode,
  // };

  // fs.writeFileSync(
  //   path.resolve(deployedPath, managerName + ".json"),
  //   JSON.stringify(managerAbi)
  // );

  // console.log(
  //   "📰",
  //   `contract ${managerName} ${network} address: `,
  //   chalk.blue(manager.address)
  // );

  // console.log("-".repeat(30));

  // const droidWakerName = DroidWaker__factory.name;
  // const droidWakerAbi = {
  //   address: droidWakerAddress,
  //   abi: DroidWaker__factory.abi,
  //   bytecode: DroidWaker__factory.bytecode,
  // };

  // fs.writeFileSync(
  //   path.resolve(deployedPath, droidWakerName + ".json"),
  //   JSON.stringify(droidWakerAbi)
  // );

  // console.log(
  //   "📰",
  //   `contract ${droidWakerName} ${network} address: `,
  //   chalk.blue(droidWakerAddress)
  // );

  // const priceFeeName = PriceFeed__factory.name;
  // const priceFeedAbi = {
  //   address: priceFeed.address,
  //   abi: PriceFeed__factory.abi,
  //   bytecode: PriceFeed__factory.bytecode,
  // };

  // fs.writeFileSync(
  //   path.resolve(deployedPath, priceFeeName + ".json"),
  //   JSON.stringify(priceFeedAbi)
  // );

  // console.log(
  //   "📰",
  //   `contract ${priceFeeName} ${network} address: `,
  //   chalk.blue(priceFeedAbi.address)
  // );

  // console.log("-".repeat(30));

  return manager;
}
