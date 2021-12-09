import { BigNumber } from "@ethersproject/bignumber"
import chalk from "chalk";
import bigDecimal from "js-big-decimal";

export interface Position {
    baseAsset: string;
    openReserveA: BigNumber;
    openReserveB: BigNumber;
    blockTimestamp: number;
    amount: BigNumber;
    sells: number;
    buys: number;
    open: boolean;
}


export function strPosition(position: Position): string {
    return `baseAssest: ${chalk.yellow(position.baseAsset)}\n` +
        //FIXME calc price with decimal
        // `entry price: ${chalk.yellow(calcPrice(position))}\n` +
        `amount: ${chalk.yellow(position.amount)}\n` +
        `openReserveA: ${chalk.yellow(position.openReserveA.toString())}\n` +
        `openReserveB: ${chalk.yellow(position.openReserveB.toString())}\n` +
        // `targets: ${chalk.yellow(position.targets[0])}, ${chalk.yellow(position.targets[1])}, ${chalk.yellow(position.targets[2])}\n` +
        `buys ${chalk.yellow(position.buys.toString())}\n` +
        `sells: ${chalk.yellow(position.sells.toString())}\n` +
        `open: ${chalk.yellow(position.open)}\n` +
        // `stopLossAmount ${chalk.yellow(position.stopLossAmount.toString())}\n` +
        `time ${chalk.yellow(position.blockTimestamp.toString())}\n`
        ;
}

// export function _strPosition(position: Position, lastAmount: BigNumber): string {
//     return `baseAssest: ${chalk.yellow(position.baseAsset)}\n` +
//         //FIXME calc price with decimal
//         `price: ${chalk.bgBlue(_calcPrice(position.initialAmountIn, lastAmount))}\n` +
//         `next target: ${chalk.green(_calcPrice(position.initialAmountIn, position.targets[position.targetsIndex.valueOf()]))}\n` +
//         `stoploss: ${chalk.red(_calcPrice(position.initialAmountIn, position.stopLoss))}\n` +
//         `amount: ${position.amount}\n` +
//         `initialAmountIn: ${position.initialAmountIn}\n` +
//         `lastAmountOut: ${lastAmount.toString()}\n` +
//         `targets: ${position.targets[0]}, ${position.targets[1]}, ${position.targets[2]}\n` +
//         `targetsIndex ${position.targetsIndex.toString()}\n` +
//         `stopLoss: ${position.stopLoss.toString()}\n` +
//         `underStopLoss: ${position.underStopLoss}\n` +
//         `stopLossAmount ${position.stopLossAmount.toString()}\n` +
//         `time ${chalk.yellow(position.time.toString())}\n`
//         ;
// }

// function _calcPrice(initialAmountIn: BigNumber, lastAmount: BigNumber): string {
//     if (lastAmount == undefined || lastAmount.toString() == "0") return "N/A"
//     return new bigDecimal(lastAmount.toString())
//         .divide(new bigDecimal(initialAmountIn.toString()), 2).getValue().toString();
// }

// function calcPrice(position: Position): string {
//     if (position.lastAmountOut == undefined || position.lastAmountOut.toString() == "0") return "N/A"
//     if (position.initialAmountIn.toString() == "0") return "N/A"
//     return new bigDecimal(position.lastAmountOut.toString())
//         .divide(new bigDecimal(position.initialAmountIn.toString()), 2).getValue().toString();
// }
