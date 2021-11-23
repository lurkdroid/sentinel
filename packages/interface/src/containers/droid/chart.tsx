import { useAppSelector } from "../../hooks/redux";
import React from "react";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
} from "recharts";
import {
  active as isActive,
  stopLossPrice as getStopLossPrice,
  targetPrice as getTargetPrice,
  quoteAssetSymbol as getQuoteAssetSymbol,
  baseAssetSymbol as getBaseAssetSymbol,
  // quoteAssetName as getQuoteAssetName,
} from "../../slices/droidStatus";

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
      .then((_baseDate: any[]) => {
        // console.warn(_baseDate);
        setDate(_baseDate);
        fetch(`http://localhost:8000/klines?symbol=${quoteSymbol}USDT`)
          .then((res) => {
            return res.json();
          })
          .then((_quoteDate: any[]) => {
            console.warn(_quoteDate);
            console.warn(_baseDate);
            console.warn(_baseDate[0][0]);
            console.warn(_quoteDate[0][0]);

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
      <div className="w-1/4">
        <AreaChart
          width={300}
          height={250}
          data={data}
          stackOffset={"wiggle"}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          {/* <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs> */}
          <XAxis dataKey="0" />
          <YAxis type="number" domain={["auto", "auto"]} />
          <Tooltip />
          <Area type="monotone" dataKey="4" fill="#484888" />
          <ReferenceLine y={56088} stroke="green" />
        </AreaChart>
      </div>
    )
  );
};
