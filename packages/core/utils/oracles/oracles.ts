import fs from 'fs';
import path from 'path';

import feeds from './oracles.json';

const oracleNetworks = {
    "ethereum-addresses": "Kovan Testnet",
    "binance-smart-chain-addresses-price": "BSC Mainnet",
    "matic-addresses": "Polygon Mainnet",
    "avalanche-price-feeds": "Avalanche Mainnet",
    // "harmony-price-feeds" // only in testnet
};
const oracleNetworksMapping = {
    "ethereum-addresses": "kovan",
    "binance-smart-chain-addresses-price": "bsc",
    "matic-addresses": "matic",
    "avalanche-price-feeds": "avax",
    // "harmony-price-feeds" // only in testnet
};
const networkNames = ["ethereum", "bsc", "matic", "avax"];

const oracleInfo = () =>
    Object.keys(oracleNetworks).reduce(
        (oracles: any, name: string) => {
            const { networks } = feeds[name];
            const oracle: {
                pair: string; //"BUSD / USD",
                deviationThreshold: number; //0.s3,
                heartbeat: string; //"1h",
                decimals: number; //8,
                proxy: string; //"0xa0ABAcC3162430b67Aa6C135dfAA08E117A38bF0"
            }[] = networks.filter((n) => n.name == oracleNetworks[name])[0].proxies;
            const ourNetworkName = oracleNetworksMapping[name];
            if (ourNetworkName) {
                oracles[ourNetworkName] = oracle.map((o) => {
                    o.pair = o.pair.replace(/\s/g, "");

                    if (o.pair == "AMPL/ETH") {
                        o.pair = "FORTH/ETH"
                    }
                    return o;
                });
            }
            return oracles;
        },
        {} as {
            [name: string]: {
                pair: string; // "BUSD / USD",
                deviationThreshold: number; // 0.3,
                heartbeat: string; // "1h",
                decimals: number; // 8,
                proxy: string; // "0xa0ABAcC3162430b67Aa6C135dfAA08E117A38bF0"
            }[];
        }
    );

const parseOraclesToJson = () => {
    const p = path.resolve(__dirname, "supportedOracles.json");
    fs.writeFileSync(p, JSON.stringify(oracleInfo()))
}
