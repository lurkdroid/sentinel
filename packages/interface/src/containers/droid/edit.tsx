import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import { useAppSelector } from '../../hooks/redux';
import { createConfig, editConfig } from '../../services/botServices';
import { managerAddress } from '../../utils/data/sdDatabase';
import { ConfigForm } from './configFrom';
import { Deposit } from './deposit';
import { CustomizedSteppers } from './stepper';

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

  const { defaultAmount, stopLossPercent, looping, token } = useAppSelector(
    (state) => state.formCreate
  );

  const { botAddress } = useAppSelector((state) => state.droid);

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
