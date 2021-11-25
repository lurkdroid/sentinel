import { formatAmount, toDateTimeStr } from "./FormatUtil";
import { HistoryTrade } from "./tradeEvent";
import bigDecimal from "js-big-decimal";
import Moralis from "moralis";
import { DbToken, getDBTokens } from "./data/sdDatabase";
import {PositionUtils}  from "./PostionUtils";

export class DetailsScreenUtils{

    network:string;
    positionUtils:PositionUtils;
    
    constructor(_network: string) {
        this.network = _network;
        this.positionUtils = new PositionUtils(this.network);
    }

    positionStartTime = (positionTrades: HistoryTrade[]) => {
        if( positionTrades && positionTrades.length>0){
            return toDateTimeStr( positionTrades[0].positionTime);
        }
        return "N/A";
    }

    aveBuyPrice = (positionTrades: HistoryTrade[]) => {

        const totalSpent = this.positionUtils.totalSpent(positionTrades);
        const totalBought = this.positionUtils.totalBought(positionTrades);

        // try {
        //     if(positionTrades && positionTrades.length > 0){
        //         const buyTrades = positionTrades.filter(t=>t.side==="Buy");

        //         buyTrades.map(trade=>{
        //             return {price:this.calcPrice(trade,10),amount:new bigDecimal(trade.amount1)}
        //         })
        //         .reduce(element=>{

        //         })

        //         const prices = buyTrades.map(this.calcPrice);
        //         const amounts = buyTrades.map(t=>new bigDecimal(t.amount1));
        //         const average = this.weightedAverage(prices,amounts).getValue();
        //         const buyToken = this.findToken(buyTrades[0].token1);
        //         const value = Moralis.Units.FromWei(average,buyToken.decimals)
        //         return formatAmount(value,8);
        //     }
        // } catch (error) {
        //     console.error(error);
        // }
        return "N/A";
    }
    
    aveSellPrice = (positionTrades: HistoryTrade[]) => {
        // try {
        //     if(positionTrades && positionTrades.length > 0){
        //         const sellTrades = positionTrades.filter(t=>t.side==="Sell");

                

        //         if(!sellTrades||sellTrades.length===0)return "N/A"
        //         const prices = sellTrades.map(this.calcPrice);
        //         const amounts = sellTrades.map(t=>new bigDecimal(t.amount1));
        //         const average = this.weightedAverage(prices,amounts).getValue();
        //         const buyToken = this.findToken(sellTrades[0].token1);
        //         const value = Moralis.Units.FromWei(average,buyToken.decimals)
        //         return formatAmount(value,8);
    
        //     }
        // } catch (error) {
        //     console.error(error);
            
        // }
        return "N/A";
    }

    returnPrice(amount0:bigDecimal,amount1:bigDecimal,_token0Address:string,_token1Address:string):string{
        const token0 = this.findToken(_token0Address);
        const token1 = this.findToken(_token1Address);

    }

    // calcPrice = (trade: HistoryTrade, precision:number)=>{
    //     return new bigDecimal(trade.amount0).divide(new bigDecimal(trade.amount1),precision);
    // }

    findToken(_address: string):DbToken{
        return getDBTokens(this.network).filter(t=>t.address.toLocaleUpperCase()===_address.toLocaleUpperCase())[0];
    }

    weightedAverage = (nums:bigDecimal[], weights:bigDecimal[]) => {
        const [sum, weightSum] = weights.reduce(
          (acc, w, i) => {
            acc[0] = acc[0].add(nums[i]).multiply(w) ;//+ nums[i] * w;
            acc[1] = acc[1].add(w);// + w;
            return acc;
          },
          [new bigDecimal(0), new bigDecimal(0)]
        );
        return weightSum.getValue()==="0"? weightSum: sum.divide(weightSum,18);// / weightSum;
      };
    //   weightedAverage([1, 2, 3], [0.6, 0.2, 0.3]); // 1.72727

}