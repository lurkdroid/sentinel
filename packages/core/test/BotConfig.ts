import { BigNumber } from "@ethersproject/bignumber"

export interface BotConfig {
    defaultAmount: BigNumber,
    stopLossPercent: BigNumber,
    quoteAsset: string,
    loop: boolean,
    defaultAmountOnly: boolean
}

export function strConfig(config: BotConfig): string {
    return `quoteAsset: ${config.quoteAsset}\n` +
        `defaultAmount: ${config.defaultAmount.toString()}\n` +
        `stopLossPercent: ${config.stopLossPercent.toString()}\n` +
        `loop: ${config.loop}\n` +
        `defaultAmountOnly ${config.defaultAmountOnly}\n`
        ;
}