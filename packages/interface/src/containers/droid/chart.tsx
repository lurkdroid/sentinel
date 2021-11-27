import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, ReferenceLine } from "recharts";

import { useAppSelector } from "../../hooks/redux";
import {
  active as isActive,
  baseAssetSymbol as getBaseAssetSymbol,
  quoteAssetSymbol as getQuoteAssetSymbol,
  stopLossPrice as getStopLossPrice,
  targetPrice as getTargetPrice,
} from "../../slices/droidStatus";
import { toTimeStr } from "../../utils/FormatUtil";
import bigDecimal from "js-big-decimal";

export const Chart = () => {
  const {
    stopLossPrice,
    active,
    targetPrice,
    quoteAssetSymbol,
    baseAssetSymbol,
  } = useAppSelector((state) => {
    return {
      stopLossPrice: getStopLossPrice(state),
      active: isActive(state.droid),
      targetPrice: getTargetPrice(state),
      quoteAssetSymbol: getQuoteAssetSymbol(state),
      baseAssetSymbol: getBaseAssetSymbol(state),
    };
  });

  const [data, setDate] = useState([]);

  function load() {
    console.log("CHART LOADING..." + new Date().toString());
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

    fetch(`/api/klines?symbol=${baseSymbol}USDT`)
      .then((res) => {
        return res.json();
      })
      .then((_baseData: any[]) => {
        fetch(`/api/klines?symbol=${quoteSymbol}USDT`)
          .then((res) => {
            return res.json();
          })
          .then((_quoteData: any[]) => {
            _baseData = _baseData.slice(_baseData.length - 50);
            _quoteData = _quoteData.slice(_quoteData.length - 50);
            var chartData = _baseData.map(function (tick, i) {
              return [
                tick[0],
                new bigDecimal(tick[4])
                  .divide(new bigDecimal(_quoteData[i][4]), 8)
                  .getValue(),
              ];
            });
            console.log(chartData);

            setDate(chartData);
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
            minTickGap={70}
            tickFormatter={toTimeStr}
          />
          <YAxis type="number" domain={["auto", "auto"]} tickLine={false} />
          <Area
            type="monotone"
            dataKey="1"
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
