
export interface BotConfig {
    defaultAmount: string,
    stopLossPercent: string,
    quoteAsset: string,
    loop: boolean,
    defaultAmountOnly: boolean
}

export function configFromArray(data:Array<any>):BotConfig{
    return{
        defaultAmount: data[0],
        stopLossPercent: data[1],
        quoteAsset: data[2],
        loop:data[3],
        defaultAmountOnly:false
    }
}

export function strConfig(config: BotConfig): string {
    return `quoteAsset: ${config.quoteAsset}\n` +
        `defaultAmount: ${config.defaultAmount}\n` +
        `stopLossPercent: ${config.stopLossPercent}\n` +
        `loop: ${config.loop}\n` +
        `defaultAmountOnly ${config.defaultAmountOnly}\n`
        ;
}
