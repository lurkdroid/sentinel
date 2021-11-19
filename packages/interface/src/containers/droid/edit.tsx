import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { maxHeight } from '@mui/system';

import { useAppSelector } from '../../hooks/redux';
import { editConfig } from '../../services/botServices';
import { ConfigForm } from './configFrom';

export const Edit = ({ handleClose, open, network }) => {
  if (!network) {
    //FIXME please - can get as propety getDBTokens(network)
    console.warn("help.. Withdrow need network");
    network = "matic";
  }

  const {
    defaultAmount,
    stopLossPercent,
    looping,
    token,
  } = useAppSelector((state) => state.formCreate);


  const { botAddress } = useAppSelector((state) => state.droid);

  const handleSubmit = () => {
    console.log("ubmitted edit config")
    editConfig({
      stopLossPercent,
      defaultAmount,
      looping,
      token
    },botAddress).subscribe((tx) => {
      console.log("tx edit config", {tx})
      handleClose()
    })
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
        <DialogTitle>Edit configuration</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* <Alert variant="outlined" severity="warning">
              Make sure to set initial amount to match asset
            </Alert> */}
          </DialogContentText>
          <div>
            <ConfigForm />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
