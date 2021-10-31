import { ethers } from "hardhat";
import { contracts as deployContracts } from "./contracts";
async function main() {
  deployContracts()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
