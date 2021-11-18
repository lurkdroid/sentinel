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
} from '@mui/material';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getDBTokens } from '../../utils/data/sdDatabase';

export const ConfigForm = () => {
  const dispatch = useAppDispatch();
  const {
    defaultAmount,
    stopLossPercent,
    loop,
    defaultAmountOnly,
    isValid,
    quoteAsset,
    isSelected,
  } = useAppSelector((state) => state.formCreate);

  const { network } = useAppSelector((state) => state.app);

  const options = getDBTokens("matic").filter((t) => t.isQuote);

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

  const handleSubmit = () => {};

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
                <ListItemText primary={selectedToken.name} />
                <ListItemAvatar>
                  <Avatar
                    alt={selectedToken.name}
                    src={selectedToken.icon}
                    id="token1"
                  />
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
              defaultValue="100"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              required
              id="stop-loss"
              label="Stop Loss Percent"
              defaultValue="5"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControlLabel disabled control={<Switch />} label="Loop" />
          </FormGroup>
        </CardContent>
      </Card>
    </div>
  );
};
