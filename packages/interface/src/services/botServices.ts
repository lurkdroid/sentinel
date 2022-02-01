import { ethers, Transaction } from 'ethers';
import { Moralis } from 'moralis';
import { from, Observable } from 'rxjs';

import addresses from '../utils/addresses.json';
import { botInstance_abi } from '../utils/botInstanceAbi';
import { DbToken } from '../utils/data/sdDatabase';
import managerAbi from "@solidroid/core/deployed/localhost/SoliDroidManager__factory.json";
import type { BotInstance, SoliDroidManager } from "@solidroid/core/typechain";
import { BotConfig } from '../utils/BotConfig';
import { Position, PositionAndAmountOut } from '../utils/Position';

export function getBotConfig(
  botAddress: string
): Observable<BotConfig> {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log("get bot config : " + botAddress);

  let botInstance = new ethers.Contract(
    botAddress,
    botInstance_abi,
    provider.getSigner()
  ) as unknown as BotInstance;

  let _config = botInstance.getConfig().then(c => {
    return {
      defaultAmount: c[1].toString(),
      stopLossPercent: c[2].toString(),
      quoteAsset: c[0],
      looping: c[3],
      defaultAmountOnly: c[4]
    }
  });
  return from(_config);
}



export function loadBotAddress(
  managerAddress: string
): Observable<string> {

  console.log("get bot address. manager address: " + managerAddress);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // console.log("calling to : " + managerAddress);

  let managerInstance = new ethers.Contract(
    managerAddress,
    managerAbi.abi,
    provider.getSigner()
  ) as unknown as SoliDroidManager;

  // console.log(`mamager contract address ${managerInstance.address}`);

  let botAddress = managerInstance.getBot().then((address) => {
    return address;
  });

  return from(botAddress);
}


export function getPosition(
  botAddress: string
): Observable<PositionAndAmountOut> {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log("get bot position : " + botAddress);

  let botInstance = new ethers.Contract(
    botAddress,
    botInstance_abi,
    provider.getSigner()
  ) as unknown as BotInstance;


  // uint amountAOrg = amount.mul(position.openReserveA)/position.openReserveB;
  // uint amountAOut = amount.mul(_reserve0) / _reserve1;
  // uint stopLossAmount = amountAOrg.mul(1000 - _stopLossPercent) / 1000;
  // baseAsset: string;
  // openReserveA: BigNumber;
  // openReserveB: BigNumber;
  // blockTimestamp: number;
  // amount: BigNumber;
  // sells: number;
  // buys: number;
  // open: boolean;

  let _position = botInstance.getPositionAndAmountOut().then(p => {

    let amount = p[0].amount.toNumber();
    let tmp = amount * p[0].openReserveA.toNumber()
    let amountAOrg = tmp === 0 ? 0 : tmp / p[0].openReserveB.toNumber();
    // let amountAOut = amount.mul(_reserve0) / _reserve1;
    // let lastAmount = new bigDecimaltrade.amount0).divide(
    //   new bigDecimal(trade.amount1),
    //   precision
    // );

    let pos: Position = {
      path: ["0x0", p[0][0]],
      amount: p[0][4].toString(),
      lastAmountOut: "7",
      targets: ["1", "2", "3"],
      targetsIndex: p[0][5].toFixed(),
      stopLoss: "999",
      underStopLoss: p[0][7],
      stopLossAmount: "999",
      initialAmountIn: p[0][7] ? "1" : "0",
      open: p[0][7]
    };
    let la = p[2].toString() !== "0" ? p[2].div(p[1]).toString() : "0";
    return {
      position: pos,
      lastAmount: amountAOrg.toString()
    }
  });
  return from(_position);
}

/*
bot service will buy, sell, deposit, withdrow and edit
*/

export function Buy(
  token0: string,
  token1: string,
  botAddress: string
): Observable<Transaction> {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log("calling to : " + botAddress);
  let botInstance = new ethers.Contract(
    botAddress,
    botInstance_abi,
    provider.getSigner()
  ) as unknown as BotInstance;
  let tx = botInstance.buySignal(token0, token1, { gasLimit: 555581 });
  console.log("buy returns");

  return from(tx);
}

export function Sell(botAddress: string): Observable<Transaction> {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log("calling to : " + botAddress);
  let botInstance = new ethers.Contract(
    botAddress,
    botInstance_abi,
    provider.getSigner()
  ) as unknown as BotInstance;
  let tx = botInstance.sellPosition({ gasLimit: 555581 });
  console.log("sell returns");

  return from(tx);
}

export function deposit(
  amount: string,
  token: DbToken,
  botAddress: string,
  network?: string
) {
  // const provider = new ethers.providers.Web3Provider(window.ethereum);

  const options = {
    type: "erc20",
    amount: Moralis.Units.Token(amount, token.decimals),
    receiver: botAddress,
    contractAddress: token.address,
  };

  return from(
    Moralis.Web3.enableWeb3().then((web3) => {
      return Moralis.Web3.transfer(options as any);
    })
  );
}

export function withdrew(token: string, botAddress: string, network: string) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let botInstance = new ethers.Contract(
    botAddress,
    botInstance_abi,
    provider.getSigner()
  ) as unknown as BotInstance;
  let tx = botInstance.withdraw(token, { gasLimit: 450000, gasPrice: 85000000000 });
  console.log("withdrew returns");

  return from(tx);
}

export function createBot(config: any, managerAddress, network: string) {
  const abi = addresses[network].manager.abi;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log("calling to : " + managerAddress);
  let managerInstance = new ethers.Contract(
    managerAddress,
    managerAbi.abi,
    provider.getSigner()
  ) as unknown as SoliDroidManager;

  console.log(`mamager contract ${managerInstance}`);

  const stopLossPercent = ethers.utils.parseUnits(config.stopLossPercent, 2);
  const defaultAmount = ethers.utils.parseUnits(
    config.defaultAmount,
    config.token.decimals
  );
  const quoteAsset = config.token.address;
  const looping = config.looping;

  const strategyAddress = "0x51483A67E6B6BaC04Dce3ce46A0bBd5f67fc69De";

  let tx = managerInstance.createBot(
    quoteAsset,
    strategyAddress,
    defaultAmount,
    stopLossPercent,
    looping,
    { gasLimit: 2560213 }
  );

  console.log("config CREATE returns");
  // console.log("config CREATE returns", { managerAddress, quoteAsset, stopLossPercent, looping, defaultAmount });
  return from(tx);
}

export function editConfig(config: any, botAddress: string) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log("calling to : " + botAddress);
  let botInstance = new ethers.Contract(
    botAddress,
    botInstance_abi,
    provider.getSigner()
  ) as unknown as BotInstance;

  const stopLossPercent = ethers.utils.parseUnits(config.stopLossPercent, 2);
  const defaultAmount = ethers.utils.parseUnits(
    config.defaultAmount,
    config.token.decimals
  );
  const quoteAsset = config.token.address;
  const looping = config.looping;
  const strategyAddress = "0x51483A67E6B6BaC04Dce3ce46A0bBd5f67fc69De";
  console.log("updating bot with strategy: " + strategyAddress);

  let tx = botInstance.update(
    strategyAddress,
    quoteAsset,
    defaultAmount,
    stopLossPercent,
    looping,
    { gasLimit: 450000 }
  );
  console.log("config UPDATE returns");
  return from(tx);
}
