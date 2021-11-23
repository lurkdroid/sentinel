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

import { active as isActive } from "../../slices/droidStatus";

export const Chart = () => {
  const [data, setDate] = useState([]);

  function load() {
    console.warn("stackOffset'min75");

    console.warn("LOADING...");

    fetch(`http://localhost:8000/klines?symbol=BTCUSDT`)
      .then((res) => {
        console.log("got res");
        // console.log(res);
        // console.log(res.json());

        return res.json();
      })
      .then((_data: any[]) => {
        console.warn(_data);
        setDate(_data);
      })
      .catch((err) => console.error(err));
  }

  const { active } = useAppSelector((state) => {
    return {
      active: isActive(state.droid),
    };
  });

  useEffect(() => {
    load();
    const nIntervId = setInterval(load, 15 * 1000);
    return () => {
      try {
        clearInterval(nIntervId);
      } catch (error) {}
    };
  }, []);

  return (
    active && (
      <div className="w-1/4">
        <AreaChart
          width={500}
          height={400}
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
          <ReferenceLine y={1.64} stroke="red" />
        </AreaChart>
      </div>
    )
  );
};
