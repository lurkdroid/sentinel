import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import bigDecimal from 'js-big-decimal';
import { Moralis } from 'moralis';

import { BotConfig } from '../utils/BotConfig';
import { DbToken, getDBTokens } from '../utils/data/sdDatabase';
import { MrERC20Balance } from '../utils/MrERC20Balance';
import { Position } from '../utils/Position';
import { Trade } from '../utils/tradeEvent';

// import type { networks } from "../utils/tokens"
declare interface DroidStatus {
    config?: BotConfig;
    position?: Position;
    lastAmount: string;
    network: string | undefined;
    balances: MrERC20Balance[];
    botAddress: string;
    quoteDbToken?: DbToken;
    trades?: Trade[];
}

const initialState: DroidStatus = {
    config: undefined,
    position: undefined,
    lastAmount: "0",
    network: undefined,
    balances: [],
    botAddress: "",
    quoteDbToken: undefined,
    trades: undefined, 
}

// change state
export function quoteToken(state: DroidStatus) {
    if (state.quoteDbToken) return state.quoteDbToken;
    // state.quoteDbToken = (state.config?.quoteAsset && findToken(state, state.config?.quoteAsset)) || undefined;
    return state.quoteDbToken;
}

export function lastPrice(state: DroidStatus) {
    let decimals = quoteToken(state) ? quoteToken(state) : 18;
    return state.lastAmount ? Moralis.Units.FromWei(calcPrice(state, state.lastAmount), 18) : 'N/A';
}

//does not change state
export function stopLossPercent(state: DroidStatus) {
    return state.config?.stopLossPercent ?
        (parseFloat(state.config?.stopLossPercent) / 100).toLocaleString() : 'N/A';
}

export function defaultAmount(state: DroidStatus) {
    let defaultAmount = state.config?.defaultAmount;
    return defaultAmount ? ethers.utils.formatEther(defaultAmount) : 'N/A';
}
export function active(state: DroidStatus) {
    return status(state) === "Active position";
}
export function status(state: DroidStatus) {
    return state.position && state.position.initialAmountIn && state.position.initialAmountIn !== "0" ?
        "Active position" : "Wait for signal";
}

export function targetPrice(state: DroidStatus) {
    return state.lastAmount && state.position?.targets && state.position.targetsIndex
        ? calcPrice(state,state.position.targets[parseInt(state.position.targetsIndex)])
        : 'N/A';
}

export function stopLossPrice(state: DroidStatus) {
    return state.position?.stopLoss
        ? calcPrice(state, state.position?.stopLoss) : 'N/A';
}

export function averageBuyPrice(state: DroidStatus) {
    return "need to get from events";
}
export function averageSellPrice(state: DroidStatus) {
    return "need to get from events";
}

export function tradingPair(state: DroidStatus) {
    return state.position?.path ?
        state.position?.path[0] + "-" + state.position?.path[1] : "N/A";
}
export function quoteAmount(state: DroidStatus) {
    return "calc events"
}
export function baseAmount(state: DroidStatus) {
    let amount = state.position?.amount ? state.position?.amount : 'N/A';
    if (!state.position?.path[1]) return "N/A";
    let decimals = findToken(state, state.position?.path[1])?.decimals
    return decimals ? Moralis.Units.FromWei(amount, decimals) : "N/A";
}
export function timeEntered(state: DroidStatus) {
    return "from event"
}

export function targetSold(state: DroidStatus) {
    return state.position?.targetsIndex ? state.position.targetsIndex : 'N/A';
}

export function profit(state: DroidStatus) {
    return "calc profit";
}
export function usdProfit(state: DroidStatus) {
    return "calc usd profit";
}

export function tokenName(state: DroidStatus,_address: string) {
    let token = findToken(state, _address);
    return token === undefined ? "n/a" : token?.name;
}
export function tokenImage(state: DroidStatus, _address: string) {
    let token = findToken(state, _address);
    return token === undefined ? "n/a" : token?.img_32;
}
export function quoteAssetBalance(state: DroidStatus) {
    let balanc = state?.balances && state.balances.length > 0 ?
        state.balances.filter(erc20 => erc20.token_address.toLocaleUpperCase() === state.config?.quoteAsset.toLocaleUpperCase())[0]?.balance : "0";
    return ethers.utils.formatEther(balanc);
}
export function findToken(state: DroidStatus, _address: string): DbToken | undefined {
    return state.network === undefined ? undefined : getDBTokens(state.network).filter(t => t.address.toLocaleUpperCase() === _address.toLocaleUpperCase())[0];
}
export function quoteAssetName(state: DroidStatus) {
    return state.config?.quoteAsset ? tokenName(state, state.config.quoteAsset) : undefined;
}
export function baseAssetName(state: DroidStatus) {
    return state.position?.path && state.position?.path.length ? (tokenName(state, state.position?.path[1])) : undefined;
}
export function quoteAssetImage(state: DroidStatus) {
    return state.config?.quoteAsset ? tokenImage(state, state.config?.quoteAsset) : undefined;
}

export function baseAssetImage(state: DroidStatus) {
    return state.position?.path && state.position?.path.length ? (tokenImage(state,state.position?.path[1])) : undefined;
}

export function positionTrades(state: DroidStatus): Trade[] {
    const lastBuy = (trade: Trade) => trade.side === "0";
    const index = state.trades?.findIndex(lastBuy) || 0;
    let positionTrades = state.trades ? state.trades.slice(0, index + 1) : [];
    return positionTrades.map(trade => {
        return {
            side: trade.side === "0" ? "Buy" : "Sell",
            token0: state.quoteDbToken?.symbol || "",
            token1: findToken(state, trade.token1)?.symbol || "",
            price: trade.price,
            amount: trade.amount,
            blockNumber: trade.blockNumber
        }
    })
}

export function gaugePercent(state: DroidStatus) {
    if (state.position?.stopLoss === undefined || state.lastAmount === undefined || state.lastAmount === "0") return 0;
    let target = new bigDecimal(state.position?.targets[2]);
    let stopLoss = new bigDecimal(state.position?.stopLoss);
    let range = target.subtract(stopLoss);
    if (range.getValue() === "0") return 0;
    let place = new bigDecimal(state.lastAmount).subtract(stopLoss);
    let percent = place.divide(range, 2).getValue();
    return parseFloat(percent);
}

export function calcPrice(state: DroidStatus, lastAmount: string): string {
    if (state.position?.initialAmountIn === undefined || lastAmount === undefined || lastAmount === "0") return "N/A"
    return new bigDecimal(lastAmount)
        .divide(new bigDecimal(state.position?.initialAmountIn), 2).getValue().toString();
}

const slice = createSlice({
    "name": "droidStatus",
    initialState,
    "reducers": {
     setPosition(state, action: PayloadAction<Position>){
         state.position = action.payload;
     },
     setConfig(state, action: PayloadAction<BotConfig>){
         state.config = action.payload;
     },
     setBalances(state, action: PayloadAction<MrERC20Balance[]>){
         state.balances = action.payload;
     },
     setLastAmount(state, action: PayloadAction<string>){
         state.lastAmount = action.payload;
     },
     setTrades(state, action: PayloadAction<Trade[]>){
         state.trades = action.payload;
     },
     setBotAddress(state, action: PayloadAction<string>){
         state.botAddress = action.payload;
     }
    }
});




export const {setBotAddress, setTrades, setLastAmount, setConfig, setPosition, setBalances  } = slice.actions
export { slice as droidStatusSlice };
