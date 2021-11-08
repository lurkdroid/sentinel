import { BigNumber, Signer, utils } from "ethers";
import { MockERC20, MockERC20__factory } from "../typechain";
import { context } from "../utils/context";
import chalk from "chalk";
import { deployBotInstance } from "../scripts/1_deploy_bot-instance";
const _addresses = require('../utils/solidroid-address.json');

describe("test bot signal", function () {

    let network: string;
    let signerAddr: string;
    let signer: Signer;

    let token0Addr: string;
    let token1Addr: string;
    let mockERC20_0: MockERC20;
    let mockERC20_1: MockERC20;

    // before(async function () {

    // });

    // beforeEach(async function () {

    // });

    it("Should initialize bot ctor", async function () {
        this.timeout(0);

        console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
        console.log(`signer address: ${chalk.blue(signerAddr = await context.signerAddress())}`);
        signer = (await context.signers())[0];
        token0Addr = _addresses[network].tokens[0].address;
        token1Addr = _addresses[network].tokens[1].address;
        mockERC20_0 = await MockERC20__factory.connect(token0Addr, signer);
        mockERC20_1 = await MockERC20__factory.connect(token1Addr, signer);

        let token0balance = await mockERC20_0.balanceOf(await signer.getAddress());
        console.log(`account ${await mockERC20_0.symbol()} balance: ${chalk.green(token0balance)}`);

        let defaultAmount: BigNumber = utils.parseEther('4.5');//BigNumber.from("2595988885165088891");
        let stopLossPercent: BigNumber = BigNumber.from("250");

        let botInstance = await deployBotInstance(
            _addresses[network].uniswap_v2_router,
            signerAddr,
            token0Addr,
            defaultAmount,
            stopLossPercent,
            true);

        console.log(`bot address: ${chalk.blue(botInstance.address)}`);
    });
});