import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect } from "react";

import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { createConfig, editConfig } from "../../services/botServices";
import { setAmount, setQuoteAsset, setStopLoss } from "../../slices";
import { managerAddress, getDBTokens } from "../../utils/data/sdDatabase";
import { ConfigForm } from "./configFrom";
import { Deposit } from "./deposit";
import { CustomizedSteppers } from "./stepper";
import { defaultAmount, stopLossPrice } from "../../slices/droidStatus";
import { ethers } from "ethers";
export interface EditConfig {
  open: boolean;
  handleClose: () => void;
  network: string;
  create?: boolean;
}

export const Edit = ({
  handleClose,
  open,
  network,
  create = false,
}: EditConfig) => {
  if (!network) {
    //FIXME please - can get as propety getDBTokens(network)
    console.warn("help.. Withdrow need network");
    network = "matic";
  }

  const step: number = 0;
  const dispatch = useAppDispatch();

  const { defaultAmount, stopLossPercent, looping, token } = useAppSelector(
    (state) => state.formCreate
  );

  const { config } = useAppSelector((state) => state.droid);

  const { botAddress } = useAppSelector((state) => state.droid);

  useEffect(() => {
    if (open) {
      const amount = config.defaultAmount;
      const options = getDBTokens(network).filter((t) => t.isQuote);
      dispatch(
        setAmount(
          ethers.utils.formatUnits(
            ethers.BigNumber.from(amount),
            options[0].decimals
          )
        )
      );
      const sloss = ethers.BigNumber.from(config.stopLossPercent);
      dispatch(setStopLoss(ethers.utils.formatUnits(sloss, 2)));
      dispatch(setQuoteAsset(options[0]));
    }
  }, [open]);

  const handleSubmit = () => {
    console.log("ubmitted edit config");
    if (create) {
      createConfig(
        {
          stopLossPercent,
          defaultAmount,
          looping,
          token,
        },
        managerAddress(network),
        network
      ).subscribe((tx) => {
        console.log("tx create config", { tx });
        handleClose();
      });
    } else {
      editConfig(
        {
          stopLossPercent,
          defaultAmount,
          looping,
          token,
        },
        botAddress
      ).subscribe((tx) => {
        console.log("tx edit config", { tx });
        handleClose();
      });
    }
  };

  const renderStepOrEditConfig = () => {
    switch (step) {
      case 0: {
        return <ConfigForm />;
      }
      case 1: {
        return null;
      }
      case 2: {
        return (
          <Deposit handleClose={() => {}} open={step === 2} network={network} />
        );
      }
      default: {
        return <ConfigForm />;
      }
    }
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 600,
          },
        }}
      >
        {create && <CustomizedSteppers step={0} />}
        <DialogTitle className={"text-center"}>
          {!create && "EDIT configuration"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* <Alert variant="outlined" severity="warning">
              Make sure to set initial amount to match asset
            </Alert> */}
          </DialogContentText>
          <div>{renderStepOrEditConfig()}</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{create ? "CREATE" : "UPDATE"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
