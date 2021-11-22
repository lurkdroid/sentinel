import * as React from "react";
import { Button, Link, Tooltip } from "@mui/material";
import { useAppSelector } from "../../hooks/redux";
import { BuyDialog } from "./buy";
import { Deposit } from "./deposit";
import { Edit } from "./edit";
import { Withdraw } from "./withdraw";
import { Sell } from "../../services/botServices";

import {
  active as isActive,
  defaultAmount as getDefaultAmount,
  quoteAssetBalance as getQuoteAssetBalance,
  quoteAssetImage as getQuoteAssetImage,
  quoteAssetName as getQuoteAssetName,
  status as getStatus,
  stopLossPercent as getStopLossPercent,
} from "../../slices/droidStatus";

export const ConfigCard = () => {
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
  } = useAppSelector((state) => {
    return {
      defaultAmount: getDefaultAmount(state.droid),
      quoteAssetBalance: getQuoteAssetBalance(state),
      quoteAssetImage: getQuoteAssetImage(state),
      quoteAssetName: getQuoteAssetName(state),
      stopLossPercent: getStopLossPercent(state.droid),
      active: isActive(state.droid),
      status: getStatus(state.droid),
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
        // this.errorMessage = "Registration Failed, " + err.error.errorMessage;
        return;
      }
    );
  };

  const renderPositionAction = () => {
    return active ? (
      <div>
        <div className="mt-2">
          <Button variant="outlined" onClick={handleSell}>
            Sell Position
          </Button>
        </div>
      </div>
    ) : (
      <div>
        <div className="mt-2">
          <Button
            variant="outlined"
            onClick={handleBuyOpen}
            disabled={quoteAssetBalance === "0.0" || quoteAssetBalance === "0"}
          >
            Open Position
          </Button>
        </div>
        <div className="mt-2">
          <Button variant="outlined" onClick={handleEditOpen}>
            Edit Configuration
          </Button>
        </div>
      </div>
    );
  };

  const renderWithdrawAction = () => {
    return (
      !active && (
        <div>
          <div className="mt-2">
            <Button
              variant="outlined"
              onClick={handleWithdrawOpen}
              disabled={!balances || !balances.length || balances.length < 1}
            >
              Withdraw
            </Button>
          </div>
          <div className="mt-2">
            <Button
              variant="outlined"
              onClick={handleDepositOpen}
              disabled={!botAddress}
            >
              Deposit
            </Button>
          </div>
        </div>
      )
    );
  };

  return (
    <div>
      <div
        className={`flex flex-row flex-wrap justify-start font-extrabold text-secondary" }`}
      >
        <div className="flex flex-row justify-around w-full">
          <div className="sd-group">
            <div className="cb-rect-title">Bot Configuration</div>
            <div className="list-items cb-rect-items">
              <div>
                <Tooltip title="status">
                  <span className="hover:text-white">Status:</span>
                </Tooltip>
              </div>
              <div>{status}</div>
              <div>
                <Tooltip title="Main asset">
                  <span className="hover:text-white">Quote Asset:</span>
                </Tooltip>
              </div>
              <div className="flex flex-row items-center justify-start">
                <div>{quoteAssetName}</div>
                <div className="ml-2">
                  <img
                    className="sm-24"
                    src={quoteAssetImage}
                    alt={quoteAssetName}
                  />
                </div>
              </div>
              <div>{quoteAssetName} Balance:</div>
              <div>{quoteAssetBalance}</div>
              <div>
                <Tooltip title="Open position with this amount.">
                  <span className="hover:text-white">Default Amount:</span>
                </Tooltip>
              </div>
              <div>{defaultAmount}</div>
              <div>
                <Tooltip title="Should other amounts be used to open positions?">
                  <span className="hover:text-white">Default Amount Only:</span>
                </Tooltip>
              </div>
              <div>False</div>
              <div>
                <Tooltip title="Close position if price drops">
                  <span className="hover:text-white">Stop Loss Percent:</span>
                </Tooltip>
              </div>
              <div>%{stopLossPercent}</div>
              <div>
                <Tooltip title="Continue Trading after reaching targets?">
                  <span className="hover:text-white">Loop:</span>
                </Tooltip>
              </div>
              <div>True</div>
              <div>
                <Tooltip title="Your Solidroid 😃 ">
                  <span className="hover:text-white">Bot address</span>
                </Tooltip>
              </div>
              <div>
                <Link
                  href={`${explorer[network]}${botAddress}`}
                  target="_blank"
                >
                  {botAddress}
                </Link>
              </div>
              {renderPositionAction()}
              {renderWithdrawAction()}
            </div>
          </div>
        </div>
        <div>
          <Edit
            open={editOpen}
            handleClose={handleEditClose}
            network={network}
          />
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
    </div>
  );
};
