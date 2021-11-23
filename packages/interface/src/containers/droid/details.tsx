import { Grid } from '@mui/material';
import { useEffect } from 'react';
import * as React from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { active as isActive, setBalances, setConfig, setLastAmount, setPosition, setTrades } from '../../slices/droidStatus';
import { configFromArray } from '../../utils/BotConfig';
import { positionFromArray } from '../../utils/Position';
import { TradeComplete, tradeTradeComplete } from '../../utils/tradeEvent';
import { Chart } from './chart';
import { ConfigCard } from './configCard';
import { Edit } from './edit';
import { Position } from './position';

export const DroidStatus = () => {
  const dispatch = useAppDispatch();
  const network = useAppSelector((state) => state.app.network);
  const { botAddress, position, config, balances } = useAppSelector(
    (state) => state.droid
  );
  const active = useAppSelector((state) => isActive(state.droid));
  const [editOpen, setEditDialogOpen] = React.useState(
    botAddress.toString() === "0x0000000000000000000000000000000000000000"
  );

  const handleEditClose = () => {
    if (botAddress) {
      setEditDialogOpen(false);
    }
    fetchBotData();
  };

  function fetchBotData() {
    console.log(new Date().toTimeString());

    fetch(`http://localhost:8000/config?address=${botAddress}&chain=${network}`)
      .then((res) => res.json())
      .then((_config) => {
        if (!_config || JSON.stringify(_config) !== JSON.stringify(config)) {
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

  return (
    // will update it with the grid css later.
    botAddress &&
      botAddress !== "" &&
      botAddress !== "0x0000000000000000000000000000000000000000" ? (
      <div>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {active && (
              <Grid item xs={12} md={6}>
                <Position />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <ConfigCard />
              <Chart />
            </Grid>
          </Grid>
        </Grid>
      </div>
    ) : (
      // <div>

      //   <Gauge />
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
