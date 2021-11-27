import { Box, Grid, Button } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

import { useEffect } from "react";
import * as React from "react";
import {
  History as HistoryIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
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
// import { Gauge } from "./gauge";
import { SellButton } from "../actionButtons/Sell";
export const DroidStatus = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
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
    return fetch(`/api/prices`)
      .then((res) => res.json())
      .then((_prices) => {
        //  if (_prices && JSON.stringify(_prices) !== JSON.stringify(prices)) {
        const filtered = usd.filterTockens(
          _prices,
          getDBTokens(network).map((token) => token.symbol)
        );
        dispatch(setPrices(filtered));
        // }
      })
      .catch((err) => console.error(err));
  }

  function fetchPosition() {
    console.log("fetch position");

    fetch(`/api/position?address=${botAddress}&chain=${network}`)
      .then((res) => res.json())
      .then((_position) => {
        if (position !== _position[0]) {
          dispatch(setPosition(positionFromArray(_position[0])));
          dispatch(setLastAmount(_position[1]));
        }
      })
      .catch((err) => console.error(err));
  }

  function fetchBotEvents() {
    fetch(`/api/events?address=${botAddress}&chain=${network}`)
      .then((res) => res.json())
      .then((_events: TradeComplete[]) => {
        dispatch(setTrades(_events.map(tradeTradeComplete).reverse()));
      })
      .catch((err) => console.error(err));
  }

  function fetchBalances() {
    console.log(" fetchBalances");
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
        } else {
          console.warn("no balances");
        }
      })
      .catch((err) => console.error(err));
  }

  function fetchBotData() {
    console.log(new Date().toTimeString());

    fetch(`/api/config?address=${botAddress}&chain=${network}`)
      .then((res) => res.json())
      .then((_config) => {
        if (_config && JSON.stringify(_config) !== JSON.stringify(config)) {
          dispatch(setConfig(configFromArray(_config)));
        }
      })
      .catch((err) => console.error(err));

    fetch(`/api/position?address=${botAddress}&chain=${network}`)
      .then((res) => res.json())
      .then((_position) => {
        if (position !== _position[0]) {
          dispatch(setPosition(positionFromArray(_position[0])));
          dispatch(setLastAmount(_position[1]));
        }
      })
      .catch((err) => console.error(err));

    fetch(`/api/events?address=${botAddress}&chain=${network}`)
      .then((res) => res.json())
      .then((_events: Array<TradeComplete>) => {
        dispatch(setTrades(_events.map(tradeTradeComplete).reverse()));
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
    fetchBotEvents();
    const nIntervId = setInterval(fetchBotEvents, 60 * 1000);
    return () => {
      try {
        clearInterval(nIntervId);
      } catch (error) {}
    };
  }, [botAddress]);

  useEffect(() => {
    fetchPrices();
    const nIntervId = setInterval(fetchPrices, 10 * 1000);
    return () => {
      try {
        clearInterval(nIntervId);
      } catch (error) {}
    };
  }, [botAddress, network]);

  useEffect(() => {
    fetchPosition();
    const nIntervId = setInterval(fetchPosition, 5 * 1000);
    return () => {
      try {
        clearInterval(nIntervId);
      } catch (error) {}
    };
  }, [botAddress, network]);

  useEffect(() => {
    fetchBalances();
    const nIntervId = setInterval(fetchBalances, 20 * 1000);
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
      <Box
        sx={{
          marginTop: 5,
          marginLeft: 5,
          marginRight: 5,
          paddingLeft: 5,
          paddingRight: 5,
          justifyContent: "space-between",
        }}
      >
        <div className={"flex  flex-row gap-2 justify-start w-full"}>
          {!["/dashboard"].includes(location.pathname) && (
            <Button
              disabled={["/dashboard", "/"].includes(location.pathname)}
              variant="outlined"
              component={NavLink}
              to={"/dashboard"}
              startIcon={<DashboardIcon />}
            >
              Dashboard
            </Button>
          )}

          <Button
            disabled={["/history", "/"].includes(location.pathname)}
            variant="outlined"
            component={NavLink}
            startIcon={<HistoryIcon />}
            to={"/history"}
          >
            History
          </Button>
          <SellButton />
        </div>
        {/* <Grid>
          <Box className="bg-red">
            <div className="bg-white max-h-10">
              <Gauge />
            </div>
          </Box>
        </Grid> */}
        <Grid container spacing={7}>
          <Grid item xs={6}>
            <ConfigCard />
          </Grid>
          <Grid item xs={6}>
            <Position />
          </Grid>
        </Grid>
        <Grid container spacing={7}>
          <Grid item xs={6}>
            <span>{active && <TradesTable />}</span>
          </Grid>
          <Grid item xs={5}>
            {active && <Chart />}
          </Grid>
        </Grid>
      </Box>
    ) : (
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
