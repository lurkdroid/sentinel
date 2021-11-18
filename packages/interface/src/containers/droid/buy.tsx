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
} from '@mui/material';
import { useState } from 'react';

import { useAppSelector } from '../../hooks';
import { Buy } from '../../services/botServices';
import { getDBTokens } from '../../utils/data/sdDatabase';

export const BuyDialog = ({
  handleClose,
  open,
  network,
}: {
  handleClose: () => void;
  open: boolean;
  network: string;
}) => {
  const { botAddress, config } = useAppSelector((state) => state.droid);

  if (!config || !botAddress) {
    console.warn("can't initialize. wait for state!");
    //FIXME, can't load until state is intialize
    // return;
  }

  const options = getDBTokens(network || "matic").filter(
    (t) =>
      t.address.toLocaleUpperCase() !== config.quoteAsset.toLocaleUpperCase()
  );

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

  const handleBuy = () => {
    if (!config) {
      console.log("bot config unavailable", { config });
      return;
    }
    (async () => {
      setDisableAll(true);

      Buy(config?.quoteAsset, selectedToken.address, botAddress).subscribe(
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
        <DialogTitle>Buy Asset</DialogTitle>
        <DialogContent>
          <DialogContent>
            <DialogContentText>
              {!_error && (
                <Alert variant="outlined" severity="warning">
                  Make sure you buy an asset with good liquidity!
                </Alert>
              )}
              {_error && (
                <Alert variant="outlined" severity="error">
                  Buy Error !
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
                  <ListItemAvatar>
                    <Avatar
                      alt={selectedToken.name}
                      src={selectedToken.icon}
                      id="selectedToken"
                    />
                  </ListItemAvatar>
                </ListItem>
              </List>
              <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                //                 onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "lock-button",
                  role: "listbox",
                }}
              >
                {options.map((option, index) => (
                  <MenuItem
                    key={option.id}
                    disabled={index === 0}
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
          <Button onClick={handleBuy} disabled={disabledAll}>
            Buy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
