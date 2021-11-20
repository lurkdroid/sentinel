import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Moralis } from "moralis";
import { useState } from "react";

import { useAppSelector } from "../../hooks";
import { withdrew } from "../../services/botServices";
import { getDBTokens } from "../../utils/data/sdDatabase";

export const Withdraw = ({ handleClose, open, network }) => {
  const { botAddress, balances } = useAppSelector((state) => state.droid);

  if (!network) {
    //FIXME please - can get as propety getDBTokens(network)
    console.warn("help.. Withdrow need network");
    network = "matic";
  }

  const hasBalance = (dbToken): boolean => {
    return balances
      .map((b) => b.token_address.toLocaleUpperCase())
      .includes(dbToken.address.toLocaleUpperCase());
  };

  const getBalance = (dbToken): string => {
    return Moralis.Units.FromWei(
      balances.filter(
        (b) =>
          b.token_address.toLocaleUpperCase() ===
          dbToken.address.toLocaleUpperCase()
      )[0].balance,
      18
    ).toPrecision(6);
  };

  //show only tokens with balance
  const options = getDBTokens(network).filter(hasBalance);

  const [selectedToken, setToken] = useState(options[0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [disabledAll, setDisableAll] = useState(false);
  const [_error, set_error] = useState(false);

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
    setToken(options.filter((t) => t.symbol === symbol)[0]);
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleWithdraw = () => {
    (async () => {
      setDisableAll(true);
      //withdrew and wait for trx
      withdrew(selectedToken.address, botAddress, network).subscribe(
        (tx) => {
          //   console.log({ tx });
          handleClose();
          setDisableAll(false);
        },
        (err) => {
          console.log("error: " + JSON.stringify(err));
          set_error(true);
          setDisableAll(false);
        }
      );
    })();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Withdraw</DialogTitle>
        <DialogContent>
          <DialogContent>
            <DialogContentText>
              {!_error && (
                <Alert variant="outlined" severity="warning">
                  If you withdrew open position balance the position will
                  automatically close!
                </Alert>
              )}
              {_error && (
                <Alert variant="outlined" severity="error">
                  Error widow !
                </Alert>
              )}
            </DialogContentText>
          </DialogContent>

          {!disabledAll && (
            <div>
              <List>
                <ListItem
                  button
                  aria-expanded={menuOpen ? "true" : undefined}
                  onClick={handleClickListItem}
                >
                  <ListItemText primary={selectedToken.name} />
                  <ListItemText primary={getBalance(selectedToken)} />
                  <ListItemAvatar>
                    <Avatar
                      alt={selectedToken.name}
                      src={selectedToken.icon}
                      id="token1"
                    />
                  </ListItemAvatar>
                </ListItem>
              </List>
              <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                // onClose={handleMenuClose}
                MenuListProps={{
                  "aria-labelledby": "lock-button",
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
            </div>
          )}
          {disabledAll && (
            <div>
              <Box
                sx={{
                  display:
                    "flex; justify-content: center;    align-items: center;",
                }}
              >
                <CircularProgress />
              </Box>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={disabledAll}>
            Cancel
          </Button>
          <Button onClick={handleWithdraw} disabled={disabledAll}>
            Withdraw
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
