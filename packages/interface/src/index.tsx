import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter as Router } from "react-router-dom";
import { MoralisProvider } from "react-moralis";

const moralisOptions = {
  appId:  process.env.REACT_APP_MORALIS_APP_ID|| "rpmldONCjH8T9JJqjUrtRbqVD6pxLLhhPGfMWlK3",
  serverUrl: process.env.REACT_APP_MORALIS_SERVER_URL || "https://nf7epktlhglc.usemoralis.com:2053/server"
}

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider appId={moralisOptions.appId} serverUrl={moralisOptions.serverUrl}>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
