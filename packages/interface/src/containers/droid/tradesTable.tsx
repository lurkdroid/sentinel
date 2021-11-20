import { useAppSelector } from "../../hooks/redux";
import {
  Link,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import { positionTrades as getPositionTrades } from "../../slices/droidStatus";
import { toDateTimeStr, formatAmount } from "../../utils/FormatUtil";
import { TradeHistoryUtils } from "../../utils/TradeHistoryUtils";

export const TradesTable = () => {
  const network = useAppSelector((state) => state.app.network);

  const thUtil = new TradeHistoryUtils();
  thUtil.setNetwork(network);

  const { positionTrades } = useAppSelector((state) => {
    return {
      positionTrades: getPositionTrades(state),
    };
  });

  return (
    <TableContainer component={Paper}>
      <Table
        // sx={{ minWidth: 550 }}
        size="small"
        aria-label="position trades"
        className=""
      >
        <TableHead>
          <TableRow>
            <TableCell align="left">Side</TableCell>
            <TableCell align="left">Time</TableCell>
            <TableCell align="left">Price</TableCell>
            <TableCell align="left">Amount</TableCell>
            <TableCell align="left">Transaction</TableCell>
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
              <TableCell align="right">
                {toDateTimeStr(row.tradeTime)}
              </TableCell>
              <TableCell align="right">
                {formatAmount(thUtil.price(row), 8)}
              </TableCell>
              <TableCell align="right">
                {formatAmount(thUtil.tradeAmount(row), 8)}
              </TableCell>
              <TableCell align="right">
                <Link href={thUtil.transaction(row)} target="_blank">
                  {row.trx.substring(0, 12)}...
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
