import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { PositionTrades, Trade } from "../../utils/tradeEvent";
import { TradeHistoryUtils } from "../../utils/TradeHistoryUtils";
import { Link } from "@mui/material";
import {
  TradeComplete,
  tradeTradeComplete as eventToTradeRecord,
} from "../../utils/tradeEvent";
import { useAppSelector } from "../../hooks/redux";
import { positionTrades } from "../../slices";

export const History = () => {
  // const theApp = useAppSelector((state) => state.app);
  // let network = theApp.network;
  // console.log(">>>>>>>>>>>>>>>>>>>>" + network);

  const thUtil = new TradeHistoryUtils();

  // const _tradesComplete = require("../../test-data/events.json");

  // const emptyRows: PositionTrades[] = [];

  // const [rows, setRows] = React.useState(emptyRows);

  let rows = historyTransformer();

  const _tradesComplete = require("../../test-data/events.json");

  function historyTransformer(): PositionTrades[] {
    let events: TradeComplete[] = _tradesComplete;

    // function historyTransformer() {
    console.log("historyTransformer");

    // let network = "matic";
    // let address = "0x1af79A9074CeDfec57bcfE8DCAE378b70e9B961f";

    // fetch(`http://localhost:8000/events?address=${address}&chain=${network}`)
    //   .then((res) => res.json())
    //   .then((events: Array<TradeComplete>) => {
    //     // let events: TradeComplete[] = _tradesComplete;
    //     console.log(events);

    //remove partial positon
    const firstBuy = (trade: TradeComplete) => trade.returnValues.side === "0";
    const index = events.findIndex(firstBuy);
    events = events.slice(index);

    let positionTrades: PositionTrades[] = [];
    for (let index = 0; index < events.length; index++) {
      const event = events[index];
      // console.log("event: " + index + " , block " + event.blockNumber);
      if (event.returnValues.side == "0") {
        positionTrades.push({
          positionBlock: event.blockNumber,
          trades: [eventToTradeRecord(event)],
        });
      } else {
        positionTrades[positionTrades.length - 1].trades.push(
          eventToTradeRecord(event)
        );
      }
    }
    console.log(positionTrades);
    // setRows(positionTrades);
    return positionTrades;
  }

  // historyTransformer();
  // useEffect(() => {
  //   console.log("history loading");
  //   historyTransformer();
  // }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Time Start</TableCell>
            <TableCell align="left">Pair</TableCell>
            <TableCell align="left">Profit</TableCell>
            <TableCell align="left">Percent</TableCell>
            <TableCell align="left">Ave Price Bought</TableCell>
            <TableCell align="left">Ave price Sold</TableCell>
            <TableCell align="left">Amount</TableCell>
            <TableCell align="left">Time End</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row
              positionBlock={row.positionBlock}
              trades={row.trades}
              key={row.positionBlock}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  function Row(positionTrades: PositionTrades) {
    const row: PositionTrades = positionTrades;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {thUtil.timeStart(row)}
          </TableCell>
          <TableCell align="left">{thUtil.pair(row)}</TableCell>
          <TableCell align="left">{thUtil.profit(row)}</TableCell>
          <TableCell align="left">{thUtil.percent(row)}</TableCell>
          <TableCell align="left">{thUtil.avePriceBought(row)}</TableCell>
          <TableCell align="left">{thUtil.avePriceSold(row)}</TableCell>
          <TableCell align="left">{thUtil.amount(row)}</TableCell>
          <TableCell align="left">{thUtil.timeEnd(row)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Side</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="left">Amount</TableCell>
                      <TableCell align="left">Price</TableCell>
                      <TableCell align="left">Transaction</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.trades.map((tradeRow) => (
                      <TableRow key={tradeRow.blockNumber}>
                        <TableCell component="th" scope="row">
                          {thUtil.side(tradeRow)}
                        </TableCell>
                        <TableCell align="left">
                          {thUtil.date(tradeRow)}
                        </TableCell>
                        <TableCell align="left">
                          {thUtil.tradeAmount(tradeRow)}
                        </TableCell>
                        <TableCell align="left">
                          {thUtil.price(tradeRow)}
                        </TableCell>
                        <TableCell align="left">
                          <Link
                            href={thUtil.transaction(tradeRow)}
                            target="_blank"
                          >
                            {tradeRow.trx}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
};
