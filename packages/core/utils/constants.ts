import { ethers } from "hardhat";
export const meta = {
    kovan: {
        link: ethers.utils.getAddress("0xa36085F69e2889c224210F603D836748e7dC0088"),
        upKeepRegistry: ethers.utils.getAddress(
            '0x4Cb093f226983713164A62138C3F718A5b595F73'
        )
    }
} as const;