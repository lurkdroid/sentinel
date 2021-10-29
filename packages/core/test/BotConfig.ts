import { BigNumber } from "@ethersproject/bignumber"

export interface BotConfig {
    defaultAmount: BigNumber,
    stopLossPercent: BigNumber,
    quoteAsset: string,
    loop: boolean,
    defaultAmountOnly: boolean
}