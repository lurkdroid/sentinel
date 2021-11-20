import { HistoryTrade, PositionTrades } from "./tradeEvent";
import bigDecimal from "js-big-decimal";
import { DbToken, getDBTokens } from "./data/sdDatabase";
import { Moralis } from "moralis";

export class TradeHistoryUtils{
    network:string|undefined;

    setNetwork(_network:string){
        this.network = _network;
    }

    timeStart = (positionTrades: PositionTrades) => {
        return positionTrades.trades[0].positionTime;
    }
    
    timeEnd = (positionTrades: PositionTrades) => {
        return positionTrades.trades[positionTrades.trades.length-1].tradeTime;
    }
    pair = (positionTrades: PositionTrades) => {
        let token0 =this.findToken(positionTrades.trades[0].token0);
        let token1 =this.findToken(positionTrades.trades[0].token1);

        return token0?.symbol+"-"+token1?.symbol;
    }
    
    profit = (positionTrades: PositionTrades) => {
        return positionTrades
        .trades.map(trade=> {
            let amount0 = new bigDecimal(trade.amount0);
            if (this.isBuy(trade)) amount0 = amount0.multiply(new bigDecimal(-1));
            return amount0
        }).reduce(function(a, b){ return a.add(b) }).getValue();
    }
    
    percent = (positionTrades: PositionTrades) => {
        return "2021-11-12 11:25:27"
    }
    
    avePriceBought = (positionTrades: PositionTrades) => {
        return "2021-11-12 11:25:27"
    }
    
    avePriceSold = (positionTrades: PositionTrades) => {
        return "2021-11-12 11:25:27"
    }
    
    amount = (positionTrades: PositionTrades) => {

        return "2021-11-12 11:25:27"
    }
    side = (trade: HistoryTrade) => {
        return this.isBuy(trade)? "Buy":"Sell"
    }
    date = (trade: HistoryTrade) => {
        return trade.tradeTime;
    }
    tradeAmount = (trade: HistoryTrade) => {
        let token1 =this.findToken(trade.token1);
        if(!token1 || !token1.decimals) return "N/A"
        return Moralis.Units.FromWei(trade.amount1,token1.decimals);;
    }
    price = (trade: HistoryTrade) => {
        return new bigDecimal(trade.amount0).divide(new bigDecimal(trade.amount1),4).getValue();
    }
    transaction = (trade: HistoryTrade) => {
        return `https://polygonscan.com/tx/${trade.trx}`;
    }
    isBuy(trade: HistoryTrade): boolean {
        return  trade.side==="0";
    }
    
    findToken(_address: string):DbToken|undefined{
        return this.network===undefined? undefined: getDBTokens(this.network).filter(t=>t.address.toLocaleUpperCase()===_address.toLocaleUpperCase())[0];
    }
}








