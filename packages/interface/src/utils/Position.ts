import { BigNumber } from "@ethersproject/bignumber"
import bigDecimal from "js-big-decimal";
import { IPosition } from "./IPosition";

export class Position {

     getPrice( lastAmount: BigNumber): string{
        return this.calcPrice(lastAmount);
    }

     getNextTargetPrice( lastAmount: BigNumber): string{
        return this.calcPrice(this.iposition.targets[this.iposition.targetsIndex.valueOf()])
    }

     getStopLossPrice( lastAmount: BigNumber): string{
        return this.calcPrice(this.iposition.stopLoss)
    }

     getPath(): string[] {
        return this.iposition.path;
    }
     getAmount(): BigNumber {
        return this.iposition.amount;
    }
     getLastAmountOut(): BigNumber {
        return this.iposition.lastAmountOut;
    }
     getTargets(): BigNumber[] {
        return this.iposition.targets;
    }
     getTargetsIndex(): number {
        return this.iposition.targetsIndex;
    }
     getStopLoss(): BigNumber {
        return this.iposition.stopLoss;
    }
     getUnderStopLoss(): boolean {
        return this.iposition.underStopLoss;
    }
     getStopLossAmount(): BigNumber {
        return this.iposition.stopLossAmount;
    }
     getInitialAmountIn(): BigNumber {
        return this.iposition.initialAmountIn;
    }

    private iposition:IPosition;

    constructor(_ipositon:IPosition){
        this.iposition = _ipositon;
    }

     toString(): string {
        return `path: ${this.iposition.path}\n` +
            `amount: ${this.iposition.amount}\n` +
            `initialAmountIn: ${(this.iposition.initialAmountIn)}\n` +
            `lastAmountOut: ${(this.iposition.lastAmountOut.toString())}\n` +
            `targets: ${(this.iposition.targets[0])}, ${(this.iposition.targets[1])}, ${(this.iposition.targets[2])}\n` +
            `targetsIndex ${(this.iposition.targetsIndex.toString())}\n` +
            `stopLoss: ${(this.iposition.stopLoss.toString())}\n` +
            `underStopLoss: ${(this.iposition.underStopLoss)}\n` +
            `stopLossAmount ${(this.iposition.stopLossAmount.toString())}\n`
            ;
    }
    
     toStringWithPrice(lastAmount: BigNumber): string {
        return `path: ${this.iposition.path}\n` +
            //FIXME calc price with decimal
            `price: ${this.calcPrice(lastAmount)}\n` +
            `next target: ${this.calcPrice(this.iposition.targets[this.iposition.targetsIndex.valueOf()])}\n` +
            `stoploss: ${this.calcPrice(this.iposition.stopLoss)}\n` +
            `amount: ${this.iposition.amount}\n` +
            `initialAmountIn: ${this.iposition.initialAmountIn}\n` +
            `lastAmountOut: ${lastAmount.toString()}\n` +
            `targets: ${this.iposition.targets[0]}, ${this.iposition.targets[1]}, ${this.iposition.targets[2]}\n` +
            `targetsIndex ${this.iposition.targetsIndex.toString()}\n` +
            `stopLoss: ${this.iposition.stopLoss.toString()}\n` +
            `underStopLoss: ${this.iposition.underStopLoss}\n` +
            `stopLossAmount ${this.iposition.stopLossAmount.toString()}\n`
            ;
    }
    
    public calcPrice(lastAmount: BigNumber): string {
        if (lastAmount===undefined || lastAmount.toString() === "0") return "N/A"
        return new bigDecimal(lastAmount.toString())
            .divide(new bigDecimal(this.iposition.initialAmountIn.toString()), 2).getValue().toString();
    }
}

