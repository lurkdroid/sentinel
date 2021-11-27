import { Button } from "@mui/material";
import { useAppSelector } from "../../hooks/redux";
import { active as isActive } from "../../slices";
import { Sell } from "../../services/botServices";

export const SellButton = () => {
  const active = useAppSelector((state) => isActive(state.droid));
  const { botAddress } = useAppSelector((state) => state.droid);
  const handleSell = () => {
    Sell(botAddress).subscribe(
      (tx) => {
        console.log({ tx });
        // fetchBotData();
      },
      (err) => {
        console.log("error: " + JSON.stringify(err));
        return;
      }
    );
  };

  return active ? (
    <Button variant="outlined" onClick={handleSell}>
      Sell Position
    </Button>
  ) : null;
};
