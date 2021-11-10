
import { ethers } from "ethers";
import { getNetworkName } from "../utils/chains";
import { store } from "../store"
import { setInfoModal} from "../slices/app"
export class NetworkService {


    static listen = () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("listen to network events");
        if (window.ethereum) {
            window.ethereum.on('chainChanged', (d: any) => {

                const chainId = ethers.BigNumber.from(d).toString();
                // console.log("chain id", ethers.BigNumber.from(d).toString())
                if (Object.keys(getNetworkName).includes(chainId)) {
                    window.location.reload();
                } else {
                    store.dispatch(setInfoModal(true))
                }

            })
            window.ethereum.on('accountsChanged', (c: any) => {
                window.location.reload();
            })
        }


    }
}