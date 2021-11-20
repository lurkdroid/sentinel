import {
  Avatar,
  Card,
  CardContent,
  FormGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { deposit } from "../../services/botServices";
import { setDepositAmount, setDepositToken } from "../../slices/droidForm";
import { DbToken, getDBTokens } from "../../utils/data/sdDatabase";

export const DepositForm = () => {
  const dispatch = useAppDispatch();
  const { token, amount } = useAppSelector(
    (state) => state.formCreate.depositForm
  );

  const { network } = useAppSelector((state) => state.app);

  const [options, setOptions] = useState<DbToken[]>([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);

  useEffect(() => {
    if (network) {
      const options = getDBTokens(network).filter((t) => t.isQuote);
      setOptions(options);
      dispatch(setDepositToken(options[0]));
    }
  }, [network]);

  const menuOpen = Boolean(anchorEl);

  const handleClickListItem = (_event: any) => {
    setAnchorEl(_event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.BaseSyntheticEvent,
    index: number
  ) => {
    let element = event.currentTarget;
    let symbol = element.textContent;
    dispatch(setDepositToken(options.filter((t) => t.symbol === symbol)[0]));
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  return (
    <div className="m-2">
      <Card sx={{ minWidth: 350 /* backgroundColor: "inherit" */ }}>
        <CardContent>
          <FormGroup
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <List>
              {/* <fieldset className="sd-thin-border">
                <legend>Main Asset</legend> */}
              <ListItem button onClick={handleClickListItem}>
                <ListItemText primary={token?.name} />
                <ListItemAvatar>
                  <Avatar alt={token?.name} src={token?.icon} id="token1" />
                </ListItemAvatar>
              </ListItem>
              {/* </fieldset> */}
            </List>

            <Menu
              id="lock-menu-deposit"
              anchorEl={anchorEl}
              open={menuOpen}
              MenuListProps={{
                role: "listbox",
              }}
            >
              {options.map((option, index) => (
                <MenuItem
                  key={option.id}
                  selected={index === selectedIndex}
                  onClick={(event) => handleMenuItemClick(event, index)}
                >
                  <ListItemAvatar>
                    <Avatar alt={option.name} src={option.icon} />
                  </ListItemAvatar>
                  <Typography component={"span"} variant="inherit" noWrap>
                    {option.symbol}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>

            <TextField
              required
              id="default-amount-deposit"
              label="Default Amount"
              defaultValue="100"
              type="number"
              onChange={(e) => {
                dispatch(setDepositAmount(e.target.value));
              }}
              value={amount}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormGroup>
        </CardContent>
      </Card>
    </div>
  );
};

interface DepositConfig {
  open: boolean;
  handleClose: () => void;
  network: string;
}

export const Deposit = ({ handleClose, open, network }: DepositConfig) => {
  const { botAddress } = useAppSelector((state) => state.droid);
  const { token, amount } = useAppSelector(
    (state) => state.formCreate.depositForm
  );

  const handleSubmit = () => {
    console.log("ubmitted edit config");

    deposit(amount, token, botAddress, network).subscribe((tx) => {
      console.log("tx deposit: ", { tx });
      handleClose();
    });
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
        <DialogTitle>SELECT TOKEN TO DEPOSIT TO YOUR DROID</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* <Alert variant="outlined" severity="warning">
              Make sure to set initial amount to match asset
            </Alert> */}
          </DialogContentText>
          <div>
            <DepositForm />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>DEPOSIT</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
