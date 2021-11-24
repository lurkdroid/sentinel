

export class USD{

    usdValue = (prices:any,symbol:string):number=>{
        return prices.find(ticker=>ticker.symbol===`${symbol}USDT`).price;
    }

    filterTockens = (prices:any,symbols:string[]):any=>{
        symbols = symbols.map(symbol=>symbol.startsWith("W")?symbol.substring(1):symbol).map(symbol=>symbol+"USDT");        
        return prices.filter(value => symbols.includes(value.symbol));
    }
}