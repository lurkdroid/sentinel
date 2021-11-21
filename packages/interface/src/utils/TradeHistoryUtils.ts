import { HistoryTrade, PositionTrades } from "./tradeEvent";
import bigDecimal from "js-big-decimal";
import { DbToken, getDBTokens } from "./data/sdDatabase";
import { Moralis } from "moralis";
import { toDateTimeStr, formatAmount } from "./FormatUtil";

export class TradeHistoryUtils{
    network:string|undefined;
    setNetwork(_network:string){
        this.network = _network;
    }

    totalBought = (positionTrades: PositionTrades)=>
        positionTrades.trades.reduce((total,trade)=>this.isBuy(trade)?total+=+trade.amount0:total,0);

    totalSold = (positionTrades: PositionTrades)=>
        positionTrades.trades.reduce((total,trade)=>this.isBuy(trade)?total:total+=+trade.amount0,0);

    buyTrades = (positionTrades: PositionTrades)=>
        positionTrades.trades.reduce((total,trade)=> this.isBuy(trade)? ++total:total ,0);

    sellTrades = (positionTrades: PositionTrades)=>
        positionTrades.trades.reduce((total,trade)=> this.isBuy(trade)? total:++total ,0);

    timeStart = (positionTrades: PositionTrades) => {
        return toDateTimeStr(positionTrades.trades[0].positionTime);
    }
    
    timeEnd = (positionTrades: PositionTrades) => {
        return toDateTimeStr(positionTrades.trades[positionTrades.trades.length-1].tradeTime);
    }
    pair = (positionTrades: PositionTrades) => {
        let token0 =this.findToken(positionTrades.trades[0].token0);
        let token1 =this.findToken(positionTrades.trades[0].token1);

        return token0?.symbol+"-"+token1?.symbol;
    }
    
    profit = (positionTrades: PositionTrades) => {
        let _profit  = this.totalSold(positionTrades) -this.totalBought(positionTrades);
        return Moralis.Units.FromWei(_profit,this.mainToken(positionTrades).decimals);
    }
    
    percent = (positionTrades: PositionTrades) => {
        return formatAmount(formatAmount(((this.totalSold(positionTrades) / this.totalBought(positionTrades)) * 100) - 100,2),2);
    }
    
    avePriceBought = (positionTrades: PositionTrades) => {
        return this.totalBought(positionTrades)/this.buyTrades(positionTrades);
    }
    
    avePriceSold = (positionTrades: PositionTrades) => {
        return this.totalSold(positionTrades)/this.sellTrades(positionTrades);
    }
    
    amount = (positionTrades: PositionTrades) => {

        return "2021-11-12 11:25:27"
    }
    side = (trade: HistoryTrade) => {
        return this.isBuy(trade)? "Buy":"Sell"
    }
    date = (trade: HistoryTrade) => {
        return toDateTimeStr(trade.tradeTime);
    }
    tradeAmount = (trade: HistoryTrade) => {
        let token1 =this.findToken(trade.token1);
        if(!token1 || !token1.decimals) return "N/A"
        return Moralis.Units.FromWei(trade.amount1,token1.decimals);
    }
    price = (trade: HistoryTrade) => {
        let token0 =this.findToken(trade.token0);
        if(!token0 || !token0.decimals) return "N/A";
        let _price = new bigDecimal(trade.amount0).divide(new bigDecimal(trade.amount1),4).getValue();
        return Moralis.Units.FromWei(_price,token0.decimals);; 
    }
    transaction = (trade: HistoryTrade) => {
        return `https://polygonscan.com/tx/${trade.trx}`;
    }
    isBuy(trade: HistoryTrade): boolean {
        return  trade.side==="0";
    }
    
    mainToken(positionTrades:PositionTrades) :DbToken|undefined{
       return this.findToken(positionTrades.trades[0].token0);
    }

    findToken(_address: string):DbToken|undefined{
        return this.network===undefined? undefined: getDBTokens(this.network).filter(t=>t.address.toLocaleUpperCase()===_address.toLocaleUpperCase())[0];
    }
}








