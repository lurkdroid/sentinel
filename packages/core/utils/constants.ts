import { ethers } from "ethers";

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
    link: "0xb0897686c545045afc77cf20ec7a532e3120e0f1",
    up_Keep_registry: "0x4Cb093f226983713164A62138C3F718A5b595F73",
    uniswap_v2_router: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
  },
  harmony: {
    link: "0x218532a12a389a4a92fc0c5fb22901d1c19198aa", // found in viperswap charts
    manager: {
      address: "0x4135bf0102C02050D21f9348102699E50adcc80D",
      owner: "",
      waker: "",
    },
    up_Keep_registry: ethers.utils.getAddress(
      "0x4Cb093f226983713164A62138C3F718A5b595F73"
    ), //no upkeep in harmony, random address
    uniswap_v2_router: ethers.utils.getAddress(
      "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506"
    ),
  },
  avax: {
    link: "0x5947BB275c521040051D82396192181b413227A3",
    manager: {
      address: "",
      owner: "",
      waker: "",
    },
  },
  bsc: {
    link: "0x404460c6a5ede2d891e8297795264fde62adbb75",
    manager: {
      address: "",
      owner: "",
      waker: "",
    },
    up_Keep_registry: ethers.utils.getAddress(
      "0x5947BB275c521040051D82396192181b413227A3"
    ), //no upkeep in bsc, random address
    uniswap_v2_router: ethers.utils.getAddress(
      "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac"
    ), //sushiswap
  },
  localhost: {
    //ganache-cli
    link: ethers.utils.getAddress("0xa36085F69e2889c224210F603D836748e7dC0088"),
    up_Keep_registry: ethers.utils.getAddress(
      "0x4Cb093f226983713164A62138C3F718A5b595F73"
    ),
    manager: {
      address: "",
      owner: "",
      waker: "",
    },
  },
} as const;
