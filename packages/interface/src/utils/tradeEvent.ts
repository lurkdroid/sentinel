export interface Trade {
    side	:string,
    token0	:string,
    token1	:string,
    price	:string,
    amount	:string,
    blockNumber   :number
}
export function tradeTradeComplete(data:TradeComplete):Trade{
    return{
        side: data.returnValues.side,
        token0: data.returnValues.token0,
        token1: data.returnValues.token1,
        price: data.returnValues.price,
        amount: data.returnValues.amount,
        blockNumber: data.blockNumber
    }
}

export interface ReturnValues {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    side: string;
    token0: string;
    token1: string;
    price: string;
    amount: string;
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