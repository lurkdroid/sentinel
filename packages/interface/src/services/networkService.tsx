import { ethers } from 'ethers';

import { setInfoModal } from '../slices/app';
import { store } from '../store';
import { getNetworkName } from '../utils/chains';

export class NetworkService {
  static provisionApp = async (
    network: "kovan" | "matic" | "bsc" | "harmony"
  ) => {
    // const addresses = await importAll(network);
    // store.dispatch(provisionApp(addresses))
  };

  static listen = async () => {
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log("listen to network events");
    if (window.ethereum) {
      window.ethereum.on("chainChanged", (d: any) => {
        const chainId = ethers.BigNumber.from(d).toString();
        console.log("chain id", ethers.BigNumber.from(d).toString());
        if (getNetworkName(chainId)) {
          if (localStorage) {
            localStorage.removeItem("store");
          }
          window.location.reload();
        } else {
          store.dispatch(setInfoModal(true));
        }
      });
      window.ethereum.on("accountsChanged", (c: any) => {
        if (localStorage) {
          localStorage.removeItem("store");
        }
        window.location.reload();
      });
    }
  };
}
