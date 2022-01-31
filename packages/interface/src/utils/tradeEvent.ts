export interface Trade {
    side: string,
    token0: string,
    token1: string,
    amount0: string,
    amount1: string,
    positionTime: string,
    tradeTime: string
}

// "0": "0",
// "1": "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
// "2": "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
// "3": "200000000000000000",
// "4": "5324161894762494",
// "5": "1643244061",
// "6": "1643244061",

// "side": "0",
// "token0": "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
// "token1": "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
// "amount0": "200000000000000000",
// "amount1": "5324161894762494",
// "pTime": "1643244061",
// "tTime": "1643244061"

export interface HistoryTrade extends Trade {
    trx: string;
}

export interface PositionTrades {
    positionTime: number,
    trades: HistoryTrade[]
}

export function tradeTradeComplete(event: TradeComplete): HistoryTrade {
    return {
        side: event.returnValues.side,
        token0: event.returnValues.token0,
        token1: event.returnValues.token1,
        amount0: event.returnValues.amount0,
        amount1: event.returnValues.amount1,
        positionTime: event.returnValues.pTime,
        tradeTime: event.returnValues.tTime,
        trx: event.transactionHash
    }
}

export interface ReturnValues {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    side: string;
    token0: string;
    token1: string;
    amount0: string;
    amount1: string;
    pTime: string;
    tTime: string;
}

export interface Raw {
    data: string;
    topics: string[];
}

export interface TradeComplete {
    address: string;
    blockHash: string;
    blockNumber: number;
    logIndex: number;
    removed: boolean;
    transactionHash: string;
    transactionIndex: number;
    id: string;
    returnValues: ReturnValues;
    event: string;
    signature: string;
    raw: Raw;
}