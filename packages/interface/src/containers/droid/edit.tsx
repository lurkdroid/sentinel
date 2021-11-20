import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { maxHeight } from '@mui/system';

import { useAppSelector } from '../../hooks/redux';
import { createConfig, editConfig } from '../../services/botServices';
import { managerAddress } from '../../utils/data/sdDatabase';
import { ConfigForm } from './configFrom';

export interface EditConfig {
  open: boolean,
  handleClose: () => void,
  network: string,
  create?: boolean
}

export const Edit = ({ handleClose, open, network, create = false }: EditConfig) => {
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
    if(create){
      createConfig({
        stopLossPercent,
        defaultAmount,
        looping,
        token
      },
      managerAddress, 
      network).subscribe((tx) => {
        console.log("tx edit config", {tx})
        handleClose()
      })
    } else {

      editConfig({
        stopLossPercent,
        defaultAmount,
        looping,
        token
      },botAddress).subscribe((tx) => {
        console.log("tx edit config", {tx})
        handleClose()
      })
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
        <DialogTitle>{create ? 'Create DROID' :'Edit configuration'}</DialogTitle>
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
          <Button onClick={handleSubmit}>{create ? 'CREATE':'UPDATE'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}