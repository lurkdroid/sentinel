import { ethers } from "ethers";
import { Moralis } from "moralis";

import { setApp, setInfoModal, setLoading, setLogout } from "../slices/app";
import { setIsDark, setNetwork } from "../slices/dashboard";
import { setAddress } from "../slices/userInfo";
import { store } from "../store";
import { getNetworkName } from "../utils/chains";

export class NetworkService {
  static provisionApp = async (
    network: "kovan" | "matic" | "bsc" | "harmony"
  ) => {
    // store.dispatch(provisionApp(addresses))
  };

  static listen = async () => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
    }

    console.log("listen to network events", window.ethereum);
    if (window.ethereum) {
      console.log("chainid", window.ethereum.networkVersion);

      store.dispatch(setNetwork(window.ethereum.networkVersion));
      store.dispatch(setApp(window.ethereum.networkVersion));

      window.ethereum.on("chainChanged", (d: any) => {
        const chainId = ethers.BigNumber.from(d).toString();
        console.log("-".repeat(30));
        console.log("chain id", { chainId }, getNetworkName(chainId));
        console.log("-".repeat(30));
        if (getNetworkName(chainId)) {
          store.dispatch(setNetwork(+chainId));
          store.dispatch(setApp(+chainId));
          store.dispatch(setLogout(true));
          store.dispatch(setAddress(""));
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
        store.dispatch(setIsDark(false));
        store.dispatch(setAddress(""));
        window.location.reload();
      });
    }
  };

  static connectWithMoralis = async () => {
    console.log("authenticating");
    store.dispatch(setLoading(true));
    try {
      await Moralis.Web3.authenticate();
      const user = await Moralis.User.current();
      console.log({ user });
      if (user && user.attributes) {
        console.log("user attributes:", user.attributes);
        store.dispatch(setAddress(user.attributes.ethAddress));
        store.dispatch(setIsDark(false));
        this.listen();
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        const { chainId } = await provider.getNetwork();

        console.log("network name is:");
        store.dispatch(setNetwork(chainId));
        store.dispatch(setApp(chainId));
        store.dispatch(setLoading(false));
        return true;
      }
    } catch (e) {
      console.log("error while connecting", e);
    }
    store.dispatch(setLoading(false));
    return false;
  };
}
