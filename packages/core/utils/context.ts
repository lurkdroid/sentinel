import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { string } from "hardhat/internal/core/params/argumentTypes";

let __network:string ;

export const context = {

    setNetwork(_network:string){
        __network = _network;
    },

    netwrok: (): Promise<string> => {
        if(__network ) return Promise.resolve(__network);
        return ethers.provider.getNetwork().then(
            _network => {
                let network = _network.name;
                return (network == "unknown") ? "localhost" : network;
            }
        )
    },

    signers: (): Promise<SignerWithAddress[]> => {
        return ethers.getSigners();

    },
    
    signerAddress: (): Promise<string> => {
        return ethers.provider.getSigner().getAddress();
    },
} as const;
