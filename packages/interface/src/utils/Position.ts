
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