import { HistoryTrade, PositionTrades } from "./tradeEvent";
import bigDecimal from "js-big-decimal";
import { DbToken, getDBTokens } from "./data/sdDatabase";
import { Moralis } from "moralis";
import { toDateTimeStr, formatAmount } from "./FormatUtil";
// import { parseUnits } from "ethers/lib/utils";

export class TradeHistoryUtils{
    network:string|undefined;
    setNetwork(_network:string){
        this.network = _network;
    }
    quoteName = (positionTrades: PositionTrades)=>
    this.findToken(positionTrades.trades[0].token0).name

    baseName = (positionTrades: PositionTrades)=>
     this.findToken(positionTrades.trades[0].token1).name

    quoteImage = (positionTrades: PositionTrades)=>
      this.findToken(positionTrades.trades[0].token0).img_32
      
    baseImage = (positionTrades: PositionTrades)=>
      this.findToken(positionTrades.trades[0].token1).img_32

    totalSpent = (positionTrades: PositionTrades)=>
        positionTrades.trades.reduce((total,trade)=>this.isBuy(trade)?total+=+trade.amount0:total,0);

    totalBought = (positionTrades: PositionTrades)=>
        positionTrades.trades.reduce((total,trade)=>this.isBuy(trade)?total+=+trade.amount1:total,0);

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
    // pair = (positionTrades: PositionTrades) => {
    //     let token0 =this.findToken(positionTrades.trades[0].token0);
    //     let token1 =this.findToken(positionTrades.trades[0].token1);

    //     return token0?.symbol+"-"+token1?.symbol;
    // }
    
    positionAmount = (positionTrades: PositionTrades) => {
        return formatAmount(Moralis.Units.FromWei(this.totalBought(positionTrades),this.tradeToken(positionTrades).decimals),8);
    }

    profit = (positionTrades: PositionTrades) => {
        let _profit  = this.totalSold(positionTrades) - this.totalSpent(positionTrades);
        return Moralis.Units.FromWei(_profit,this.mainToken(positionTrades).decimals);
    }
    
    percent = (positionTrades: PositionTrades) => {
        return formatAmount(formatAmount(((this.totalSold(positionTrades) / this.totalSpent(positionTrades)) * 100) - 100,2),2);
    }
    
    avePriceBought = (positionTrades: PositionTrades) => {
        let value = this.totalSpent(positionTrades)/this.buyTrades(positionTrades);
        let fromWei = Moralis.Units.FromWei(value,this.mainToken(positionTrades).decimals);
        return formatAmount(fromWei,6);
    }
    
    avePriceSold = (positionTrades: PositionTrades) => {
        let value =  this.totalSold(positionTrades)/this.sellTrades(positionTrades);
        let fromWei = Moralis.Units.FromWei(value,this.mainToken(positionTrades).decimals);
        return formatAmount(fromWei,6);
    }

    side = (trade: HistoryTrade) => {
        return this.isBuy(trade)? "Buy":"Sell"
    }
    date = (trade: HistoryTrade) => {
        return toDateTimeStr(trade.tradeTime);
    }

    image= (address:string) => {
        let token =this.findToken(address);
        return !token || !token.img_32 ? "": token.img_32;
    }

    name = (address:string) => {
        let token =this.findToken(address);
        return !token || !token.name ? "N/A": token.name;
    }

    tradeAmount = (trade: HistoryTrade) => {
        let token1 =this.findToken(trade.token1);
        if(!token1 || !token1.decimals) return "N/A"
        return formatAmount(Moralis.Units.FromWei(trade.amount1,token1.decimals),6);
    }

    price = (trade: HistoryTrade) => {
        //needs to know both assets decimals
        let token0 =this.findToken(trade.token0);
        if(!token0 || !token0.decimals) return "N/A";
        let token1 =this.findToken(trade.token1);
        if(!token1 || !token1.decimals) return "N/A";

        let _price = this.calcPrice(trade,token1.decimals);
        //special case when decimals are different
        if(token0.decimals!==token1.decimals){
            let deciDifference = token0.decimals-token1.decimals;
            if(deciDifference>0)
                _price = _price.divide(new bigDecimal(Math.pow(10,deciDifference)),18);
            else
                _price = _price.multiply(new bigDecimal(Math.pow(10,deciDifference)));

        }
        return formatAmount(_price.getValue(),8); 
    }

    calcPrice = (trade: HistoryTrade, precision:number)=>{
        return new bigDecimal(trade.amount0).divide(new bigDecimal(trade.amount1),precision);
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
    tradeToken(positionTrades:PositionTrades) :DbToken|undefined{
        return this.findToken(positionTrades.trades[0].token1);
    }
    findToken(_address: string):DbToken|undefined{
        return this.network===undefined? undefined: getDBTokens(this.network).filter(t=>t.address.toLocaleUpperCase()===_address.toLocaleUpperCase())[0];
    }
}








