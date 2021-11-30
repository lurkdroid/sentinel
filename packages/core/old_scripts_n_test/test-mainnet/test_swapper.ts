import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import * as chai from 'chai';
import chalk from "chalk";
import { context } from "../utils/context";
import { testData } from "../utils/test-data";
import { MockERC20__factory } from "../typechain/factories/MockERC20__factory";
import { deploySwapper } from "../scripts/deploy_swapper";
import { Swapper } from "../typechain/Swapper";
import { Swapper__factory } from "../typechain/factories/Swapper__factory";
import { MockERC20 } from "../typechain";
import bigDecimal from "js-big-decimal";

describe("test swapper", function () {

    let swapper: Swapper;
    let acct1: Signer;
    let network: string;
    let acctAddr: string;
    let token0Addr: string;
    let token1Addr: string;
    let mockERC20_0: MockERC20;
    let mockERC20_1: MockERC20;
    let startBalance: BigNumber;

    before(async function () {
        this.timeout(0);
        console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
        console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
        acct1 = (await context.signers())[0];
        token0Addr = testData[network].token0Addr;
        token1Addr = testData[network].token1Addr;
        mockERC20_0 = await MockERC20__factory.connect(token0Addr, acct1);
        mockERC20_1 = await MockERC20__factory.connect(token1Addr, acct1);
        // swapper = await deploySwapper();
        // swapper.deployed();
        ////////
        swapper = await Swapper__factory.connect(testData[network].swapperAddr, acct1);
        console.log(`swapper address: ${chalk.blue(swapper.address)}`);
        console.log(`swapper using router: ${chalk.blue(await swapper.usingRouer())}`);

    });

    beforeEach(async function () {
        startBalance = await acct1.getBalance();
        console.log(chalk.yellow(`========== account balance ${startBalance.toString()} =================`));
        let token0balance = await mockERC20_0.balanceOf(await acct1.getAddress());
        console.log(`account ${await mockERC20_0.symbol()} balance: ${chalk.green(token0balance)}`);
        let token1balance = await mockERC20_1.balanceOf(await acct1.getAddress());
        console.log(`account ${await mockERC20_1.symbol()} balance: ${chalk.greenBright(token1balance)}\n`);
    });
    afterEach(async function () {
        let endBalance = await acct1.getBalance();
        console.log(chalk.yellow(`========== account balance ${endBalance.toString()} =================`));
        console.log(chalk.red(`========== cost ${startBalance.sub(endBalance).toString()}=================`));
        let token0balance = await mockERC20_0.balanceOf(await acct1.getAddress());
        console.log(`account ${await mockERC20_0.symbol()} balance: ${chalk.green(token0balance)}`);
        let token1balance = await mockERC20_1.balanceOf(await acct1.getAddress());
        console.log(`account ${await mockERC20_1.symbol()} balance: ${chalk.greenBright(token1balance)}\n`);
    });

    // it("Should transfer ", async function () {
    //     this.timeout(0);
    //     let swapper0balance = await mockERC20_0.balanceOf(testData[network].swapperAddr);
    //     console.log(`\nswapper ${await mockERC20_0.symbol()} start balance: ${chalk.green(swapper0balance)}`);
    //     let swapper1balance = await mockERC20_1.balanceOf(testData[network].swapperAddr);
    //     console.log(`swapper ${await mockERC20_1.symbol()} start balance: ${chalk.green(swapper1balance)}`);
    //     ///////////////////////////////////////////////////////////////////////

    //     let transferAmount = BigNumber.from("3014328694208126239");
    //     let tx1 = await mockERC20_0.approve(swapper.address, transferAmount);
    //     await tx1.wait().then(console.log);
    //     console.log("done approve, start transfer");

    //     let tx2 = await mockERC20_0.transfer(swapper.address, transferAmount);
    //     await tx2.wait().then(console.log);

    //     ///////////////////////////////////////////////////////////////////////
    //     swapper0balance = await mockERC20_0.balanceOf(testData[network].swapperAddr);
    //     console.log(`\nswapper ${await mockERC20_0.symbol()} end balance: ${chalk.green(swapper0balance)}`);
    //     swapper1balance = await mockERC20_1.balanceOf(testData[network].swapperAddr);
    //     console.log(`swapper ${await mockERC20_1.symbol()} end balance: ${chalk.green(swapper1balance)}`);
    // });

    // it("Should withdrow ", async function () {
    //     this.timeout(0);
    //     let swapper0balance = await mockERC20_0.balanceOf(testData[network].swapperAddr);
    //     console.log(`\nswapper ${await mockERC20_0.symbol()} start balance: ${chalk.green(swapper0balance)}`);
    //     let swapper1balance = await mockERC20_1.balanceOf(testData[network].swapperAddr);
    //     console.log(`swapper ${await mockERC20_1.symbol()} start balance: ${chalk.green(swapper1balance)}`);
    //     ///////////////////////////////////////////////////////////////////////

    //     let tx = await swapper.withdraw(token0Addr);
    //     await tx.wait().then(console.log);

    //     ///////////////////////////////////////////////////////////////////////
    //     swapper0balance = await mockERC20_0.balanceOf(testData[network].swapperAddr);
    //     console.log(`\nswapper ${await mockERC20_0.symbol()} end balance: ${chalk.green(swapper0balance)}`);
    //     swapper1balance = await mockERC20_1.balanceOf(testData[network].swapperAddr);
    //     console.log(`swapper ${await mockERC20_1.symbol()} end balance: ${chalk.green(swapper1balance)}`);
    // });

    it("Should swap ", async function () {

        this.timeout(0);
        let swapper0balance = await mockERC20_0.balanceOf(testData[network].swapperAddr);
        console.log(`\nswapper ${await mockERC20_0.symbol()} start balance: ${chalk.green(swapper0balance)}`);
        let swapper1balance = await mockERC20_1.balanceOf(testData[network].swapperAddr);
        console.log(`swapper ${await mockERC20_1.symbol()} start balance: ${chalk.green(swapper1balance)}`);


        // let amountOut = await swapper.getAmountsOut(swapper1balance, [token1Addr, token0Addr]);
        // console.log(`got amount out ${amountOut.toString()}`);

        // let calcAmountOut = new bigDecimal(amountOut.toString()).multiply(new bigDecimal(0.96));
        // console.log(`calc amount out ${calcAmountOut.getValue()}`);
        // console.log(`calc round amount out ${calcAmountOut.round().getValue()}`);

        // let minAmountOut = BigNumber.from(calcAmountOut.round().getValue());
        // console.log(`min amount out ${minAmountOut.toString()}`);

        //buy
        // amountIn	uint256	    3087189681127071635
        // amountOutMin	uint256	   1339884103847203
        // path	address[]	0d500b1d8e8ef31e21c99d1db9a6444d3adf1270, 7ceb23fd6bc0add59e62ac25578270cff1b9f619

        // sell
        // amountIn	uint256	       1346583559195547
        // amountOutMin	uint256	3036243623911902584
        // path	address[]	7ceb23fd6bc0add59e62ac25578270cff1b9f619, 0d500b1d8e8ef31e21c99d1db9a6444d3adf1270
        // to	address	0b8c51a4538fd92362b019c9d52354a6d832694c

        // let tx = await swapper.swapSlippage(swapper1balance.toString(), minAmountOut.toString(), token1Addr, token0Addr);
        // await tx.wait().then(console.log);

        let tx = await swapper.swapExactTokensForTokens(
            // ["0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "7ceb23fd6bc0add59e62ac25578270cff1b9f619"],
            [token1Addr.toString(), token0Addr.toString()],
            swapper1balance.toString());
        await tx.wait().then(console.log);

        /////////////////////////////////////////////////////////////////////////
        swapper0balance = await mockERC20_0.balanceOf(testData[network].swapperAddr);
        console.log(`\nswapper ${await mockERC20_0.symbol()} end balance: ${chalk.green(swapper0balance)}`);
        swapper1balance = await mockERC20_1.balanceOf(testData[network].swapperAddr);
        console.log(`swapper ${await mockERC20_1.symbol()} end balance: ${chalk.green(swapper1balance)}`);
    });
});