import { ethers } from 'ethers';
import { Moralis } from 'moralis';

import { setInfoModal, setLogout } from '../slices/app';
import { setAddress } from '../slices/userInfo';
import { store } from '../store';
import { getNetworkName } from '../utils/chains';

export class NetworkService {
  static provisionApp = async (
    network: "kovan" | "matic" | "bsc" | "harmony"
  ) => {
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
      window.ethereum.on("accountsChanged", async (accounts: string[]) => {
        if (localStorage) {
          localStorage.removeItem("store");
        }
        console.log("accountschanged", accounts);
        await Moralis.Web3.cleanup();
        store.dispatch(setLogout(true));
        store.dispatch(setAddress(""));
        await new Promise((resolve) => setTimeout(resolve, 300));
        store.dispatch(setAddress(""));
        window.location.reload();
      });
    }
  };
}
