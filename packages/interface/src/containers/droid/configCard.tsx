import {
  Avatar,
  Button,
  Divider,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import * as React from "react";

import { useAppSelector } from "../../hooks/redux";
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
} from "../../slices/droidStatus";
import { BuyDialog } from "./buy";
import { Deposit } from "./deposit";
import { Edit } from "./edit";
import { Withdraw } from "./withdraw";
import { formatAmount } from "../../utils/FormatUtil";
import { USD } from "../../utils/USD";

export const ConfigCard = () => {
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
    botAddress.toString() == "0x0000000000000000000000000000000000000000"
  );
  const [depositOpen, setDepositDialogOpen] = React.useState(false);

  const handleBuyOpen = () => {
    setBuyDialogOpen(true);
  };

  const handleBuyClose = () => {
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
    return " ($" + formatAmount(usd.usdValue(prices, symbol, amount), 4) + ")";
  };

  const renderSellAction = () => {
    return (
      active && (
        <Button variant="outlined" onClick={handleSell}>
          Sell Position
        </Button>
      )
    );
  };

  const renderPositionAction = () => {
    return (
      !active && (
        <div className=" display: flex;flex-direction: row; flex-wrap: wrap; width: 100%;">
          <Button
            variant="outlined"
            onClick={handleBuyOpen}
            disabled={quoteAssetBalance === "0.0" || quoteAssetBalance === "0"}
          >
            Open Position
          </Button>
          <Button variant="outlined" onClick={handleEditOpen}>
            Edit Configuration
          </Button>
        </div>
      )
    );
  };

  const renderWithdrawAction = () => {
    return (
      !active && (
        <div className=" display: flex;flex-direction: row; flex-wrap: wrap; width: 100%; ">
          <Button
            variant="outlined"
            onClick={handleWithdrawOpen}
            disabled={!balances || !balances.length || balances.length < 1}
          >
            Withdraw
          </Button>

          <Button
            variant="outlined"
            onClick={handleDepositOpen}
            disabled={!botAddress}
          >
            Deposit
          </Button>
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
          <ListItem>
            <Tooltip title="status">
              <ListItemText primary="Status" secondary={status} />
            </Tooltip>
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemAvatar>
              <Avatar
                alt={quoteAssetName}
                src={quoteAssetImage}
                sx={{ width: 24, height: 24 }}
              />
            </ListItemAvatar>
            <ListItemText primary="Main asset" secondary={quoteAssetName} />
            <ListItemText
              primary="Balance"
              secondary={
                formatAmount(quoteAssetBalance, 6) +
                dollarValue(quoteAssetSymbol, quoteAssetBalance)
              }
            />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText
              primary="Default Amount"
              secondary={
                defaultAmount + dollarValue(quoteAssetSymbol, defaultAmount)
              }
            />
            <ListItemText primary="Default Amount Only" secondary="True" />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText
              primary="Stop Loss Percent"
              secondary={stopLossPercent + " %"}
            />
            <ListItemText primary="Trailing Stop Loss" secondary="False" />
          </ListItem>
          <Divider component="li" />
          <ListItem>
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
          <Divider component="li" />
        </List>
        {renderSellAction()}
        {renderPositionAction()}
        {renderWithdrawAction()}
        {/* </Grid> */}
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
