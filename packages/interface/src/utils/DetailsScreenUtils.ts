import { formatAmount, toDateTimeStr } from "./FormatUtil";
import { HistoryTrade } from "./tradeEvent";
import bigDecimal from "js-big-decimal";
import Moralis from "moralis";
import { DbToken, getDBTokens } from "./data/sdDatabase";
import { PositionUtils } from "./PostionUtils";

export class DetailsScreenUtils {

    network: string;
    positionUtils: PositionUtils;

    constructor(_network: string) {
        this.network = _network;
        this.positionUtils = new PositionUtils(this.network);
    }

    positionStartTime = (positionTrades: HistoryTrade[]) => {
        if (positionTrades && positionTrades.length > 0) {
            return toDateTimeStr(positionTrades[0].positionTime);
        }
        return "N/A";
    }

    aveBuyPrice = (positionTrades: HistoryTrade[]): string => {
        if (positionTrades && positionTrades.length > 0) {
            try {
                const totalSpent = this.positionUtils.totalSpent(positionTrades);
                const totalBought = this.positionUtils.totalBought(positionTrades);
                return this.returnPrice(totalSpent, totalBought, positionTrades[0].token0, positionTrades[0].token1);
            } catch (error) {
                console.error(error);
                return "N/A";
            }
        }
        return "N/A";
    }

    aveSellPrice = (positionTrades: HistoryTrade[]) => {
        if (positionTrades && positionTrades.length > 0) {
            try {
                const totalRecived = this.positionUtils.totalRecived(positionTrades);
                const totalSold = this.positionUtils.totalSold(positionTrades);
                return this.returnPrice(totalRecived, totalSold, positionTrades[0].token0, positionTrades[0].token1);
            } catch (error) {
                console.error(error);
                return "N/A";
            }
        }
        return "N/A";
    }

    returnPrice(amount0: bigDecimal, amount1: bigDecimal, _token0Address: string, _token1Address: string): string {
        const token0 = this.findToken(_token0Address);
        const token1 = this.findToken(_token1Address);
        return this.calcPrice(amount0, amount1, token0.decimals, token1.decimals)
    }

    calcPrice = (amount0: bigDecimal, amount1: bigDecimal, decimals0: number, decimals1: number): string => {

        let price = amount0.divide(amount1, decimals0);
        const deciDifference = decimals0 - decimals1;

        if (deciDifference !== 0) {
            if (deciDifference > 0) {
                price = price.divide(new bigDecimal(Math.pow(10, deciDifference)), decimals0);
            } else {
                price = price.multiply(new bigDecimal(Math.pow(10, deciDifference)));
            }
        }
        return price.getValue();
    }

    findToken(_address: string): DbToken {
        return getDBTokens(this.network).filter(t => t.address.toLocaleUpperCase() === _address.toLocaleUpperCase())[0];
    }

    weightedAverage = (nums: bigDecimal[], weights: bigDecimal[]) => {
        const [sum, weightSum] = weights.reduce(
            (acc, w, i) => {
                acc[0] = acc[0].add(nums[i]).multiply(w);//+ nums[i] * w;
                acc[1] = acc[1].add(w);// + w;
                return acc;
            },
            [new bigDecimal(0), new bigDecimal(0)]
        );
        return weightSum.getValue() === "0" ? weightSum : sum.divide(weightSum, 18);// / weightSum;
    };
    //   weightedAverage([1, 2, 3], [0.6, 0.2, 0.3]); // 1.72727

}