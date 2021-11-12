import {  ethers } from "ethers";
import { BotConfig } from "./BotConfig";
import bigDecimal from "js-big-decimal";
import { getDBTokens } from "./data/sdDatabase";
import { Position } from "./Position";
import { MrERC20Balance } from "./MrERC20Balance";
import Moralis from "moralis/types";

export class BotInstanceData {
    config: BotConfig | undefined;
    position: Position | undefined;
    lastAmount: string ="0";
    network:string|undefined;
    balances:MrERC20Balance[]=[];

    stopLossPercent() {
        return this.config?.stopLossPercent ? 
         (parseFloat(this.config?.stopLossPercent) / 100).toLocaleString():'N/A' ;
    }

    defaultAmount() {
        let defaultAmount = this.config?.defaultAmount;
        return defaultAmount  ? ethers.utils.formatEther(defaultAmount):'N/A' ;
    }
    active(){
        return this.status()==="Active position";
    }
    status() {
        return this.position && this.position.initialAmountIn && this.position.initialAmountIn!=="0"?
        "Active position":  "Wait for signal";
    }

    lastPrice() {
        return this.lastAmount  ?  this.calcPrice(this.lastAmount):'N/A' ;
    }

    targetPrice() {
        return this.lastAmount && this.position?.targets && this.position.targetsIndex
            ?this.calcPrice(this.position.targets[parseInt(this.position.targetsIndex)])
            :'N/A' ;
    }

    stopLossPrice() {
        return this.position?.stopLoss 
            ?this.calcPrice(this.position?.stopLoss):'N/A' ;
    }

    averageBuyPrice() {
        return "need to get from events";
    }
    averageSellPrice() {
        return "need to get from events";
    }

    tradingPair() {
        return this.position?.path ? 
            this.position?.path[0] + "-" + this.position?.path[1]:"N/A" ;
    }
    quoteAmount() {
        return "calc events"
    }
    baseAmount() {
        return this.position?.amount ?  ethers.utils.formatEther(this.position?.amount):'N/A' ;
    }
    timeEntered() {
        return "from event"
    }

    targetSold() {
        return this.position?.targetsIndex ?  this.position.targetsIndex:'N/A' ;
    }

    profit() {
        return "calc profit";
    }
    usdProfit() {
        return "calc usd profit";
    }

    tokenName( _address: string) {
        let token = this.findToken(_address);
        return token === undefined?"n/a": token?.name;    
    }
    tokenImage( _address: string) {
        let token =this.findToken(_address);
        return token === undefined?"n/a": token?.img_32;
    }
    quoteAssetBalance(){
        let balanc =  this?.balances && this.balances.length>0 ? 
        this.balances.filter(erc20=>erc20.token_address.toLocaleUpperCase()===this.config?.quoteAsset.toLocaleUpperCase())[0]?.balance:"0";
        // return Moralis.Units.FromWei(balanc,2);
        return ethers.utils.formatEther(balanc);
    }
    findToken(_address: string){
        return this.network===undefined? undefined: getDBTokens(this.network).filter(t=>t.address===_address)[0];
    }
    quoteAssetName() {
        return this.config?.quoteAsset ===undefined? undefined: this.tokenName(this.config.quoteAsset);
    }
    baseAssetName() {
        return this.position?.path && this.position?.path.length ?(this.tokenName(this.position?.path[1])):undefined;
    }
    quoteAssetImage(){
        return this.config?.quoteAsset ? this.tokenImage(this.config?.quoteAsset):undefined;
    }

    baseAssetImage(){
        return this.position?.path && this.position?.path.length ? (this.tokenImage(this.position?.path[1])):undefined;
    }

    gaugePercent() {
        if (this.position?.stopLoss === undefined ||  this.lastAmount === undefined || this.lastAmount=="0") return 0;
        let target = new bigDecimal(this.position?.targets[2]);
        let stopLoss = new bigDecimal(this.position?.stopLoss);
        let range = target.subtract(stopLoss);
        if(range.getValue()==="0")return 0;
        let place = new bigDecimal(this.lastAmount).subtract(stopLoss);
        let percent = place.divide(range, 2).getValue();
        return parseFloat(percent);
    }

    public calcPrice(lastAmount: string): string {
        if (this.position?.initialAmountIn === undefined || lastAmount === undefined || lastAmount === "0") return "N/A"
        return new bigDecimal(lastAmount)
            .divide(new bigDecimal(this.position?.initialAmountIn), 2).getValue().toString();
    }
}