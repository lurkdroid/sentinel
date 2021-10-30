import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

export const context = {
    netwrok: (): Promise<string> => {
        return ethers.provider.getNetwork().then(
            _network => {
                let network = _network.name;
                return (network == "unknown") ? "localhost" : network; //help... hardhat dosn't peek network with ganache-cli localhost
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
