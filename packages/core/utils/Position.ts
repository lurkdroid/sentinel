import { BigNumber } from "@ethersproject/bignumber"
import chalk from "chalk";
import bigDecimal from "js-big-decimal";

export interface Position {
    path: string[];
    amount: BigNumber;
    lastAmountOut: BigNumber;
    targets: BigNumber[],
    targetsIndex: number,
    stopLoss: BigNumber;
    underStopLoss: boolean;
    stopLossAmount: BigNumber;
    initialAmountIn: BigNumber;
    time: BigNumber;
}


export function strPosition(position: Position): string {
    return `path: ${chalk.yellow(position.path)}\n` +
        //FIXME calc price with decimal
        `price: ${chalk.yellow(calcPrice(position))}\n` +
        `amount: ${chalk.yellow(position.amount)}\n` +
        `initialAmountIn: ${chalk.yellow(position.initialAmountIn)}\n` +
        `lastAmountOut: ${chalk.yellow(position.lastAmountOut.toString())}\n` +
        `targets: ${chalk.yellow(position.targets[0])}, ${chalk.yellow(position.targets[1])}, ${chalk.yellow(position.targets[2])}\n` +
        `targetsIndex ${chalk.yellow(position.targetsIndex.toString())}\n` +
        `stopLoss: ${chalk.yellow(position.stopLoss.toString())}\n` +
        `underStopLoss: ${chalk.yellow(position.underStopLoss)}\n` +
        `stopLossAmount ${chalk.yellow(position.stopLossAmount.toString())}\n`+
        `time ${chalk.yellow(position.time.toString())}\n`
        ;
}

export function _strPosition(position: Position, lastAmount: BigNumber): string {
    return `path: ${position.path}\n` +
        //FIXME calc price with decimal
        `price: ${chalk.bgBlue(_calcPrice(position.initialAmountIn, lastAmount))}\n` +
        `next target: ${chalk.green(_calcPrice(position.initialAmountIn, position.targets[position.targetsIndex.valueOf()]))}\n` +
        `stoploss: ${chalk.red(_calcPrice(position.initialAmountIn, position.stopLoss))}\n` +
        `amount: ${position.amount}\n` +
        `initialAmountIn: ${position.initialAmountIn}\n` +
        `lastAmountOut: ${lastAmount.toString()}\n` +
        `targets: ${position.targets[0]}, ${position.targets[1]}, ${position.targets[2]}\n` +
        `targetsIndex ${position.targetsIndex.toString()}\n` +
        `stopLoss: ${position.stopLoss.toString()}\n` +
        `underStopLoss: ${position.underStopLoss}\n` +
        `stopLossAmount ${position.stopLossAmount.toString()}\n`+
        `time ${chalk.yellow(position.time.toString())}\n`
        ;
}

function _calcPrice(initialAmountIn: BigNumber, lastAmount: BigNumber): string {
    if (lastAmount==undefined || lastAmount.toString() == "0") return "N/A"
    return new bigDecimal(lastAmount.toString())
        .divide(new bigDecimal(initialAmountIn.toString()), 2).getValue().toString();
}

function calcPrice(position: Position): string {
    if (position.lastAmountOut==undefined || position.lastAmountOut.toString() == "0") return "N/A"
    if (position.initialAmountIn.toString() == "0") return "N/A"
    return new bigDecimal(position.lastAmountOut.toString())
        .divide(new bigDecimal(position.initialAmountIn.toString()), 2).getValue().toString();
}
