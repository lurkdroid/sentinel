import { BotInstance } from "@solidroid/core/typechain";
import { ethers } from "ethers";
import { Observable } from "rxjs";
import { botInstance_abi } from '../utils/botInstanceAbi';
import { Moralis } from 'moralis';
import iBotInstance from "../utils/IBotInstance.json";
import { AbiItem } from 'web3-utils'

export function getBotEvents(
  botAddress: string
): Observable<any> {

  console.warn("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx");

  Moralis.Web3.enableWeb3().then((web3) => {
    const botInstance = new web3.eth.Contract(
      iBotInstance.abi as AbiItem[],
      botAddress
    );
    botInstance
      .getPastEvents("TradeComplete_", {
        filter: {},
        fromBlock: 10002747,
        toBlock: "latest",
      })
      .then((events) => console.log(events))
      .catch((err) => console.log(err));
  })
  return null;
}

// export function getBotConfig(botAddress) {

//   const web3 =
//     res.app.locals.web3["alchemy"][req.query.chain] ||
//     res.app.locals.web3["chain"][req.query.chain];

//   console.log(new Date().toTimeString());
//   console.log(botAddress);
//   const botInstance = new web3.eth.Contract(
//     botInstance_abi,
//     botAddress
//   );

//   botInstance
//     .getPastEvents("TradeComplete_", {
//       filter: {},
//       fromBlock: 21220000,
//       toBlock: "latest",
//     })
//     .then((config) => res.json(config))
//     .catch((err) => console.log(err));

// }

