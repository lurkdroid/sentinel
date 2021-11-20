import {
  Avatar,
  Card,
  CardContent,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  setAmount,
  setQuoteAsset,
  setStopLoss,
  setToLoop,
} from "../../slices/droidForm";
import { DbToken, getDBTokens } from "../../utils/data/sdDatabase";

export const ConfigForm = () => {
  const dispatch = useAppDispatch();
  const { defaultAmount, stopLossPercent, looping, token } = useAppSelector(
    (state) => state.formCreate
  );

  const { network } = useAppSelector((state) => state.app);

  const [options, setOptions] = useState<DbToken[]>([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);

  useEffect(() => {
    if (network) {
      const options = getDBTokens(network).filter((t) => t.isQuote);
      setOptions(options);
      dispatch(setQuoteAsset(options[0]));
    }
  }, [network, dispatch]);

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
    dispatch(setQuoteAsset(options.filter((t) => t.symbol === symbol)[0]));
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
              id="lock-menu"
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
              id="default-amount"
              label="Default Amount"
              // defaultValue="100"
              type="number"
              onChange={(e) => {
                dispatch(setAmount(e.target.value));
              }}
              value={defaultAmount}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              required
              id="stop-loss"
              label="Stop Loss Percent"
              // defaultValue="5"
              type="number"
              value={stopLossPercent}
              onChange={(e) => dispatch(setStopLoss(e.target.value))}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControlLabel
              onChange={(e) => dispatch(setToLoop(!looping))}
              control={<Switch value={looping} />}
              label="Loop"
            />
          </FormGroup>
        </CardContent>
      </Card>
    </div>
  );
};
