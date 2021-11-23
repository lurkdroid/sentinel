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
  lastPrice as getLastPrice,
  profit as getProfit,
  quoteAssetName as getQuoteAssetName,
  stopLossPrice as getStopLossPrice,
  targetPrice as getTargetPrice,
  targetSold as getTargetSold,
  usdProfit as getUsdProfit,
  positionTrades as getPositionTrades,
} from "../../slices/droidStatus";
import { Gauge } from "./gauge";

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
              <ListItemText primary="Position Balance" secondary={baseAmount} />
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
              <ListItemText primary="Last price" secondary={lastPrice} />
              <ListItemText primary="Next target" secondary={targetPrice} />
              <ListItemText primary="Stop Loss" secondary={stopLossPrice} />
            </ListItem>
            <Divider component="li" />
          </List>
        </Grid>
      </div>
    )
  );
};
