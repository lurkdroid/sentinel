import * as React from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  HistoryTrade,
  PositionTrades,
  tradeTradeComplete,
} from "../../utils/tradeEvent";
import { TradeHistoryUtils } from "../../utils/TradeHistoryUtils";
import {
  Link,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
} from "@mui/material";

import {
  TradeComplete,
  tradeTradeComplete as eventToTradeRecord,
} from "../../utils/tradeEvent";
import { useAppSelector } from "../../hooks/redux";
import { positionTrades as getPositionTrades } from "../../slices/droidStatus";
import { fontWeight } from "@mui/system";

export const History = () => {
  const network = useAppSelector((state) => state.app.network);

  const thUtil = new TradeHistoryUtils();
  thUtil.setNetwork(network);

  // const { trades } = useAppSelector((state) => state.droid);
  const events = require("../../test-data/events.json");
  let trades = events.map(tradeTradeComplete).reverse();

  function historyTransformer(): PositionTrades[] {
    let rows: PositionTrades[] = [];

    console.warn("====YYYYYYY====");

    console.warn(trades);

    var results = trades.reduce(function (results, trade: HistoryTrade) {
      (results[trade.positionTime] = results[trade.positionTime] || []).push(
        trade
      );
      return results;
    }, {});

    console.warn("====XXXOXXX====");
    console.warn(results);
    for (const key in results) {
      rows.push({ positionTime: +key, trades: results[key] });
    }
    //FIXME
    //remove last position if not finish

    return rows.reverse();
  }

  let rows = historyTransformer();
  console.warn("ROWS:");

  console.warn(rows);

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
            {/* <TableCell align="left">Amount</TableCell> */}
            <TableCell align="left">Time End</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row
              positionTime={row.positionTime}
              trades={row.trades}
              key={row.positionTime}
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
          <TableCell align="left">%{thUtil.percent(row)}</TableCell>
          <TableCell align="left">{thUtil.avePriceBought(row)}</TableCell>
          <TableCell align="left">{thUtil.avePriceSold(row)}</TableCell>
          {/* <TableCell align="left">{thUtil.amount(row)}</TableCell> */}
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
                      <TableRow key={tradeRow.tradeTime}>
                        <TableCell component="th" scope="row">
                          <span
                            style={
                              thUtil.isBuy(tradeRow)
                                ? { color: "green", fontWeight: "bold" }
                                : { color: "red", fontWeight: "bold" }
                            }
                          >
                            {thUtil.side(tradeRow)}
                          </span>
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
