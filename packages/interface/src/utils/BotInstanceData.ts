import { BigNumber, ethers } from "ethers";
import { BotConfig } from "./BotConfig";
import { Position } from "./Position";
import bigDecimal from "js-big-decimal";
const _addresses = require('@solidroid/core/utils/solidroid-address-matic.json');


export class BotInstanceData {
    config: BotConfig | undefined;
    position: Position | undefined;
    lastAmount: BigNumber | undefined;

    stopLossPercent() {
        return this.config?.stopLossPercent === undefined ? 'N/A' : (this.config?.stopLossPercent.toNumber() / 100).toLocaleString();
    }
    defaultAmount() {
        let defaultAmount = this.config?.defaultAmount;
        return defaultAmount === undefined ? 'N/A' : ethers.utils.formatEther(defaultAmount.toString());
    }
    status() {
        if (this.position === undefined || this.position.getPath() === undefined || this.position.getPath() === []) return "Wait for signal";
        return "Active position"
    }
    lastPrice() {
        return this.lastAmount === undefined ? 'N/A' :
            this.calcPrice(this.lastAmount)
    }

    targetPrice() {
        return this.lastAmount === undefined || this.position?.getTargets() === undefined || this.position.getTargetsIndex() === undefined
            ? 'N/A' :
            this.calcPrice(this.position.getTargets()[this.position.getTargetsIndex().valueOf()])
    }
    stopLossPrice() {
        return this.position?.getStopLoss() === undefined
            ? 'N/A' :
            this.calcPrice(this.position?.getStopLoss())
    }

    averageBuyPrice() {
        return "need to get from events";
    }
    averageSellPrice() {
        return "need to get from events";
    }

    tradingPair() {
        return this.position?.getPath() === undefined ? "N/A" :
            this.position?.getPath()[0] + "-" + this.position?.getPath()[1];
    }
    quoteAmount() {
        return "calc events"
    }
    baseAmount() {
        return this.position?.getAmount() === undefined ? 'N/A' : ethers.utils.formatEther(this.position?.getAmount().toString());
    }
    timeEntered() {
        return "from event"
    }

    targetSold() {
        return this.position?.getTargetsIndex() === undefined ? 'N/A' : this.position.getTargetsIndex().toString();
    }

    profit() {
        return "calc profit";
    }
    usdProfit() {
        return "calc usd profit";
    }

    tokenName(network: string, _address: string) {
        console.log(_addresses[network].tokens);
        console.log(_address);

        let tokenArray: Array<any> = _addresses[network].tokens;
        return tokenArray.filter(e => e.address = _address)[0].name;
    }

    quoteAssetName(network: string) {
        console.log(this.config?.quoteAsset);

        let addr = this.config?.quoteAsset;
        console.log("ccc" + addr);

        return this.tokenName(network, "addr");
    }

    gaugePercent() {
        if (this.position?.getStopLoss() === undefined || this.position?.getTargets()[2] === undefined || this.lastAmount === undefined) return 0;
        let target = new bigDecimal(this.position?.getTargets()[2].toString());
        let stopLoss = new bigDecimal(this.position?.getStopLoss().toString());
        let range = target.subtract(stopLoss);
        let place = new bigDecimal(this.lastAmount.toString()).subtract(stopLoss);

        let percent = place.divide(range, 2).getValue();
        console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
        console.log(percent);
        return parseFloat(percent);
    }

    public calcPrice(lastAmount: BigNumber): string {
        if (this.position?.getInitialAmountIn() === undefined || lastAmount === undefined || lastAmount.toString() === "0") return "N/A"
        return new bigDecimal(lastAmount.toString())
            .divide(new bigDecimal(this.position?.getInitialAmountIn().toString()), 2).getValue().toString();
    }
}