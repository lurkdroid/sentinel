import {
  Avatar,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useAppSelector } from "../../hooks/redux";
import {
  active as isActive,
  baseAmount as getBaseAmount,
  baseAssetImage as getBaseAssetImage,
  baseAssetName as getBaseAssetName,
  baseAssetSymbol as getBaseAssetSymbol,
  lastPrice as getLastPrice,
  positionTrades as getPositionTrades,
  prices as getPrices,
  // profit as getProfit,
  quoteAssetSymbol as getQuoteAssetSymbol,
  stopLossPrice as getStopLossPrice,
  targetPrice as getTargetPrice,
  targetSold as getTargetSold,
  // usdProfit as getUsdProfit,
} from "../../slices/droidStatus";
import { DetailsScreenUtils } from "../../utils/DetailsScreenUtils";
import { formatAmount } from "../../utils/FormatUtil";
import { USD } from "../../utils/USD";
import { Gauge } from "./gauge";

export const Position = () => {
  const usd = new USD();
  const network = useAppSelector((state) => state.app.network);
  const dUtil = new DetailsScreenUtils(network);

  const {
    stopLossPrice,
    active,
    targetPrice,
    targetSold,
    // profit,
    lastPrice,
    quoteAssetSymbol,
    baseAmount,
    baseAssetImage,
    baseAssetName,
    baseAssetSymbol,
    // usdProfit,
    positionTrades,
    prices,
  } = useAppSelector((state) => {
    return {
      // usdProfit: getUsdProfit(state.droid),
      quoteAssetSymbol: getQuoteAssetSymbol(state),
      baseAmount: getBaseAmount(state),
      baseAssetImage: getBaseAssetImage(state),
      baseAssetName: getBaseAssetName(state),
      baseAssetSymbol: getBaseAssetSymbol(state),
      stopLossPrice: getStopLossPrice(state),
      // profit: getProfit(state.droid),
      lastPrice: getLastPrice(state),
      active: isActive(state.droid),
      targetPrice: getTargetPrice(state),
      targetSold: getTargetSold(state.droid),
      positionTrades: getPositionTrades(state),
      prices: getPrices(state.droid),
    };
  });

  const dollarValue = (symbol: string, amount: string | number) => {
    try {
      if (isNaN(parseFloat(amount.toString()))) return "";
      return (
        " ($" + formatAmount(usd.usdValue(prices, symbol, amount), 4) + ")"
      );
    } catch (error) {
      console.error(error);
      return "--";
    }
  };

  const toSafeNumber = (str: string): number => {
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

  return (
    active && (
      <div>
        <Grid item xs={12}>
          <Typography sx={{ mt: 1, mb: 0 }} component="div">
            Active Position
          </Typography>
          <List
            dense={true}
            sx={{
              width: "100%",
              bgcolor: "background.paper",
            }}
          >
            <ListItem divider={true}>
              <ListItemAvatar>
                <Avatar
                  alt={baseAssetName}
                  src={baseAssetImage}
                  sx={{ width: 24, height: 24 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary="Trading Asset"
                secondary={baseAssetName + dollarValue(baseAssetSymbol, 1)}
              />
              {/* <Gauge /> */}
            </ListItem>
            <ListItem divider={true}>
              <ListItemText
                primary="Time Entered"
                secondary={dUtil.positionStartTime(positionTrades)}
              />
              <ListItemText
                primary="Position Balance"
                secondary={
                  baseAmount + dollarValue(baseAssetSymbol, baseAmount)
                }
              />
              <ListItemText primary="Targets Sold" secondary={targetSold} />
            </ListItem>
            <ListItem divider={true}>
              <ListItemText
                primary="Profit Percent"
                secondary={
                  <span
                    style={
                      toSafeNumber(dUtil.profitPercent(positionTrades)) < 0
                        ? { color: "red", fontWeight: "bold" }
                        : { color: "green", fontWeight: "bold" }
                    }
                  >
                    {dUtil.profitPercent(positionTrades)}%
                  </span>
                }
              />
              <ListItemText
                primary="Profit"
                secondary={
                  <span>
                    <span
                      style={
                        toSafeNumber(dUtil.profit(positionTrades)) < 0
                          ? { color: "red", fontWeight: "bold" }
                          : { color: "green", fontWeight: "bold" }
                      }
                    >
                      {dUtil.profit(positionTrades)}
                    </span>
                    <span>
                      {dollarValue(
                        quoteAssetSymbol,
                        dUtil.profit(positionTrades)
                      )}
                    </span>
                  </span>
                }
              />
              <ListItemText primary="" secondary="" />
            </ListItem>
            <ListItem divider={true}>
              <ListItemText
                primary="Average Buy price"
                secondary={
                  formatAmount(dUtil.aveBuyPrice(positionTrades), 6) +
                  dollarValue(
                    quoteAssetSymbol,
                    dUtil.aveBuyPrice(positionTrades)
                  )
                }
              />
              <ListItemText
                primary="Average Sell price"
                secondary={
                  formatAmount(dUtil.aveSellPrice(positionTrades), 6) +
                  dollarValue(
                    quoteAssetSymbol,
                    dUtil.aveSellPrice(positionTrades)
                  )
                }
              />
              <ListItemText primary="" secondary="" />
            </ListItem>
            <ListItem divider={true}>
              <ListItemText
                primary="Last price"
                secondary={
                  <span>
                    <span className="price">{formatAmount(lastPrice, 6)}</span>
                    <span>{dollarValue(quoteAssetSymbol, lastPrice)}</span>
                  </span>
                }
              />
              <ListItemText
                primary="Next target"
                secondary={
                  <span>
                    <span className="target">
                      {formatAmount(targetPrice, 6)}
                    </span>
                    <span>{dollarValue(quoteAssetSymbol, targetPrice)}</span>
                  </span>
                }
              />
              <ListItemText
                primary="Stop Loss"
                secondary={
                  <span>
                    <span className="sl">{formatAmount(stopLossPrice, 6)}</span>
                    <span>{dollarValue(quoteAssetSymbol, stopLossPrice)}</span>
                  </span>
                }
              />
            </ListItem>
            <Divider component="li" />
          </List>
        </Grid>
      </div>
    )
  );
};
