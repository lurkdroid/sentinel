import {
  Avatar,
  Button,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import * as React from "react";

import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { Sell } from "../../services/botServices";
import {
  active as isActive,
  defaultAmount as getDefaultAmount,
  quoteAssetBalance as getQuoteAssetBalance,
  quoteAssetImage as getQuoteAssetImage,
  quoteAssetName as getQuoteAssetName,
  quoteAssetSymbol as getQuoteAssetSymbol,
  status as getStatus,
  stopLossPercent as getStopLossPercent,
  prices as getPrices,
  setTrades,
} from "../../slices/droidStatus";
import { BuyDialog } from "./buy";
import { Deposit } from "./deposit";
import { Edit } from "./edit";
import { Withdraw } from "./withdraw";
import { formatAmount } from "../../utils/FormatUtil";
import { USD } from "../../utils/USD";
import { width } from "@mui/system";

export const ConfigCard = () => {
  const dispatch = useAppDispatch();
  const usd = new USD();
  const { botAddress, config, balances } = useAppSelector(
    (state) => state.droid
  );
  const { explorer } = useAppSelector((state) => state.app);
  const network = useAppSelector((state) => state.app.network);

  const {
    stopLossPercent,
    active,
    status,
    quoteAssetBalance,
    quoteAssetImage,
    quoteAssetName,
    defaultAmount,
    quoteAssetSymbol,
    prices,
  } = useAppSelector((state) => {
    return {
      defaultAmount: getDefaultAmount(state.droid),
      quoteAssetBalance: getQuoteAssetBalance(state),
      quoteAssetImage: getQuoteAssetImage(state),
      quoteAssetName: getQuoteAssetName(state),
      quoteAssetSymbol: getQuoteAssetSymbol(state),
      stopLossPercent: getStopLossPercent(state.droid),
      active: isActive(state.droid),
      status: getStatus(state.droid),
      prices: getPrices(state.droid),
    };
  });

  //======= dialogs handlers
  const [buyOpen, setBuyDialogOpen] = React.useState(false);
  const [withdrawOpen, setWithdrawDialogOpen] = React.useState(false);
  const [editOpen, setEditDialogOpen] = React.useState(
    botAddress.toString() === "0x0000000000000000000000000000000000000000"
  );
  const [depositOpen, setDepositDialogOpen] = React.useState(false);

  const handleBuyOpen = () => {
    setBuyDialogOpen(true);
  };

  const handleBuyClose = () => {
    dispatch(setTrades([]));
    setBuyDialogOpen(false);
    // fetchBotData();
  };

  const handleWithdrawOpen = () => {
    setWithdrawDialogOpen(true);
  };

  const handleWithdrawClose = () => {
    setWithdrawDialogOpen(false);
  };
  const handleEditOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    if (botAddress) {
      setEditDialogOpen(false);
    }
    // fetchBotData();
  };
  const handleDepositOpen = () => {
    if (botAddress) {
      setDepositDialogOpen(true);
    }
    // fetchBotData();
  };
  const handleDepositClose = () => {
    setDepositDialogOpen(false);
    // fetchBotData();
  };

  //FIXME add progress
  const handleSell = () => {
    Sell(botAddress).subscribe(
      (tx) => {
        console.log({ tx });
        // fetchBotData();
      },
      (err) => {
        console.log("error: " + JSON.stringify(err));
        return;
      }
    );
  };

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

  // const renderSellAction = () => {
  //   return (
  //     active && (
  //       <Button variant="outlined" onClick={handleSell}>
  //         Sell Position
  //       </Button>
  //     )
  //   );
  // };

  const renderAction = () => {
    return (
      !active && (
        <div>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                onClick={handleBuyOpen}
                disabled={
                  quoteAssetBalance === "0.0" || quoteAssetBalance === "0"
                }
                sx={{
                  width: "200px",
                }}
              >
                Open Position
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                onClick={handleEditOpen}
                sx={{
                  width: "200px",
                }}
              >
                Edit Configuration
              </Button>
            </Grid>
          </Grid>
          <div className="mt-2"></div>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                onClick={handleWithdrawOpen}
                disabled={!balances || !balances.length || balances.length < 1}
                sx={{
                  width: "200px",
                }}
              >
                Withdraw
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                onClick={handleDepositOpen}
                disabled={!botAddress}
                sx={{
                  width: "200px",
                }}
              >
                Deposit
              </Button>{" "}
            </Grid>
          </Grid>
        </div>
      )
    );
  };

  return (
    <div>
      <div>
        {/* <Grid item xs={12}> */}
        <Typography sx={{ mt: 1, mb: 0 }} component="div">
          Bot Configuration
        </Typography>
        <List
          dense={true}
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            minWidth: "45px",
          }}
        >
          <ListItem divider={true}>
            <Tooltip title="status">
              <ListItemText primary="Status" secondary={status} />
            </Tooltip>
          </ListItem>
          <ListItem divider={true}>
            <ListItemAvatar>
              <Avatar
                alt={quoteAssetName}
                src={quoteAssetImage}
                sx={{ width: 24, height: 24 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary="Main asset"
              secondary={quoteAssetName + dollarValue(quoteAssetSymbol, 1)}
            />
            <ListItemText
              primary="Balance"
              secondary={
                formatAmount(quoteAssetBalance, 6) +
                dollarValue(quoteAssetSymbol, quoteAssetBalance)
              }
            />
          </ListItem>
          <ListItem divider={true}>
            <ListItemText
              primary="Default Amount"
              secondary={
                defaultAmount + dollarValue(quoteAssetSymbol, defaultAmount)
              }
            />
            <ListItemText primary="Default Amount Only" secondary="True" />
          </ListItem>
          <ListItem divider={true}>
            <ListItemText
              primary="Stop Loss Percent"
              secondary={stopLossPercent + " %"}
            />
            <ListItemText
              primary={
                <span style={{ color: "grey" }}>Trailing Stop Loss</span>
              }
              secondary={<span style={{ color: "grey" }}>false</span>}
            />
          </ListItem>
          <ListItem divider={true}>
            <ListItemText
              primary="Bot address"
              secondary={
                <Link
                  href={`${explorer[network]}${botAddress}`}
                  target="_blank"
                >
                  {botAddress}
                </Link>
              }
            />
          </ListItem>
        </List>
        <Box className="m-2">
          {/* {renderSellAction()} */}
          {renderAction()}
        </Box>
      </div>
      <div>
        <Edit open={editOpen} handleClose={handleEditClose} network={network} />
        {botAddress && (
          <Deposit
            open={depositOpen}
            handleClose={handleDepositClose}
            network={network}
          />
        )}
      </div>
      <div>
        {balances.length > 0 && (
          <Withdraw
            open={withdrawOpen}
            handleClose={handleWithdrawClose}
            network={network}
          />
        )}
      </div>
      <div>
        {config && (
          <BuyDialog
            open={buyOpen}
            handleClose={handleBuyClose}
            network={network}
          />
        )}
      </div>
    </div>
  );
};
