import {
  Avatar,
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
  profit as getProfit,
  quoteAssetSymbol as getQuoteAssetSymbol,
  stopLossPrice as getStopLossPrice,
  targetPrice as getTargetPrice,
  targetSold as getTargetSold,
  usdProfit as getUsdProfit,
} from "../../slices/droidStatus";
import { DetailsScreenUtils } from "../../utils/DetailsScreenUtils";
import { formatAmount } from "../../utils/FormatUtil";
import { USD } from "../../utils/USD";

export const Position = () => {
  const usd = new USD();
  const network = useAppSelector((state) => state.app.network);
  const dUtil = new DetailsScreenUtils(network);

  const {
    stopLossPrice,
    active,
    targetPrice,
    targetSold,
    profit,
    lastPrice,
    quoteAssetSymbol,
    baseAmount,
    baseAssetImage,
    baseAssetName,
    baseAssetSymbol,
    usdProfit,
    positionTrades,
    prices,
  } = useAppSelector((state) => {
    return {
      usdProfit: getUsdProfit(state.droid),
      quoteAssetSymbol: getQuoteAssetSymbol(state),
      baseAmount: getBaseAmount(state),
      baseAssetImage: getBaseAssetImage(state),
      baseAssetName: getBaseAssetName(state),
      baseAssetSymbol: getBaseAssetSymbol(state),
      stopLossPrice: getStopLossPrice(state),
      profit: getProfit(state.droid),
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
      return (
        " ($" + formatAmount(usd.usdValue(prices, symbol, amount), 4) + ")"
      );
    } catch (error) {
      console.error(error);
      return "--";
    }
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
              minWidth: "45px",
            }}
          >
            <ListItem>
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
            <Divider component="li" />
            <ListItem>
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
            <Divider component="li" />
            <ListItem>
              <ListItemText primary="Current Profit %" secondary={profit} />
              <ListItemText primary="Current Profit $" secondary={usdProfit} />
            </ListItem>
            <Divider component="li" />
            <ListItem>
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
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Last price"
                secondary={
                  <span>
                    <div className="price">{formatAmount(lastPrice, 6)}</div>
                    <div>{dollarValue(quoteAssetSymbol, lastPrice)}</div>
                  </span>
                }
              />
              <ListItemText
                primary="Next target"
                secondary={
                  <span>
                    <div className="target">{formatAmount(targetPrice, 6)}</div>
                    <div>{dollarValue(quoteAssetSymbol, targetPrice)}</div>
                  </span>
                }
              />
              <ListItemText
                primary="Stop Loss"
                secondary={
                  <span>
                    <div className="sl">{formatAmount(stopLossPrice, 6)}</div>
                    <div>{dollarValue(quoteAssetSymbol, stopLossPrice)}</div>
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
