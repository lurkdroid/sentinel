import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { BotInstance } from "../typechain/";
import { deployBotInstance } from "../scripts/1_deploy_bot-instance"
import * as chai from 'chai';
import chalk from "chalk";
import { context } from "../utils/context";
import { MockERC20__factory } from "../typechain/factories/MockERC20__factory";
const _addresses = require('../utils/solidroid-address.json');
import {swapToWETH, transfer} from "../utils/TokensUtils"

describe("test withdrow", function () {

    let signer: Signer;
    let acctAddr: string;
    let network: string;
    let token0Addr: string;
    let token1Addr: string;

    // tokens and liquidity on rinkeby testnet
    let botInstance: BotInstance;
    let defaultAmount = BigNumber.from(ethers.utils.parseEther("5"));
    let stopLossPercent = BigNumber.from("450");
    let loop = true;

    before(async function () {
        console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
        console.log(`signer address: ${chalk.blue(acctAddr = await context.signerAddress())}`);
        signer = (await context.signers())[0];
        token0Addr = _addresses[network].tokens[0].address;
        token1Addr = _addresses[network].tokens[1].address;
    });

    beforeEach(async function () {
        botInstance = await deployBotInstance(
            _addresses[network].uniswap_v2_router,
            acctAddr,
            token0Addr,
            defaultAmount,
            stopLossPercent,
            loop);
        await swapToWETH(signer,token0Addr,defaultAmount);

    });

    it("Should withdrow token from bot instance", async function () {

        let mockERC20_0 = await MockERC20__factory.connect(token0Addr, signer);

        let initialBotBalance0 = await mockERC20_0.balanceOf(botInstance.address);
        console.log("initial bot balance of 0 :" + initialBotBalance0.toString());
        chai.expect(initialBotBalance0).to.eql(BigNumber.from(0));

        let initialUserBalance = await mockERC20_0.balanceOf(acctAddr);
        console.log("initial user balance of 0 :" + initialUserBalance.toString());
        chai.expect(initialUserBalance).to.eql(defaultAmount);

        await transfer(signer, token0Addr, botInstance.address, defaultAmount)

        let afterDeposit = await mockERC20_0.balanceOf(botInstance.address);
        console.log("bot balance of 0 after transef :" + afterDeposit.toString());
        chai.expect(afterDeposit).to.eql(defaultAmount);

        let userBalanceAfterTransfer = await mockERC20_0.balanceOf(acctAddr);
        console.log("user balance of 0 after transfer:" + userBalanceAfterTransfer.toString());
        chai.expect(userBalanceAfterTransfer).to.lt(initialUserBalance);

        await botInstance.withdraw(token0Addr);

        let afterWithdraw = await mockERC20_0.balanceOf(botInstance.address);
        console.log("bot balance of 0 after withdraw :" + afterWithdraw.toString());
        chai.expect(afterWithdraw).to.eql(BigNumber.from(0));

        let userBalanceAfterWithdraw = await mockERC20_0.balanceOf(acctAddr);
        console.log("user balance of 0 after withdraw:" + userBalanceAfterWithdraw.toString());
        chai.expect(userBalanceAfterWithdraw).to.eql(initialUserBalance);
    });

    it("Should revert BotInstance. caller is not the beneficiary", async function () {
        let mockERC20_0 = await MockERC20__factory.connect(token0Addr, signer);

        let initialUserBalance = await mockERC20_0.balanceOf(acctAddr);
        console.log("initial user balance of 0 :" + initialUserBalance.toString());
        chai.expect(initialUserBalance).to.gt(defaultAmount);

        await transfer(signer, token0Addr, botInstance.address, defaultAmount)

        let afterDeposit = await mockERC20_0.balanceOf(botInstance.address);
        console.log("bot balance of 0 after transef :" + afterDeposit.toString());
        chai.expect(afterDeposit).to.eql(defaultAmount);

        let otherSigner = (await context.signers())[1];

        await chai.expect(botInstance.connect(otherSigner).withdraw(token0Addr))
            .to.be.revertedWith('BotInstance: caller is not the beneficiary');
    });
});