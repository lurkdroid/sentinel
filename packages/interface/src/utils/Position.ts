import { BotConfig } from "./BotConfig";

export interface Position {
    path: string[];
    amount: string;
    lastAmountOut: string;
    targets: string[],
    targetsIndex: string,
    stopLoss: string;
    underStopLoss: boolean;
    stopLossAmount: string;
    initialAmountIn: string;
}

export interface PositionAndAmountOut {
    position: Position;
    lastAmount: string;
}

export function calcPosition(_position: Position, _config: BotConfig): Position {
    if (_config != undefined && _config.quoteAsset != undefined) {
        _position.path[0] = _config.quoteAsset;
    }
    return _position;
}


export function positionFromArray(data: Array<any>): Position {
    return {
        path: data[0],
        amount: data[1],
        initialAmountIn: data[2],
        lastAmountOut: data[3],
        targets: data[4],
        targetsIndex: data[5],
        stopLoss: data[6],
        underStopLoss: data[7],
        stopLossAmount: data[8],
    }
}

// [
//     [
//       string,
//       BigNumber,
//       BigNumber,
//       number,
//       BigNumber,
//       number,
//       number,
//       boolean
//     ] & {
//       baseAsset: string;
//       openReserveA: BigNumber;
//       openReserveB: BigNumber;
//       blockTimestamp: number;
//       amount: BigNumber;
//       sells: number;
//       buys: number;
//       open: boolean;
//     },
//     BigNumber,
//     BigNumber
// ]

// baseAsset: string;
// openReserveA: BigNumber;
// openReserveB: BigNumber;
// blockTimestamp: number;
// amount: BigNumber;
// sells: number;
// buys: number;
// open: boolean;


// 0: (2) ['0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174']
// 1: "1939094"
// 2: "2585458"
// 3: "1508654920729336056"
// 4: (3) ['1507500000000000000', '1515000000000000000', '1530000000000000000']
// 5: "1"
// 6: "1470000000000000000"
// 7: false
// 8: "30000000000000000"

// address[] path;
// uint256 amount;
// uint256 initialAmountIn;
// uint256 lastAmountOut;
// uint256[] targets;
// uint16 targetsIndex;
// uint256 stopLoss;
// bool underStopLoss;
// uint256 stopLossAmount;

