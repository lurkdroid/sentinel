
import feeds from './oracles.json';



const oracleNetworks = {
    "ethereum-addresses": "Kovan Testnet",
    "binance-smart-chain-addresses-price": "BSC Mainnet",
    "matic-addresses": "Polygon Mainnet",
    "avalanche-price-feeds": "Avalanche Mainnet",
    // "harmony-price-feeds" // only in testnet
}
const networkNames = ["ethereum", "bsc", "matic", "avax"];

Object.keys(oracleNetworks).map((network, i) => {

    const { networks } = feeds[network];
    const oracle: {
        "pair": string, //"BUSD / USD",
        "deviationThreshold": number, //0.3,
        "heartbeat": string, //"1h",
        "decimals": number, //8,
        "proxy": string, //"0xa0ABAcC3162430b67Aa6C135dfAA08E117A38bF0"
    }[] = networks.filter(n => n.name == oracleNetworks[network])[0];


    return oracle;
})