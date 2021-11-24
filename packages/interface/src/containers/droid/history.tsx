import * as React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { HistoryTrade, PositionTrades } from "../../utils/tradeEvent";
import { TradeHistoryUtils } from "../../utils/TradeHistoryUtils";
import { formatAmount } from "../../utils/FormatUtil";
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
} from "@mui/material";
import { useAppSelector } from "../../hooks/redux";

export const History = () => {
  const network = useAppSelector((state) => state.app.network);
  const thUtil = new TradeHistoryUtils();
  thUtil.setNetwork(network);

  const { trades, prices } = useAppSelector((state) => state.droid);

  function historyTransformer(): PositionTrades[] {
    let rows: PositionTrades[] = [];

    var results = trades.reduce(function (results, trade: HistoryTrade) {
      (results[trade.positionTime] = results[trade.positionTime] || []).push(
        trade
      );
      return results;
    }, {});

    for (const key in results) {
      rows.push({ positionTime: +key, trades: results[key] });
    }
    const lastPostionTime = rows.reduce(
      (pt, trade) => (pt = pt > trade.positionTime ? pt : trade.positionTime),
      0
    );
    rows = rows.filter((r) => r.positionTime != lastPostionTime);
    return rows.reverse();
  }

  let rows = historyTransformer();

  return (
    <div>
      <h2>{prices[0].price}</h2>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table" size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Time Start</TableCell>
              <TableCell align="left">Main Asset</TableCell>
              <TableCell align="left">Trade Amount</TableCell>
              <TableCell align="left">Profit</TableCell>
              <TableCell align="left">Percent</TableCell>
              <TableCell align="left">Ave Price Bought</TableCell>
              <TableCell align="left">Ave price Sold</TableCell>
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
    </div>
  );

  function Row(positionTrades: PositionTrades) {
    const row: PositionTrades = positionTrades;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow>
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
          <TableCell align="left">
            <div className="flex flex-row items-center justify-start">
              <img
                className="m-2 sm-18"
                src={thUtil.quoteImage(row)}
                alt={thUtil.quoteName(row)}
              />{" "}
              <span>{thUtil.quoteName(row)}</span>
            </div>
          </TableCell>
          <TableCell align="left">
            <div className="flex flex-row items-center justify-start">
              <img
                className="m-2 sm-18"
                src={thUtil.baseImage(row)}
                alt={thUtil.baseName(row)}
              />
              <span> {thUtil.baseName(row)} </span>
              <span className="m-2">{thUtil.positionAmount(row)} </span>
            </div>
          </TableCell>
          <TableCell align="left">
            <span
              style={
                thUtil.profit(row) < 0
                  ? { color: "red" }
                  : { color: "green", fontWeight: "bold" }
              }
            >
              {formatAmount(thUtil.profit(row), 6)}
            </span>
          </TableCell>
          <TableCell align="left">
            <span
              style={
                thUtil.profit(row) < 0
                  ? { color: "red", fontWeight: "bold" }
                  : { color: "green", fontWeight: "bold" }
              }
            >
              {thUtil.percent(row)}%
            </span>
          </TableCell>
          <TableCell align="left">
            <div className="flex flex-row items-center justify-start">
              <span>{thUtil.avePriceBought(row)}</span>
            </div>
          </TableCell>
          <TableCell align="left">
            <div className="flex flex-row items-center justify-start">
              <span>{thUtil.avePriceSold(row)}</span>
            </div>
          </TableCell>
          <TableCell align="left">{thUtil.timeEnd(row)}</TableCell>
        </TableRow>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
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
                          {thUtil.side(tradeRow)}
                        </TableCell>
                        <TableCell align="left">
                          {thUtil.date(tradeRow)}
                        </TableCell>
                        <TableCell align="left">
                          <div className="flex flex-row items-center justify-start">
                            <img
                              className="m-1 sm-12"
                              src={thUtil.image(tradeRow.token1)}
                              alt={thUtil.name(tradeRow.token1)}
                            />
                            <span> {thUtil.tradeAmount(tradeRow)}</span>
                          </div>
                        </TableCell>
                        <TableCell align="left">
                          <div className="flex flex-row items-center justify-start">
                            <img
                              className="m-1 sm-12"
                              src={thUtil.image(tradeRow.token0)}
                              alt={thUtil.name(tradeRow.token0)}
                            />
                            <span> {thUtil.price(tradeRow)}</span>
                          </div>
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
