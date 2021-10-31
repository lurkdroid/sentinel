import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      { version: "0.6.12" },
      { version: "0.6.0" }
    ]
  },
  networks: {
    // default: 'matic',
    hardhat: {
      "forking": {
        "url": process.env.FORKING_RINKEBY as string
      },
      "accounts": {
        "mnemonic": process.env.MNEMONIC_LOCAL
      }
    },
    kovan: {
      url: process.env.KOVAN_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC_KOVAN
      }
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    local: {
      url: "http://127.0.0.1:8545",
      "accounts": {
        "mnemonic": process.env.MNEMONIC_LOCAL
      }
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com/',
      // url: 'https://rpc-mainnet.matic.network',
      // url: 'https://polygon-rpc.com ',
      accounts: ['81b515886faca2d3ec90a09d8d130ce0df0dd7d6b775af3ba6c027d52773714e'],
      chainId: 137,
      // understand 
      gasPrice: 100000000000,
      blockGasLimit: 350000
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
