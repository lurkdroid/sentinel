import { context } from "../test/context";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { DroidWaker__factory } from "../typechain";
import chalk from "chalk";
import { ethers } from "ethers";

export async function invokeWaker() {

    let envNetwork = process.env.network;
    if (!envNetwork) throw Error('network not defined');

    context.setNetwork("fork_matic"/*envNetwork*/);
    const network = await context.netwrok();
    console.log(`------- using network ${network} ---------`);

    const _addresses = require('../utils/solidroid-address.json');

    const signers: SignerWithAddress[] = await context.signers();
    //connect to manager as signer[x]
    let waker = await DroidWaker__factory.connect(_addresses[network].manager.waker, signers[0]);
    console.log(chalk.magentaBright(`------- invoking waker ${waker.address} ---------`));
    var array = new Uint8Array(1);
    array[0] = 1;

    console.log(ethers.utils.isBytes(array));

    let result = await waker.checkUpkeep(array);
    console.log(result);

}


invokeWaker().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});