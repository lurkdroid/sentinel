import { Signer } from "ethers";
import { BotInstance__factory, BotInstance, MockERC20__factory } from "../typechain";
import { BotConfig, strConfig } from "../test/BotConfig"
import { context } from "../test/context";
import chalk from "chalk";
import { testData } from "../test/test-data";

let botInstance: BotInstance;

async function main() {

    let network: string;
    let acctAddr: string;
    let acct1: Signer;

    let token0Addr: string;
    let token1Addr: string;


    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
    acct1 = (await context.signers())[0];
    token0Addr = testData[network].token0Addr;
    token1Addr = testData[network].token1Addr;

    botInstance = await BotInstance__factory.connect("0x55DD96626cc18318a0013827A31049ea1d5B2D5F", acct1);
    console.log(`bot address: ${chalk.blue(botInstance.address)}`);

    let mockERC20_0 = await MockERC20__factory.connect(token0Addr, acct1);
    let mockERC20_1 = await MockERC20__factory.connect(token1Addr, acct1);

    let token0balance = await mockERC20_0.balanceOf(await acct1.getAddress());
    console.log(`account ${await mockERC20_0.symbol()} balance: ${chalk.green(token0balance)}`);
    let token1balance = await mockERC20_1.balanceOf(await acct1.getAddress());
    console.log(`account ${await mockERC20_1.symbol()} balance: ${chalk.green(token1balance)}`);

    let bot0balance = await mockERC20_0.balanceOf(await botInstance.address);
    console.log(`bot ${await mockERC20_0.symbol()} balance: ${chalk.green(bot0balance)}`);
    let bot1balance = await mockERC20_1.balanceOf(await botInstance.address);
    console.log(`bot ${await mockERC20_1.symbol()} balance: ${chalk.green(bot1balance)}`);

    // await botInstance.withdraw(token0Addr);
    let tx = await botInstance.withdraw(token1Addr);
    await tx.wait().then(console.log);

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
