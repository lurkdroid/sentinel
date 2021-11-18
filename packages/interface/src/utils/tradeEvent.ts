export interface Trade {
    side	:string,
    token0	:string,
    token1	:string,
    amount0	:string,
    amount1	:string,
    positionTime   :string,
    tradeTime   :string
}

export interface HistoryTrade extends Trade {
    trx: string;
}

export interface PositionTrades{
    positionBlock:number,
    trades:HistoryTrade[]
}

export function tradeTradeComplete(event:TradeComplete):HistoryTrade{
    return{
        side: event.returnValues.side,
        token0: event.returnValues.token0,
        token1: event.returnValues.token1,
        amount0: event.returnValues.price,
        amount1: event.returnValues.amount,
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
    price: string;
    amount: string;
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