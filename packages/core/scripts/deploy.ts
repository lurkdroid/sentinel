import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { Greeter } from '../typechain/Greeter';
import { Greeter__factory } from '../typechain/factories/Greeter__factory';

async function main() {
  const [owner] = await ethers.getSigners();
  const greeter: Greeter = await new Greeter__factory(owner).deploy("Hello, Hardhat!");

  console.log("Greeter deployed to:", greeter.address);
  const network = await ethers.provider.getNetwork();
  console.log(network)

  const deployedPath = path.resolve(__dirname, `../deployed/${network.name}`);
  if (!fs.existsSync(deployedPath)) {
    fs.mkdirSync(deployedPath, { recursive: true });
  }
  const name = 'greeter';
  const abi = { address: greeter.address, abi: Greeter__factory.abi, bytecode: Greeter__factory.bytecode }
  fs.writeFileSync(path.resolve(deployedPath, name + '.json'), JSON.stringify(abi));
  console.log('📰', `contract ${name} ${network.name} address: `, chalk.blue(greeter.address));


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
