import { ethers } from 'ethers';

export const meta = {
    kovan: {
        link: ethers.utils.getAddress("0xa36085F69e2889c224210F603D836748e7dC0088"),
        up_Keep_registry: ethers.utils.getAddress(
            '0x4Cb093f226983713164A62138C3F718A5b595F73'
        ),
        uniswap_v2_router: ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"),
        manager: {
            address: "",
            owner: "",
            waker: ""
        }

    },
    localhost: { //ganache-cli
        link: ethers.utils.getAddress("0xa36085F69e2889c224210F603D836748e7dC0088"),
        upKeepRegistry: ethers.utils.getAddress(
            '0x4Cb093f226983713164A62138C3F718A5b595F73'
        ),
        uniswap_v2_router: "",
        manager: {}
    },
} as const;