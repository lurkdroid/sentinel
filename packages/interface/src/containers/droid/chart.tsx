import { fabClasses } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useAppSelector } from "../../hooks/redux";
import {
  active as isActive,
  baseAssetSymbol as getBaseAssetSymbol,
  quoteAssetSymbol as getQuoteAssetSymbol,
  stopLossPrice as getStopLossPrice,
  targetPrice as getTargetPrice,
} from "../../slices/droidStatus";
import { toTimeStr } from "../../utils/FormatUtil";

export const Chart = () => {
  const {
    stopLossPrice,
    active,
    targetPrice,
    quoteAssetSymbol,
    baseAssetSymbol,
    // quoteAssetName,
  } = useAppSelector((state) => {
    return {
      stopLossPrice: getStopLossPrice(state.droid),
      active: isActive(state.droid),
      targetPrice: getTargetPrice(state.droid),
      quoteAssetSymbol: getQuoteAssetSymbol(state),
      baseAssetSymbol: getBaseAssetSymbol(state),
      // quoteAssetName: getQuoteAssetName(state),
    };
  });

  const [data, setDate] = useState([]);

  function load() {
    console.warn("LOADING...");
    if (!(quoteAssetSymbol && baseAssetSymbol)) {
      console.warn("chart. missing trading asset info");
      return;
    }

    const baseSymbol = baseAssetSymbol.startsWith("W")
      ? baseAssetSymbol.substring(1)
      : baseAssetSymbol;
    const quoteSymbol = quoteAssetSymbol.startsWith("W")
      ? quoteAssetSymbol.substring(1)
      : quoteAssetSymbol;

    console.warn(baseSymbol);
    console.warn(quoteSymbol);

    // if (baseSymbol === "WBTC")
    fetch(`http://localhost:8000/klines?symbol=${baseSymbol}USDT`)
      .then((res) => {
        return res.json();
      })
      .then((_baseData: any[]) => {
        // console.warn(_baseDate);
        // _baseData.forEach((record) => (record[0] = toTimeStr(record[0])));
        setDate(_baseData);
        fetch(`http://localhost:8000/klines?symbol=${quoteSymbol}USDT`)
          .then((res) => {
            return res.json();
          })
          .then((_quoteDate: any[]) => {
            // console.warn(_quoteDate);
            // console.warn(_baseData);
            // console.warn(_baseData[0][0]);
            // console.warn(_quoteData[0][0]);
            // setDate(_data);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    load();
    const nIntervId = setInterval(load, 60 * 1000);
    return () => {
      try {
        clearInterval(nIntervId);
      } catch (error) {}
    };
  }, [baseAssetSymbol, quoteAssetSymbol]);

  return (
    active && (
      <div className="">
        {/* <ResponsiveContainer width="100%" height="100%"> */}
        <AreaChart
          width={550}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="15%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="0"
            tickLine={false}
            mirror={true}
            minTickGap={70}
            tickFormatter={toTimeStr}
          />
          <YAxis type="number" domain={["auto", "auto"]} tickLine={false} />
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <Tooltip />
          <Area
            type="monotone"
            dataKey="4"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
        {/* </ResponsiveContainer> */}
      </div>
    )
  );
};
