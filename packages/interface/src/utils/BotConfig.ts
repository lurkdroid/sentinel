
export interface BotConfig {
    defaultAmount: string,
    stopLossPercent: string,
    quoteAsset: string,
    looping: boolean,
    defaultAmountOnly: boolean
}

export function configFromArray(data: any): BotConfig {
    return {
        defaultAmount: data[0],
        stopLossPercent: data[1],
        quoteAsset: data[2],
        looping: data[3],
        defaultAmountOnly: false
    }
}

export function strConfig(config: BotConfig): string {
    return `quoteAsset: ${config.quoteAsset}\n` +
        `defaultAmount: ${config.defaultAmount}\n` +
        `stopLossPercent: ${config.stopLossPercent}\n` +
        `loop: ${config.looping}\n` +
        `defaultAmountOnly ${config.defaultAmountOnly}\n`
        ;
}

export function defaultConfig(): BotConfig {
    return {
        defaultAmount: "200000000000000000",
        stopLossPercent: "15",
        quoteAsset: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
        looping: true,
        defaultAmountOnly: false
    }
}
