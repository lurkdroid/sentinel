import "./index.css";

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
// import { history } from "./history";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store";

const moralisOptions = {
  appId:
    process.env.REACT_APP_MORALIS_APP_ID ||
    "rpmldONCjH8T9JJqjUrtRbqVD6pxLLhhPGfMWlK3",
  serverUrl:
    process.env.REACT_APP_MORALIS_SERVER_URL ||
    "https://nf7epktlhglc.usemoralis.com:2053/server",
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.render(
  <React.StrictMode>
    {/* <MoralisProvider
      appId={moralisOptions.appId}
      serverUrl={moralisOptions.serverUrl}
    > */}
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Router>
    </Provider>
    {/* </MoralisProvider> */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
