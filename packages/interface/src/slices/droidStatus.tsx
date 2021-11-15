import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import bigDecimal from "js-big-decimal";
import { Moralis } from "moralis";

import { AppDispatch, RootState } from "../store";
import { BotConfig } from "../utils/BotConfig";
import { DbToken, getDBTokens } from "../utils/data/sdDatabase";
import { MrERC20Balance } from "../utils/MrERC20Balance";
import { Position } from "../utils/Position";
import { HistoryTrade } from "../utils/tradeEvent";

// import type { networks } from "../utils/tokens"
declare interface DroidStatus {
  config?: BotConfig;
  position?: Position;
  lastAmount: string;
  network: string | undefined;
  balances: MrERC20Balance[];
  botAddress: string;
  quoteDbToken?: DbToken;
  trades?: HistoryTrade[];
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
};

export function lastPrice(state: DroidStatus) {
  // let decimals = quoteToken(state) ? quoteToken(state) : 18;
  return state.lastAmount
    ? Moralis.Units.FromWei(calcPrice(state, state.lastAmount), 18)
    : "N/A";
}

//does not change state
export function stopLossPercent(state: DroidStatus) {
  return state.config?.stopLossPercent
    ? (parseFloat(state.config?.stopLossPercent) / 100).toLocaleString()
    : "N/A";
}

export function defaultAmount(state: DroidStatus) {
  let defaultAmount = state.config?.defaultAmount;
  return defaultAmount ? ethers.utils.formatEther(defaultAmount) : "N/A";
}
export function active(state: DroidStatus) {
  return status(state) === "Active position";
}
export function status(state: DroidStatus) {
  return state.position &&
    state.position.initialAmountIn &&
    state.position.initialAmountIn !== "0"
    ? "Active position"
    : "Wait for signal";
}

export function targetPrice(state: DroidStatus) {
  return state.lastAmount &&
    state.position?.targets &&
    state.position.targetsIndex
    ? calcPrice(
        state,
        state.position.targets[parseInt(state.position.targetsIndex)]
      )
    : "N/A";
}

export function stopLossPrice(state: DroidStatus) {
  return state.position?.stopLoss
    ? calcPrice(state, state.position?.stopLoss)
    : "N/A";
}

export function averageBuyPrice(state: DroidStatus) {
  return "need to get from events";
}
export function averageSellPrice(state: DroidStatus) {
  return "need to get from events";
}

export function tradingPair(state: DroidStatus) {
  return state.position?.path
    ? state.position?.path[0] + "-" + state.position?.path[1]
    : "N/A";
}
export function quoteAmount(state: DroidStatus) {
  return "calc events";
}
export function baseAmount(store: RootState) {
  const { droid } = store;
  const {
    app: { network },
  } = store;
  let amount = droid.position?.amount ? droid.position?.amount : "N/A";
  if (!droid.position?.path[1]) return "N/A";
  let decimals = findToken(store, droid.position?.path[1])?.decimals;
  return decimals ? Moralis.Units.FromWei(amount, decimals) : "N/A";
}
export function timeEntered(state: DroidStatus) {
  return "from event";
}

export function targetSold(state: DroidStatus) {
  return state.position?.targetsIndex ? state.position.targetsIndex : "N/A";
}

export function profit(state: DroidStatus) {
  return "calc profit";
}
export function usdProfit(state: DroidStatus) {
  return "calc usd profit";
}

export function tokenName(store: RootState, _address: string) {
  let token = findToken(store, _address);
  return token === undefined ? "n/a" : token?.name;
}
export function tokenImage(store: RootState, _address: string) {
  let token = findToken(store, _address);
  return token === undefined ? "n/a" : token?.img_32;
}
export function quoteAssetBalance(store: RootState) {
  try {
    const { droid } = store;
    let balance =
      droid?.balances && droid.balances.length > 0
        ? droid.balances.filter(
            (erc20) =>
              erc20.token_address.toLocaleUpperCase() ===
              droid.config?.quoteAsset.toLocaleUpperCase()
          )[0]?.balance
        : "0";
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error(error);
    return "-1";
  }
}
export function findToken(store: RootState, _address: string): DbToken {
  return store.app.network
    ? getDBTokens(store.app.network).filter(
        (t) => t.address.toLocaleUpperCase() === _address.toLocaleUpperCase()
      )[0]
    : ({} as DbToken);
}
export function quoteAssetName(store: RootState) {
  const { droid } = store;
  return droid.config?.quoteAsset
    ? tokenName(store, droid.config.quoteAsset)
    : undefined;
}
export function baseAssetName(store: RootState) {
  const { droid } = store;
  return droid.position?.path && droid.position?.path.length
    ? tokenName(store, droid.position?.path[1])
    : undefined;
}
export function quoteAssetImage(store: RootState) {
  const { droid } = store;
  return droid.config?.quoteAsset
    ? tokenImage(store, droid.config?.quoteAsset)
    : undefined;
}

export function baseAssetImage(store: RootState) {
  const { droid } = store;
  return droid.position?.path && droid.position?.path.length
    ? tokenImage(store, droid.position?.path[1])
    : undefined;
}

export function positionTrades(root: RootState): HistoryTrade[] {
  const { droid } = root;
  const lastBuy = (trade: HistoryTrade) => trade.side === "0";
  const index = droid.trades?.findIndex(lastBuy) || 0;
  let positionTrades = droid.trades ? droid.trades.slice(0, index + 1) : [];
  return positionTrades.map((trade) => {
    return {
      side: trade.side === "0" ? "Buy" : "Sell",
      token0: droid.quoteDbToken?.symbol || "",
      token1: findToken(root, trade.token1)?.symbol || "",
      amount0: trade.amount0,
      amount1: trade.amount1,
      blockNumber: trade.blockNumber,
      trx: trade.trx,
    };
  });
}

export function gaugePercent(root: RootState) {
  const { droid } = root;
  if (
    droid.position?.stopLoss === undefined ||
    droid.lastAmount === undefined ||
    droid.lastAmount === "0"
  )
    return 0;
  let target = new bigDecimal(droid.position?.targets[2]);
  let stopLoss = new bigDecimal(droid.position?.stopLoss);
  let range = target.subtract(stopLoss);
  if (range.getValue() === "0") return 0;
  let place = new bigDecimal(droid.lastAmount).subtract(stopLoss);
  let percent = place.divide(range, 2).getValue();
  return parseFloat(percent);
}

export function calcPrice(state: DroidStatus, lastAmount: string): string {
  try {
    if (
      state.position?.initialAmountIn === undefined ||
      lastAmount === undefined ||
      lastAmount === "0"
    )
      return "N/A";
    return new bigDecimal(lastAmount)
      .divide(new bigDecimal(state.position?.initialAmountIn), 2)
      .getValue()
      .toString();
  } catch (error) {
    console.error(error);
    return "-1";
  }
}

const slice = createSlice({
  name: "droidStatus",
  initialState,
  reducers: {
    setPosition(state, action: PayloadAction<Position>) {
      state.position = action.payload;
    },
    setConfig(state, action: PayloadAction<BotConfig>) {
      state.config = action.payload;
    },
    setBalances(state, action: PayloadAction<MrERC20Balance[]>) {
      state.balances = action.payload;
    },
    setLastAmount(state, action: PayloadAction<string>) {
      state.lastAmount = action.payload;
    },
    setTrades(state, action: PayloadAction<HistoryTrade[]>) {
      state.trades = action.payload;
    },
    setBotAddress(state, action: PayloadAction<string>) {
      state.botAddress = action.payload;
    },
    setQuoDbToken(state, action: PayloadAction<DbToken>) {
      state.quoteDbToken = action.payload;
    },
  },
});

// change state
export function quoteToken(store: RootState) {
  const { droid } = store;
  return (dispatch: AppDispatch, getState: () => RootState) => {
    if (droid.quoteDbToken) {
      return droid.quoteDbToken;
    }
    if (droid.config?.quoteAsset) {
      dispatch(
        slice.actions.setQuoDbToken(findToken(store, droid.config?.quoteAsset))
      );
    }
  };
}

export const {
  setBotAddress,
  setTrades,
  setLastAmount,
  setConfig,
  setPosition,
  setBalances,
} = slice.actions;
export { slice as droidStatusSlice };
