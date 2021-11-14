import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { PositionTrades, Trade } from "../../utils/tradeEvent";
import { from, Observable } from "rxjs";
import { TradeHistoryUtils } from "../../utils/TradeHistoryUtils";
import { Link } from "@mui/material";

const thUtil = new TradeHistoryUtils();

const trades: Trade[] = [
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    amount0: "1474354045855806884",
    amount1: "3992",
    blockNumber: 21328417,
  },
  {
    side: "0",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    amount0: "1500000000000000000",
    amount1: "3992",
    blockNumber: 21326682,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "747690569978168266",
    amount1: "1298126",
    blockNumber: 21326611,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "379542509662607351",
    amount1: "649062",
    blockNumber: 21308712,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "378213216274785989",
    amount1: "649062",
    blockNumber: 21305310,
  },
  {
    side: "0",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "1500000000000000000",
    amount1: "2596250",
    blockNumber: 21303114,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    amount0: "1481423274107813527",
    amount1: "549204780642580",
    blockNumber: 21302801,
  },
  {
    side: "0",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    amount0: "1500000000000000000",
    amount1: "549204780642580",
    blockNumber: 21302131,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "1100672675209103842",
    amount1: "1939094",
    blockNumber: 21257753,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "377163599823845296",
    amount1: "646364",
    blockNumber: 21248765,
  },
  {
    side: "0",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "1500000000000000000",
    amount1: "2585458",
    blockNumber: 21246494,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "1098802365732082768",
    amount1: "1954159",
    blockNumber: 21242102,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "377019730612291083",
    amount1: "651386",
    blockNumber: 21239929,
  },
  {
    side: "0",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "1500000000000000000",
    amount1: "2605545",
    blockNumber: 21238064,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "1469255869379241816",
    amount1: "2568842",
    blockNumber: 21237945,
  },
  {
    side: "0",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "1500000000000000000",
    amount1: "2568842",
    blockNumber: 21234824,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "1102496308184253175",
    amount1: "1900133",
    blockNumber: 21234723,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "377252953655541641",
    amount1: "633377",
    blockNumber: 21230661,
  },
  {
    side: "0",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "1500000000000000000",
    amount1: "2533510",
    blockNumber: 21227846,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "771954812017606134",
    amount1: "1328385",
    blockNumber: 21221850,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "385146689978760530",
    amount1: "664192",
    blockNumber: 21221816,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "383038708167157000",
    amount1: "664192",
    blockNumber: 21221780,
  },
  {
    side: "0",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "1500000000000000000",
    amount1: "2656769",
    blockNumber: 21220770,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "771797672531889814",
    amount1: "1387602",
    blockNumber: 21220330,
  },
  {
    side: "1",
    token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    token1: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    amount0: "379929768876484439",
    amount1: "693801",
    blockNumber: 21220052,
  },
];

const rows: PositionTrades[] = [
  {
    positionBlock: 10,
    trades: [
      {
        side: "1",
        token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        token1: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        amount0: "1474354045855806884",
        amount1: "3992",
        blockNumber: 21328417,
        trx: "zxcvbnm",
      },
      {
        side: "0",
        token0: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        token1: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        amount0: "1500000000000000000",
        amount1: "3992",
        blockNumber: 21326682,
        trx: "zxcvbnm",
      },
    ],
  },
];

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

export const History = () => {
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
            <Row positionBlock={row.positionBlock} trades={row.trades} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
