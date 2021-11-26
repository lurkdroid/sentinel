import GaugeChart from "react-gauge-chart";

import { useAppSelector } from "../../hooks/redux";
import {
  active as isActive,
  gaugePercent as getGaugePercent,
} from "../../slices/droidStatus";

export const Gauge = () => {
  const { active, gaugePercent } = useAppSelector((state) => {
    return {
      gaugePercent: getGaugePercent(state),
      active: isActive(state.droid),
    };
  });

  return (
    active && (
      <div className="w-1/4">
        <GaugeChart
          id="gauge-chart5"
          // className="h-1"
          animate={false}
          nrOfLevels={4}
          arcsLength={[0.25, 0.25, 0.25, 0.25]}
          colors={["#EA4228", "#5BE12C", "#38C71B", "#266D17"]}
          percent={gaugePercent}
          arcPadding={0.02}
        />
      </div>
    )
  );
};
