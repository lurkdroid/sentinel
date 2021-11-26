import { fabClasses } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
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
      stopLossPrice: getStopLossPrice(state),
      active: isActive(state.droid),
      targetPrice: getTargetPrice(state),
      quoteAssetSymbol: getQuoteAssetSymbol(state),
      baseAssetSymbol: getBaseAssetSymbol(state),
      // quoteAssetName: getQuoteAssetName(state),
    };
  });

  const [data, setDate] = useState([]);

  function load() {
    console.warn("CHART LOADING...");
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

    // if (baseSymbol === "WBTC")
    fetch(`/api/klines?symbol=${baseSymbol}USDT`)
      .then((res) => {
        return res.json();
      })
      .then((_baseData: any[]) => {
        // console.warn(_baseDate);
        // _baseData.forEach((record) => (record[0] = toTimeStr(record[0])));
        setDate(_baseData);
        fetch(`/api/klines?symbol=${quoteSymbol}USDT`)
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
        <AreaChart
          width={550}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="15%" stopColor="#8884d8" stopOpacity={0.5} />
              <stop offset="85%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="0"
            tickLine={false}
            // mirror={true}
            minTickGap={70}
            tickFormatter={toTimeStr}
          />
          <YAxis type="number" domain={["auto", "auto"]} tickLine={false} />
          {/* <Tooltip /> */}
          <Area
            type="monotone"
            dataKey="4"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <ReferenceLine
            y={targetPrice}
            stroke="green"
            alwaysShow={true}
            strokeWidth={2}
          />
          <ReferenceLine y={stopLossPrice} stroke="red" alwaysShow={true} />
        </AreaChart>
      </div>
    )
  );
};
