import { context } from "../utils/context";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { IWETHhelper__factory, MockERC20__factory } from "../typechain";
import { printBalance } from "./trasfer-tokens";
import { ethers } from "ethers";

const _addresses = require('../utils/solidroid-address.json');

export async function setupSigner(signerIndex: number) {

    const network = await context.netwrok();
    console.log(`------- setup signer using network ${network} ---------`);
    const signers:SignerWithAddress[] = await context.signers();
    // const routerAddress = _addresses[network].uniswap_v2_router

    let token0Addr = _addresses[network].tokens[0].address;
    let mockERC20 = await MockERC20__factory.connect(token0Addr, signers[signerIndex]);

    console.log(`signer[${signerIndex}] ETH balance ${await signers[signerIndex].getBalance()}`);
    await printBalance(mockERC20, signers[signerIndex].address, `signer[${signerIndex}]`)

    const iwethHelper =  IWETHhelper__factory.connect(token0Addr, signers[signerIndex]);

    let amount = _addresses[network].bot_config.amount;

    await iwethHelper.deposit({value: ethers.utils.parseEther(amount)});
    console.log(`signer[${signerIndex}] ETH balance ${await signers[signerIndex].getBalance()}`);
    await printBalance(mockERC20, signers[signerIndex].address, `signer[${signerIndex}]`)
}


