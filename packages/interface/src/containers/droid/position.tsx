import {
  Avatar,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';

import { useAppSelector } from '../../hooks/redux';
import {
  active as isActive,
  baseAmount as getBaseAmount,
  baseAssetImage as getBaseAssetImage,
  baseAssetName as getBaseAssetName,
  lastPrice as getLastPrice,
  positionTrades as getPositionTrades,
  profit as getProfit,
  quoteAssetName as getQuoteAssetName,
  stopLossPrice as getStopLossPrice,
  targetPrice as getTargetPrice,
  targetSold as getTargetSold,
  usdProfit as getUsdProfit,
} from '../../slices/droidStatus';
import { DetailsScreenUtils } from '../../utils/detailsScreenUtils';
import { Gauge } from './gauge';
import { TradesTable } from './tradesTable';

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
      // <div className={`sd-group`}>
      <Box
        sx={{
          // height: "100%",
          // justifyContent: "space-between",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid item xs={12}>
          <Typography sx={{ mt: 1, mb: 0 }} component="div">
            Active Position
          </Typography>
          <List
            dense={true}
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              minWidth: "55px",
            }}
          >
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt={baseAssetName}
                  src={baseAssetImage}
                  sx={{ width: 24, height: 24 }}
                />
              </ListItemAvatar>
              <Tooltip
                title={`using ${quoteAssetName} to buy ${baseAssetName}`}
              >
                <ListItemText
                  primary="Trading asset"
                  secondary={baseAssetName}
                />
              </Tooltip>
              <ListItemText
                inset
                primary="Current amount"
                secondary={baseAmount}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                inset
                className="w-1/2"
                primary="Time Entered"
                secondary={dUtil.positionStartTime(positionTrades)}
              />
              <ListItemText
                inset
                primary="Current Profit %:"
                secondary={profit}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                inset
                className="w-1/2"
                primary="Target Sold"
                secondary={targetSold}
              />
              <ListItemText
                inset
                primary="Current Profit $:"
                secondary={usdProfit}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                inset
                className="w-1/2"
                primary="Average Buy Price:"
                secondary={dUtil.aveBuyPrice(positionTrades)}
              />
              <ListItemText
                inset
                primary="Average Sell Price:"
                secondary={dUtil.aveSellPrice(positionTrades)}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                inset
                className="w-1/2"
                primary="Last price"
                secondary={lastPrice}
              />
              <Tooltip title="Next quote token price target">
                <ListItemText
                  inset
                  primary="Next target"
                  secondaryTypographyProps={{
                    className: "target",
                  }}
                  secondary={targetPrice}
                />
              </Tooltip>
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                className="w-1/2"
                inset
                primary="Stop Loss"
                secondaryTypographyProps={{
                  className: "sl",
                }}
                secondary={stopLossPrice}
              />
              <ListItemButton component={Gauge} />
            </ListItem>
            <Divider component="li" />
          </List>
        </Grid>
        <TradesTable />
      </Box>
    )
  );
};

// <div className="cb-rect-title">Active Position</div>
// <div className="list-items cb-rect-items items-center">
//  <div>
//   <Tooltip title={`using ${quoteAssetName} to buy ${baseAssetName}`}>
//     <span className="hover:text-white">Trading Asset:</span>
//   </Tooltip>
// </div>
// {/* <div className="flex flex-row items-center justify-start">
//   <img
//     className="m-2 sm-24"
//     src={baseAssetImage}
//     alt={baseAssetName}
//   />{" "}
//   <span> {baseAssetName} </span>
// // </div> */}
//   {/* <div>Current Base Amount:</div>
//   <div>{baseAmount}</div> */}
//   {/* <div>Time Entered:</div>
//   <div>{dUtil.positionStartTime(positionTrades)}</div> */}

//   {/* <div>Current Profit %:</div>
//   <div>{profit}</div> */}
//   {/* <div>Current Profit $:</div>
//   <div>{usdProfit}</div> */}
//   {/* <div>Targets Sold:</div>
//   <div>{targetSold}</div> */}

//   {/* <div>Average Buy price:</div>
//   <div>{dUtil.aveBuyPrice(positionTrades)}</div>
//   <div>Average Sell price:</div>
//   <div>{dUtil.aveSellPrice(positionTrades)}</div> */}
//   {/* <div>Last price:</div>
//   <div className="price">{lastPrice}</div> */}
//   {/* <div>
//     <Tooltip title="Next quote token price target">
//       <span className="hover:text-white">Next target:</span>
//     </Tooltip>
//   </div> */}
//   {/* <div className="target">{targetPrice}</div> */}
//   {/* <div>Stop Loss:</div>
//   <div className="sl">{stopLossPrice}</div> */}

//   {/* <div className="">
//     <TradesTable />
//   </div>
// </div> */}
// </div>
// )
// );
// };
