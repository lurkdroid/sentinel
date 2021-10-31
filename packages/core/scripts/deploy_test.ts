import { ethers } from "hardhat";
import { contracts as deployContracts } from "./contracts";
import chalk from "chalk";
async function main() {
  await deployContracts()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
console.log(chalk.blue('-'.repeat(10), 'STARTING DEPLOYMENT'), chalk.blue('-'.repeat(10)));
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
