import { useAppSelector } from "../../hooks/redux";
import {
  Button,
  Link,
  Tooltip,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  ListItemButton,
} from "@mui/material";
import { TradesTable } from "./tradesTable";
import {
  active as isActive,
  baseAmount as getBaseAmount,
  baseAssetImage as getBaseAssetImage,
  baseAssetName as getBaseAssetName,
  baseAssetSymbol as getBaseAssetSymbol,
  lastPrice as getLastPrice,
  profit as getProfit,
  // quoteAssetName as getQuoteAssetName,
  stopLossPrice as getStopLossPrice,
  targetPrice as getTargetPrice,
  targetSold as getTargetSold,
  usdProfit as getUsdProfit,
  positionTrades as getPositionTrades,
  prices as getPrices,
} from "../../slices/droidStatus";
import { Gauge } from "./gauge";

import { DetailsScreenUtils } from "../../utils/detailsScreenUtils";
import { formatAmount } from "../../utils/FormatUtil";
import { USD } from "../../utils/USD";

export const Position = () => {
  const usd = new USD();
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
    // quoteAssetName,
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
      // quoteAssetName: getQuoteAssetName(state),
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
    return " ($" + formatAmount(usd.usdValue(prices, symbol, amount), 4) + ")";
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
              <ListItemText primary="Trading Asset" secondary={baseAssetName} />
              <Gauge />
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
                secondary={dUtil.aveBuyPrice(positionTrades)}
              />
              <ListItemText
                primary="Average Sell price"
                secondary={dUtil.aveSellPrice(positionTrades)}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Last price"
                secondary={
                  <div className="price">{formatAmount(lastPrice, 6)}</div>
                }
              />
              <ListItemText
                primary="Next target"
                secondary={
                  <div className="target">{formatAmount(targetPrice, 6)}</div>
                }
              />
              <ListItemText
                primary="Stop Loss"
                secondary={
                  <div className="sl">{formatAmount(stopLossPrice, 6)}</div>
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
