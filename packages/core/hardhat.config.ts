import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

import * as dotenv from 'dotenv';
import { HardhatUserConfig, task } from 'hardhat/config';

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
      { version: "0.6.0" },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://speedy-nodes-nyc.moralis.io/a1e08396f052b6c77fc3b53e/polygon/mainnet",
      },
      // "accounts": {
      //   "mnemonic": process.env.MNEMONIC_LOCAL
      // }
    },
    // kovan: {
    //   url: process.env.KOVAN_URL || "",
    //   accounts: {
    //     mnemonic: process.env.MNEMONIC_KOVAN,
    //   },
    // },
    // matic: {
    //   url: "https://speedy-nodes-nyc.moralis.io/a1e08396f052b6c77fc3b53e/polygon/mainnet",
    //   chainId: 137,
    //   gas: 65000000,
    //   gasPrice: 45000000000, //current price on polygon is 30000000000
    //   accounts: [
    //     "0x81b515886faca2d3ec90a09d8d130ce0df0dd7d6b775af3ba6c027d52773714e",
    //   ],
    //   gasMultiplier: 10,
    //   blockGasLimit: 65000000,
    // },
    hmy: {
      url: "https://rpc.s1.t.hmny.io",
      chainId: 1,
      gas: 65000000,
      gasPrice: 45000000000, // current price on polygon is 30000000000
      accounts: [
        "0x81b515886faca2d3ec90a09d8d130ce0df0dd7d6b775af3ba6c027d52773714e",
      ],
      gasMultiplier: 10,
      blockGasLimit: 65000000,
    },
    bsc:{
      url: "https://rpc.s1.t.hmny.io",
      chainId: 1,
      gas: 65000000,
      gasPrice: 45000000000, // current price on polygon is 30000000000
      accounts: [
        "0x81b515886faca2d3ec90a09d8d130ce0df0dd7d6b775af3ba6c027d52773714e",
      ],
      gasMultiplier: 10,
      blockGasLimit: 65000000, 
    }
    // ganache-cli --unhandled-rejections=warn-with-error-code -f  https://speedy-nodes-nyc.moralis.io/a1e08396f052b6c77fc3b53e/polygon/mainnet --account="0x81b515886faca2d3ec90a09d8d130ce0df0dd7d6b775af3ba6c027d52773714e","1000000000000000000000"

    local: {
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic: process.env.MNEMONIC_LOCAL,
      },
    },
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
