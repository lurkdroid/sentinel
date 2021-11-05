import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import chalk from "chalk";
import { MockERC20, MockERC20__factory } from "../typechain";

export async function trasferTokens(signer: Signer, tokenAssress: string, _to: string, amount: BigNumber) {
    //teransfer token to bot
    let _signerAddress = await signer.getAddress();
    let mockERC20 = await MockERC20__factory.connect(tokenAssress, signer);

    //get user token balance
    let token0balance = await mockERC20.balanceOf(_signerAddress);

    await printBalance(mockERC20, _signerAddress, "signer")
    await printBalance(mockERC20, _to, "to")

    await mockERC20.approve(_to, amount);
    await mockERC20.transfer(_to, amount);

    await printBalance(mockERC20, _signerAddress, "signer")
    await printBalance(mockERC20, _to, "to")
}

export async function printBalance(mockERC20: MockERC20, _address: string, name: string) {
    let token0balance = await mockERC20.balanceOf(_address);
    console.log(`${name} ${await mockERC20.symbol()} balance: ${chalk.green(token0balance)}`);
}