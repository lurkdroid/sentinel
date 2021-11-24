
import bigDecimal from "js-big-decimal";

export class USD{

    usdValue = (prices:any,symbol:string,amount:number|string):string=>{

        if(!symbol||!prices || !prices.length)return "N/A";
        symbol = symbol.startsWith("W")?symbol.substring(1):symbol;
        const price = prices.find(ticker=>ticker.symbol===`${symbol}USDT`).price;
        return new bigDecimal(amount).multiply(new bigDecimal(price)).getValue();
    }

    filterTockens = (prices:any,symbols:string[]):any=>{
        symbols = symbols.map(symbol=>symbol.startsWith("W")?symbol.substring(1):symbol).map(symbol=>symbol+"USDT");        
        return prices.filter(value => symbols.includes(value.symbol));
    }
}