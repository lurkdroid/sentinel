import { ethers } from "hardhat";


export const meta = {
    kovan: {
        link: ethers.utils.getAddress("0xa36085F69e2889c224210F603D836748e7dC0088"),
        upKeepRegistry: ethers.utils.getAddress(
            '0x4Cb093f226983713164A62138C3F718A5b595F73'
        )
    },
    localhost: { //ganache-cli
        link: ethers.utils.getAddress("0xa36085F69e2889c224210F603D836748e7dC0088"),
        upKeepRegistry: ethers.utils.getAddress(
            '0x4Cb093f226983713164A62138C3F718A5b595F73'
        ),
    },
    matic: {
        // not real matic address
        link: ethers.utils.getAddress("0xa36085F69e2889c224210F603D836748e7dC0088"),
        upKeepRegistry: ethers.utils.getAddress(
            '0x4Cb093f226983713164A62138C3F718A5b595F73'
        ),
    },
    harmony: {
        upKeepRegistry: ethers.utils.getAddress(
            '0x4Cb093f226983713164A62138C3F718A5b595F73'
        ),
        viper: ethers.utils.getAddress("0xea589e93ff18b1a1f1e9bac7ef3e86ab62addc79"),
        wone: ethers.utils.getAddress("0xcf664087a5bb0237a0bad6742852ec6c8d69a27a"),
        link: ethers.utils.getAddress("0x218532a12a389a4a92fc0c5fb22901d1c19198aa"),
        busd: ethers.utils.getAddress("0x0ab43550a6915f9f67d0c454c2e90385e6497eaa"),
        busdviper: ethers.utils.getAddress("0x8dc5549e4c7b71652664468f7086ccae0171f31d")
    }
} as const;

export const supportedNetworks = Object.keys(meta);
