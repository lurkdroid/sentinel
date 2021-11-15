import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Alert } from "@mui/material";
import { getDBTokens } from "../../utils/data/sdDatabase";
import { MrERC20Balance } from "../../utils/MrERC20Balance";

import { useEffect, useState } from "react";
import { withdrow } from "../../services/botServices";
import { Moralis } from "moralis";

export const Withdraw = ({
  handleClose,
  open,
  network,
  balances,
  botAddress,
}) => {
  if (!network) {
    //FIXME please - can get as propety getDBTokens(network)
    console.warn("help.. Withdrow need network");
    network = "matic";
  }
  //   console.log(balances);
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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [disabledAll, setDisableAll] = React.useState(false);
  const [_error, set_error] = React.useState(false);

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
    setToken(options.filter((t) => t.symbol == symbol)[0]);
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleWithdraw = () => {
    (async () => {
      setDisableAll(true);
      //withrow and wait for trx
      withdrow(selectedToken.address, botAddress).subscribe(
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
          {/* <DialogContentText>Select asset to withdrow</DialogContentText> */}

          <DialogContent>
            <DialogContentText>
              {!_error && (
                <Alert variant="outlined" severity="warning">
                  If you withdrow open position balace the postion will
                  automaticly close!
                </Alert>
              )}
              {_error && (
                <Alert variant="outlined" severity="error">
                  Error withdow !
                </Alert>
              )}
            </DialogContentText>
          </DialogContent>

          {!disabledAll && (
            <div>
              <List
                component="nav"
                aria-label="Device settings"
                sx={{ bgcolor: "background.paper" }}
              >
                <ListItem
                  button
                  id="lock-button"
                  aria-haspopup="listbox"
                  aria-controls="lock-menu"
                  aria-label="when device is locked"
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
