import { ethers } from 'ethers';

export const meta = {
  kovan: {
    link: ethers.utils.getAddress("0xa36085F69e2889c224210F603D836748e7dC0088"),
    up_Keep_registry: ethers.utils.getAddress(
      "0x4Cb093f226983713164A62138C3F718A5b595F73"
    ),
    uniswap_v2_router: ethers.utils.getAddress(
      "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    ),
    manager: {
      address: "",
      owner: "",
      waker: "",
    },
  },
  matic: {
    manager: {
      address: "0xDc7045bA8142CcCAb4eC92926fa81b93781368Bc",
      owner: "0x0b8C51A4538FD92362b019C9d52354a6d832694c",
      waker: "0x2BCb05453F08c49b09B5099ca36b2aa2cDf2b995",
    },
    link: "0xa36085F69e2889c224210F603D836748e7dC0088",
    up_Keep_registry: "0x4Cb093f226983713164A62138C3F718A5b595F73",
    uniswap_v2_router: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
  },
  localhost: {
    //ganache-cli
    link: ethers.utils.getAddress("0xa36085F69e2889c224210F603D836748e7dC0088"),
    up_Keep_registry: ethers.utils.getAddress(
      "0x4Cb093f226983713164A62138C3F718A5b595F73"
    ),
  },
} as const;
