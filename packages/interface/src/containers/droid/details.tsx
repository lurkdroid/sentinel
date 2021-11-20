import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { Link } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import managerAbi from "@solidroid/core/deployed/unknown/SoliDroidManager.json";
import { ethers } from "ethers";
import { useEffect } from "react";
import * as React from "react";
import GaugeChart from "react-gauge-chart";

import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Sell } from "../../services/botServices";
import {
  active as isActive,
  averageBuyPrice as getAverageBuyPrice,
  averageSellPrice as getAverageSellPrice,
  baseAmount as getBaseAmount,
  baseAssetImage as getBaseAssetImage,
  baseAssetName as getBaseAssetName,
  defaultAmount as getDefaultAmount,
  gaugePercent as getGaugePercent,
  lastPrice as getLastPrice,
  positionTrades as getPositionTrades,
  profit as getProfit,
  quoteAmount as getQuoteAmount,
  quoteAssetBalance as getQuoteAssetBalance,
  quoteAssetImage as getQuoteAssetImage,
  quoteAssetName as getQuoteAssetName,
  quoteToken as getQuoteToken,
  setBalances,
  setBotAddress,
  setConfig,
  setLastAmount,
  setPosition,
  setTrades,
  status as getStatus,
  stopLossPercent as getStopLossPercent,
  stopLossPrice as getStopLossPrice,
  targetPrice as getTargetPrice,
  targetSold as getTargetSold,
  timeEntered as getTimeEntered,
  usdProfit as getUsdProfit,
} from "../../slices/droidStatus";
import { configFromArray } from "../../utils/BotConfig";
import { managerAddress } from "../../utils/data/sdDatabase";
import { positionFromArray } from "../../utils/Position";
import { TradeComplete, tradeTradeComplete } from "../../utils/tradeEvent";
import { TradeHistoryUtils } from "../../utils/TradeHistoryUtils";
import { Withdraw } from "./withdraw";
import { BuyDialog } from "./buy";
import { Edit } from "./edit";
import { ToDateTimeStr } from "../../utils/TimeUtil";

export const DroidStatus = () => {
  // dispatcher
  const dispatch = useAppDispatch();
  // use app selector to get the data from redux
  const networkName = useAppSelector((state) => state.app.network);

  const thUtil = new TradeHistoryUtils();
  thUtil.setNetwork(networkName);

  const {
    stopLossPercent,
    stopLossPrice,
    active,
    status,
    averageBuyPrice,
    averageSellPrice,
    targetPrice,
    targetSold,
    profit,
    lastPrice,
    quoteAmount,
    quoteAssetBalance,
    quoteAssetImage,
    quoteAssetName,
    baseAmount,
    baseAssetImage,
    baseAssetName,
    positionTrades,
    timeEntered,
    usdProfit,
    defaultAmount,
    gaugePercent,
  } = useAppSelector((state) => {
    return {
      gaugePercent: getGaugePercent(state),
      defaultAmount: getDefaultAmount(state.droid),
      usdProfit: getUsdProfit(state.droid),
      timeEntered: getTimeEntered(state.droid),
      positionTrades: getPositionTrades(state),
      quoteAmount: getQuoteAmount(state.droid),
      quoteAssetBalance: getQuoteAssetBalance(state),
      quoteAssetImage: getQuoteAssetImage(state),
      quoteAssetName: getQuoteAssetName(state),
      quoteToken: getQuoteToken(state),
      baseAmount: getBaseAmount(state),
      baseAssetImage: getBaseAssetImage(state),
      baseAssetName: getBaseAssetName(state),
      stopLossPercent: getStopLossPercent(state.droid),
      stopLossPrice: getStopLossPrice(state.droid),
      profit: getProfit(state.droid),
      lastPrice: getLastPrice(state.droid),
      active: isActive(state.droid),
      status: getStatus(state.droid),
      averageBuyPrice: getAverageBuyPrice(state.droid),
      averageSellPrice: getAverageSellPrice(state.droid),
      targetPrice: getTargetPrice(state.droid),
      targetSold: getTargetSold(state.droid),
    };
  });

  const { botAddress, position, config, balances } = useAppSelector(
    (state) => state.droid
  );

  ///////  dialogs /////////
  // const dialogRef = React.useRef(null);
  const [buyOpen, setBuyDialogOpen] = React.useState(false);
  const [withdrawOpen, setWithdrawDialogOpen] = React.useState(false);
  const [editOpen, setEditDialogOpen] = React.useState(false);

  const handleBuyOpen = () => {
    setBuyDialogOpen(true);
  };

  const handleBuyClose = () => {
    setBuyDialogOpen(false);
    fetchBotData();
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
    setEditDialogOpen(false);
    fetchBotData();
  };

  //FIXME add progress
  const handleSell = () => {
    Sell(botAddress).subscribe(
      (tx) => {
        console.log({ tx });
        fetchBotData();
      },
      (err) => {
        console.log("error: " + JSON.stringify(err));
        // this.errorMessage = "Registration Failed, " + err.error.errorMessage;
        return;
      }
    );
  };

  const theApp = useAppSelector((state) => state.app);
  let network = theApp.network;

  function fetchBotData() {
    console.log(new Date().toTimeString());
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider
        .getNetwork()
        //FIXME check if metamask connected !!
        // .catch((err) => {
        //   console.error(err);
        //   return;
        // })
        .then((network) => {
          return network.name;
        })
        .then((network) => {
          const manager = new ethers.Contract(
            managerAddress(network),
            managerAbi.abi,
            provider.getSigner()
          );
          return manager.getBot();
        })
        .then((address) => {
          // console.warn(`manager getBot : @${address}@`);
          if (address === "0x0000000000000000000000000000000000000000") {
            // alert("please create a bot !");
            return;
          }
          if (botAddress !== address) {
            dispatch(setBotAddress(address));
          }
          fetch(
            `http://localhost:8000/config?address=${address}&chain=${network}`
          )
            .then((res) => res.json())
            .then((_config) => {
              if (
                !_config ||
                JSON.stringify(_config) !== JSON.stringify(config)
              ) {
                dispatch(setConfig(configFromArray(_config)));
              }
            })
            .catch((err) => console.error(err));

          fetch(
            `http://localhost:8000/position?address=${address}&chain=${network}`
          )
            .then((res) => res.json())
            .then((_position) => {
              if (position !== _position[0]) {
                dispatch(setPosition(positionFromArray(_position[0])));
                dispatch(setLastAmount(_position[1]));
              }
            })
            .catch((err) => console.error(err));

          fetch(
            `http://localhost:8000/events?address=${address}&chain=${network}`
          )
            .then((res) => res.json())
            .then((_events: Array<TradeComplete>) => {
              dispatch(setTrades(_events.map(tradeTradeComplete).reverse()));
            })
            .catch((err) => console.error(err));

          //fetch bot token balances
          fetch(
            `https://deep-index.moralis.io/api/v2/${address}/erc20?chain=polygon`,
            {
              headers: {
                "Content-Type": "application/json",
                "X-API-Key":
                  "LyC81hs3WmiDUv30rSBfQHH4zZPcq3tRGMYOPWCKoeU0eKOYxYhZHRjBUJNGd93R",
              },
            }
          )
            .then((res) => res.json())
            .then((_balances) => {
              if (balances !== _balances) {
                dispatch(setBalances(_balances));
              }
            })
            .catch((err) => console.error(err));
        });
    } catch (e) {
      console.log("error getting provider or manager", e);
    }
  }

  useEffect(() => {
    fetchBotData();
    const nIntervId = setInterval(fetchBotData, 60 * 1000);
    return () => {
      try {
        clearInterval(nIntervId);
      } catch (error) {}
    };
  }, []);

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
            Give Buy Signal
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
              onClick={handleWithdrawOpen}
              disabled={true}
            >
              Deposit
            </Button>
          </div>
        </div>
      )
    );
  };

  const renderBotInformation = () => {
    return (
      active && (
        <div className="sd-group">
          <div className="cb-rect-title">Price Data</div>
          <div className="list-items cb-rect-items">
            <div>Average Buy price:</div>
            <div>{averageBuyPrice}</div>
            <div>Average Sell price:</div>
            <div>{averageSellPrice}</div>
            <div>Last price:</div>
            <div className="price">{lastPrice}</div>
            <div>Next target:</div>
            <div className="target">{targetPrice}</div>
            <div>Stop Loss:</div>
            <div className="sl">{stopLossPrice}</div>
          </div>
        </div>
      )
    );
  };

  const renderActivePosition = () => {
    return (
      <div className="sd-group">
        <div className="cb-rect-title">Active Position</div>
        <div className="list-items cb-rect-items">
          <div>Trading Pair:</div>
          <div className="flex flex-row items-center justify-between">
            <img className="sm-24" src={quoteAssetImage} alt={quoteAssetName} />{" "}
            <span>{quoteAssetName}</span>
            <img
              className="sm-24"
              src={baseAssetImage}
              alt={baseAssetName}
            />{" "}
            <span> {baseAssetName} </span>
          </div>
          <div>Current Quote Amount :</div>
          <div>{quoteAmount}</div>
          <div>Current Base Amount:</div>
          <div>{baseAmount}</div>
          <div>Time Entered:</div>
          <div>{timeEntered}</div>
          <div className="">
            <TableContainer component={Paper}>
              <Table
                // sx={{ minWidth: 550 }}
                size="small"
                aria-label="position trades"
                className=""
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Side</TableCell>
                    <TableCell align="right">Time</TableCell>
                    {/* <TableCell align="right">{baseAssetName}</TableCell> */}
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Transaction</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {positionTrades.map((row) => (
                    <TableRow
                      key={row.tradeTime}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.side}
                      </TableCell>
                      {/* <TableCell align="right">{row.token0}</TableCell> */}
                      <TableCell align="right">
                        {ToDateTimeStr(row.tradeTime)}
                      </TableCell>
                      <TableCell align="right">{}</TableCell>
                      <TableCell align="right">
                        {thUtil.tradeAmount(row)}
                      </TableCell>
                      <TableCell align="right">
                        <Link href={thUtil.transaction(row)} target="_blank">
                          {row.trx}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderProfitPosition = () => {
    return (
      <div className="sd-group">
        <div className="cb-rect-title">Position Profit</div>
        <div className="list-items cb-rect-items">
          <div>Current Profit %:</div>
          <div>{profit}</div>
          <div>Current Profit $:</div>
          <div>{usdProfit}</div>
          <div>Current Quote Amount :</div>
          <div>{quoteAmount}</div>
          <div>Current Base Amount:</div>
          <div>{baseAmount}</div>
          <div>Targets Sold:</div>
          <div>{targetSold}</div>
        </div>
      </div>
    );
  };
  const renderPosition = () => {
    return (
      active && (
        <div className="flex flex-row justify-around w-full">
          {renderActivePosition()}
          {renderProfitPosition()}
        </div>
      )
    );
  };

  const renderGaugeChart = () => {
    return (
      active && (
        <div className="w-1/4">
          <GaugeChart
            id="gauge-chart5"
            animate={false}
            nrOfLevels={4}
            arcsLength={[0.25, 0.25, 0.25, 0.25]}
            colors={["#EA4228", "#5BE12C", "#38C71B", "#266D17"]}
            percent={gaugePercent}
            arcPadding={0.02}
          />
        </div>
      )
    );
  };

  return (
    // will update it with the grid css later.
    botAddress &&
      botAddress != "" &&
      botAddress !== "0x0000000000000000000000000000000000000000" ? (
      <div className="flex flex-row flex-wrap justify-start font-extrabold">
        <div className="flex flex-row justify-around w-full">
          <div className="sd-group">
            <div className="cb-rect-title">Bot Configuration</div>
            <div className="list-items cb-rect-items">
              <div>Status:</div>
              <div>{status}</div>
              <div>Quote Asset:</div>
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
              <div>Default Amount:</div>
              <div>{defaultAmount}</div>
              <div>Default Amount Only:</div>
              <div>True</div>
              {/* <div>{config?.defaultAmountOnly?.toString()}</div> */}
              <div>Stop Loss Percent:</div>
              <div>%{stopLossPercent}</div>
              <div>Loop:</div>
              <div>True</div>
              <div>Bot address</div>
              <div>
                <Link
                  href={`https://polygonscan.com/address/${botAddress}`}
                  target="_blank"
                >
                  {botAddress}
                </Link>
              </div>
              {renderPositionAction()}
              {renderWithdrawAction()}
            </div>
          </div>
          {renderBotInformation()}
        </div>

        {renderPosition()}
        {renderGaugeChart()}
        <div>
          <Edit
            open={editOpen}
            handleClose={handleEditClose}
            network={networkName}
          />
        </div>
        <div>
          {balances.length > 0 && (
            <Withdraw
              open={withdrawOpen}
              handleClose={handleWithdrawClose}
              network={networkName}
              // balances={balances}
              // botAddress={botAddress}
            />
          )}
        </div>
        <div>
          {config && (
            <BuyDialog
              open={buyOpen}
              handleClose={handleBuyClose}
              network={networkName}
            />
          )}
        </div>
      </div>
    ) : (
      <div>no bot for this account, please create bot configuration</div>
    )
  );
};
