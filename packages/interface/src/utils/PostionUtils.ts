import { HistoryTrade } from "./tradeEvent";
import bigDecimal from "js-big-decimal";

export class PositionUtils {

    network: string;
    constructor(_network: string) {
        this.network = _network;
    }

    totalSpent = (trades: HistoryTrade[]): bigDecimal => {
        return this.tradesTotal(trades, "Buy", "amount0");
    }
    totalBought = (trades: HistoryTrade[]): bigDecimal => {
        return this.tradesTotal(trades, "Buy", "amount1");
    }

    totalRecived = (trades: HistoryTrade[]): bigDecimal => {
        return this.tradesTotal(trades, "Sell", "amount0");
    }
    totalSold = (trades: HistoryTrade[]): bigDecimal => {
        return this.tradesTotal(trades, "Sell", "amount1");
    }

    tradesTotal = (trades: HistoryTrade[], _side: string, _field: string): bigDecimal => {
        // return
        let total = new bigDecimal(0);
        trades.filter(trade => trade.side === _side).forEach(trade => {
            const value = trade[_field];
            total = total.add(new bigDecimal(value));
        })
        return total;
    }

    calcPrice = (amount0: bigDecimal, amount1: bigDecimal, decimals0: number, decimals1: number): bigDecimal => {

        let price = amount0.divide(amount1, decimals0);
        const deciDifference = decimals0 - decimals1;

        if (deciDifference !== 0) {
            if (deciDifference > 0) {
                price = price.divide(new bigDecimal(Math.pow(10, deciDifference)), decimals0);
            } else {
                price = price.multiply(new bigDecimal(Math.pow(10, deciDifference)));
            }
        }
        return price;
    }

    // myReduceCallback = (sum: bigDecimal, trade: HistoryTrade, currentIndex: number, array: HistoryTrade[]): bigDecimal => {
    //     const _field = "amount0";
    //     console.warn(sum.getValue());
    //     const toAdd = new bigDecimal(trade[_field]);
    //     const ret = sum.add(toAdd)
    //     return ret;
    // }
}