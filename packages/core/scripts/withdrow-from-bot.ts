import { Signer } from "ethers";
import { BotInstance__factory, BotInstance, MockERC20__factory } from "../typechain";
import { context } from "../utils/context";
import chalk from "chalk";
import { Token } from "../deploy/Tokne";

let botInstance: BotInstance;

async function main() {

    let network: string;
    let acctAddr: string;
    let acct1: Signer;

    let token0Addr: string;
    let token1Addr: string;

    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
    const _addresses = require(`../utils/solidroid-address-${network}.json`);

    acct1 = (await context.signers())[0];
    let tokenArray: Array<Token> = _addresses[network].tokens;
    let token0 = tokenArray[0];
    let token1 = tokenArray[1];

    botInstance = await BotInstance__factory.connect("0x276c61eA2c389310A0cbF46ba5341968D3C09C3A", acct1);
    console.log(`bot address: ${chalk.blue(botInstance.address)}`);

    let mockERC20_0 = await MockERC20__factory.connect(token0.address, acct1);
    let mockERC20_1 = await MockERC20__factory.connect(token1.address, acct1);

    let token0balance = await mockERC20_0.balanceOf(await acct1.getAddress());
    console.log(`account ${await mockERC20_0.symbol()} balance: ${chalk.green(token0balance)}`);
    let token1balance = await mockERC20_1.balanceOf(await acct1.getAddress());
    console.log(`account ${await mockERC20_1.symbol()} balance: ${chalk.green(token1balance)}`);

    let bot0balance = await mockERC20_0.balanceOf(await botInstance.address);
    console.log(`bot ${await mockERC20_0.symbol()} balance: ${chalk.green(bot0balance)}`);
    let bot1balance = await mockERC20_1.balanceOf(await botInstance.address);
    console.log(`bot ${await mockERC20_1.symbol()} balance: ${chalk.green(bot1balance)}`);

    // await botInstance.withdraw(token0Addr);
    await botInstance.withdraw(token0.address);
    await botInstance.withdraw(token1.address);

    token0balance = await mockERC20_0.balanceOf(await acct1.getAddress());
    console.log(`account ${await mockERC20_0.symbol()} balance: ${chalk.green(token0balance)}`);
    token1balance = await mockERC20_1.balanceOf(await acct1.getAddress());
    console.log(`account ${await mockERC20_1.symbol()} balance: ${chalk.green(token1balance)}`);

    bot0balance = await mockERC20_0.balanceOf(await botInstance.address);
    console.log(`bot ${await mockERC20_0.symbol()} balance: ${chalk.green(bot0balance)}`);
    bot1balance = await mockERC20_1.balanceOf(await botInstance.address);
    console.log(`bot ${await mockERC20_1.symbol()} balance: ${chalk.green(bot1balance)}`);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
