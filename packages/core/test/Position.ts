import { BigNumber } from "@ethersproject/bignumber"

export interface Position {
    path: string[];
    amount: BigNumber;
    lastPrice: BigNumber;
    targets: BigNumber[],
    targetsIndex: number,
    stopLoss: BigNumber;
    underStopLoss: boolean;
    stopLossAmount: BigNumber;
    initialAmount: BigNumber;
}

export function strPosition(position: Position): string {
    return `path: ${position.path}\n` +
        `amount: ${position.amount}\n` +
        `initialAmount: ${position.initialAmount}\n` +
        `lastPrice: ${position.lastPrice.toString()}\n` +
        `targets: ${position.targets[0]}, ${position.targets[1]}, ${position.targets[2]}\n` +
        `targetsIndex ${position.targetsIndex.toString()}\n` +
        `stopLoss: ${position.stopLoss.toString()}\n` +
        `underStopLoss: ${position.underStopLoss}\n` +
        `stopLossAmount ${position.stopLossAmount.toString()}\n`
        ;
}
