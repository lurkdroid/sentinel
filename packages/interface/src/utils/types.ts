export interface IChainData {
    name: string
    short_name: string
    chain: string
    network: string
    chain_id: number
    network_id: number
    rpc_url: string
    native_currency: IAssetData
}

export interface IAssetData {
    symbol: string
    name: string
    decimals: string
    contractAddress: string
    balance?: string
}


export interface DroidContract {
    stopLoss: number // 10000 > x > 0
    ethAmount: number // max amount to spend
}

export interface DroidInformation extends DroidContract {
    // name: string

    tokens: string[] // address
    symbol: string
    balance: string // in order to pay gas
}

export interface DroidProps extends DroidInformation {
    isDark?: boolean
    created: number
    trades: number
}
