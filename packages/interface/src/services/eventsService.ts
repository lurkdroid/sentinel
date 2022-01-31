import { Moralis } from 'moralis';
import iBotInstance from "../utils/IBotInstance.json";
import { AbiItem } from 'web3-utils'

export function getBotEvents(
  botAddress: string
): Promise<any> {

  let events = Moralis.Web3.enableWeb3().then((web3) => {

    const botInstance = new web3.eth.Contract(
      iBotInstance.abi as AbiItem[],
      botAddress
    );

    return botInstance
      .getPastEvents("TradeComplete_", {
        filter: {},
        fromBlock: 10002747,
        toBlock: "latest",
      })
      .then((events) => { return events })
      .catch((err) => console.log(err));
  })
  return events;
}