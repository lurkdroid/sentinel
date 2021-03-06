import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import chalk from "chalk";

import { SoliDroidManager__factory } from '../typechain/factories/SoliDroidManager__factory';

async function main() {

  const [owner] = await ethers.getSigners();
  console.log("owner is:", owner.address);
  const manager = await new SoliDroidManager__factory(owner).deploy();

  const network = await ethers.provider.getNetwork();
  console.log(network)

  const deployedPath = path.resolve(__dirname, `../deployed/${network.name}`);
  if (!fs.existsSync(deployedPath)) {
    fs.mkdirSync(deployedPath, { recursive: true });
  }
  const name = 'SoliDroidManager';
  const abi = { address: manager.address, abi: SoliDroidManager__factory.abi, bytecode: SoliDroidManager__factory.bytecode }
  fs.writeFileSync(path.resolve(deployedPath, name + '.json'), JSON.stringify(abi));
  console.log('📰', `contract ${name} ${network.name} address: `, chalk.blue(manager.address));


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
