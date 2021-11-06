

import type { Token } from "../slices/droidForm"

export type networks = 'kovan' | 'bsc' | 'harmony' | 'matic' | 'ethereum';
export type TokenByNetwork = { [network in networks]?: Token };

enum Networks {
    kovan = 'kovan',
    bsc = 'bsc',
    harmony = 'harmony',
    matic = 'matic'
}
const link: TokenByNetwork = {
    [Networks.kovan]: {
        address: '0xa36085F69e2889c224210F603D836748e7dC0088',
        decimals: 18,
        "name": 'link',
        "symbol": 'LINK'
    },
    [Networks.matic]: {
        address: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
        "decimals": 18,
        "symbol": 'LINK',
        "name": 'link'
    },
    [Networks.harmony]: {
        address: "0x218532a12a389a4a92fc0c5fb22901d1c19198aa",
        symbol: "LINK",
        name: "Chainlink Token",
        decimals: 18
    }
} as const;
const weth: TokenByNetwork = {
    [Networks.kovan]: {
        address: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
        decimals: 18,
        "name": 'weth',
        symbol: "WETH"
    },
    [Networks.matic]: {
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        decimals: 18,
        name: 'Wrapped Ether',
        symbol: 'WETH'
    }
} as const;

const wmatic: TokenByNetwork = {
    [Networks.matic]: {
        address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        symbol: 'MATIC',
        name: 'matic',
        decimals: 18
    }
} as const;

const wone: TokenByNetwork = {
    [Networks.harmony]: {
        address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
        symbol: 'WONE',
        name: 'One (Wrapped)',
        decimals: 18
    }
} as const;
const wbtc: TokenByNetwork = {
    [Networks.harmony]: {
        name: "Wrapped BTC",
        symbol: "1WBTC",
        address: "0x3095c7557bcb296ccc6e363de01b760ba031f2d9",
        decimals: 18
    }
} as const

const usdc: TokenByNetwork = {
    [Networks.matic]: {
        name: "USD Coin (PoS)",
        symbol: "USDC",
        address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        decimals: 18
    }
} as const

export const supportedTokensByNetwork: { [network in networks]?: { [token: string]: Token } } = {
    [Networks.kovan]: {
        link: link[Networks.kovan] as Token,
        weth: weth[Networks.kovan] as Token
    },
    [Networks.matic]: {
        link: link[Networks.matic] as Token,
        wmatic: wmatic[Networks.matic] as Token,
        usdc: usdc[Networks.matic] as Token
    },
    [Networks.harmony]: {
        wone: wone[Networks.harmony] as Token,
        link: link[Networks.harmony] as Token,
        wbtc: wbtc[Networks.harmony] as Token
    }
}