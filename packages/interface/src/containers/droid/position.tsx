import { useAppSelector } from "../../hooks/redux";
import { Tooltip } from "@mui/material";
import { TradesTable } from "./tradesTable";
import {
  active as isActive,
  baseAmount as getBaseAmount,
  baseAssetImage as getBaseAssetImage,
  baseAssetName as getBaseAssetName,
  lastPrice as getLastPrice,
  profit as getProfit,
  quoteAssetName as getQuoteAssetName,
  stopLossPrice as getStopLossPrice,
  targetPrice as getTargetPrice,
  targetSold as getTargetSold,
  usdProfit as getUsdProfit,
  positionTrades as getPositionTrades,
} from "../../slices/droidStatus";
import { DetailsScreenUtils } from "../../utils/detailsScreenUtils";

export const Position = () => {
  const network = useAppSelector((state) => state.app.network);
  const dUtil = new DetailsScreenUtils();
  dUtil.setNetwork(network);

  const {
    stopLossPrice,
    active,
    targetPrice,
    targetSold,
    profit,
    lastPrice,
    quoteAssetName,
    baseAmount,
    baseAssetImage,
    baseAssetName,
    usdProfit,
    positionTrades,
  } = useAppSelector((state) => {
    return {
      usdProfit: getUsdProfit(state.droid),
      quoteAssetName: getQuoteAssetName(state),
      baseAmount: getBaseAmount(state),
      baseAssetImage: getBaseAssetImage(state),
      baseAssetName: getBaseAssetName(state),
      stopLossPrice: getStopLossPrice(state.droid),
      profit: getProfit(state.droid),
      lastPrice: getLastPrice(state.droid),
      active: isActive(state.droid),
      targetPrice: getTargetPrice(state.droid),
      targetSold: getTargetSold(state.droid),
      positionTrades: getPositionTrades(state),
    };
  });

  return (
    active && (
      <div className={`sd-group`}>
        <div className="cb-rect-title">Active Position</div>
        <div className="list-items cb-rect-items">
          <div>
            <Tooltip title={`using ${quoteAssetName} to buy ${baseAssetName}`}>
              <span className="hover:text-white">Trading Asset:</span>
            </Tooltip>
          </div>
          <div className="flex flex-row items-center justify-start">
            <img
              className="m-2 sm-24"
              src={baseAssetImage}
              alt={baseAssetName}
            />{" "}
            <span> {baseAssetName} </span>
          </div>
          <div>Current Base Amount:</div>
          <div>{baseAmount}</div>
          <div>Time Entered:</div>
          <div>{dUtil.positionStartTime(positionTrades)}</div>

          <div>Current Profit %:</div>
          <div>{profit}</div>
          <div>Current Profit $:</div>
          <div>{usdProfit}</div>
          <div>Targets Sold:</div>
          <div>{targetSold}</div>

          <div>Average Buy price:</div>
          <div>{dUtil.aveBuyPrice(positionTrades)}</div>
          <div>Average Sell price:</div>
          <div>{dUtil.aveSellPrice(positionTrades)}</div>
          <div>Last price:</div>
          <div className="price">{lastPrice}</div>
          <div>
            <Tooltip title="Next quote token price target">
              <span className="hover:text-white">Next target:</span>
            </Tooltip>
          </div>
          <div className="target">{targetPrice}</div>
          <div>Stop Loss:</div>
          <div className="sl">{stopLossPrice}</div>

          <div className="">
            <TradesTable />
          </div>
        </div>
      </div>
    )
  );
};
