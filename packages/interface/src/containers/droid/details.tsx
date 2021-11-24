import { Box, Grid } from "@mui/material";
import { useEffect } from "react";
import * as React from "react";

import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  active as isActive,
  setBalances,
  setConfig,
  setLastAmount,
  setPosition,
  setPrices,
  setTrades,
} from "../../slices/droidStatus";
import { configFromArray } from "../../utils/BotConfig";
import { getDBTokens } from "../../utils/data/sdDatabase";
import { positionFromArray } from "../../utils/Position";
import { TradeComplete, tradeTradeComplete } from "../../utils/tradeEvent";
import { USD } from "../../utils/USD";
import { Chart } from "./chart";
import { ConfigCard } from "./configCard";
import { Edit } from "./edit";
import { Position } from "./position";
import { TradesTable } from "./tradesTable";

export const DroidStatus = () => {
  const dispatch = useAppDispatch();
  const network = useAppSelector((state) => state.app.network);
  const { botAddress, position, config, balances, prices } = useAppSelector(
    (state) => state.droid
  );

  const { active } = useAppSelector((state) => {
    return {
      active: isActive(state.droid),
    };
  });

  const [editOpen, setEditDialogOpen] = React.useState(
    botAddress.toString() === "0x0000000000000000000000000000000000000000"
  );

  const handleEditClose = () => {
    if (botAddress) {
      setEditDialogOpen(false);
    }
    fetchBotData();
  };

  const usd = new USD();

  function fetchPrices() {
    console.warn("fatch prices @@@@");

    return fetch(`http://localhost:8000/prices`)
      .then((res) => res.json())
      .then((_prices) => {
        //  if (_prices && JSON.stringify(_prices) !== JSON.stringify(prices)) {
        console.warn("loaded");
        console.warn(_prices);
        const filtered = usd.filterTockens(
          _prices,
          getDBTokens(network).map((token) => token.symbol)
        );
        console.warn("filtered");
        console.warn(filtered);

        dispatch(setPrices(filtered));
        // }
      })
      .catch((err) => console.error(err));
    // };
  }

  function fetchBotData() {
    console.log(new Date().toTimeString());

    fetch(`http://localhost:8000/config?address=${botAddress}&chain=${network}`)
      .then((res) => res.json())
      .then((_config) => {
        if (_config && JSON.stringify(_config) !== JSON.stringify(config)) {
          dispatch(setConfig(configFromArray(_config)));
        }
      })
      .catch((err) => console.error(err));

    fetch(
      `http://localhost:8000/position?address=${botAddress}&chain=${network}`
    )
      .then((res) => res.json())
      .then((_position) => {
        if (position !== _position[0]) {
          dispatch(setPosition(positionFromArray(_position[0])));
          dispatch(setLastAmount(_position[1]));
        }
      })
      .catch((err) => console.error(err));

    fetch(`http://localhost:8000/events?address=${botAddress}&chain=${network}`)
      .then((res) => res.json())
      .then((_events: Array<TradeComplete>) => {
        dispatch(setTrades(_events.map(tradeTradeComplete).reverse()));
      })
      .catch((err) => console.error(err));

    //fetch bot token balances
    fetch(
      `https://deep-index.moralis.io/api/v2/${botAddress}/erc20?chain=polygon`,
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
  }

  useEffect(() => {
    if (botAddress) {
      setEditDialogOpen(false);
    } else {
      setEditDialogOpen(true);
    }
  }, [botAddress]);

  useEffect(() => {
    fetchBotData();
    const nIntervId = setInterval(fetchBotData, 60 * 1000);
    return () => {
      try {
        clearInterval(nIntervId);
      } catch (error) {}
    };
  }, [botAddress, network]);

  useEffect(() => {
    fetchPrices();
    const nIntervId = setInterval(fetchPrices, 10 * 1000);
    return () => {
      try {
        clearInterval(nIntervId);
      } catch (error) {}
    };
  }, [botAddress, network]);

  return (
    // will update it with the grid css later.
    botAddress &&
      botAddress !== "" &&
      botAddress !== "0x0000000000000000000000000000000000000000" ? (
      // <div className="col-span-full">
      <Box
        sx={{
          margin: 5,
          padding: 5,
          justifyContent: "space-between",
        }}
      >
        <Grid container spacing={7}>
          <Grid item xs={5}>
            <ConfigCard />
          </Grid>
          <Grid item xs={7}>
            <Position />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={6}>
            <span>{active && <TradesTable />}</span>
          </Grid>
          <Grid item xs={5}>
            {active && <Chart />}
          </Grid>
        </Grid>
      </Box>
    ) : (
      // </div>
      <div>
        <Edit
          open={editOpen}
          handleClose={handleEditClose}
          network={network}
          create
        />
      </div>
    )
  );
};
