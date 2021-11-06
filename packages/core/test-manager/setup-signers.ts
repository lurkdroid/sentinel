import { IUniswapV2RouterUtil__factory} from "../typechain/factories/IUniswapV2RouterUtil__factory";
import { context } from "../test/context";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MockERC20__factory } from "../typechain";
import { printBalance } from "./trasfer-tokens";
import { ethers, BigNumber } from "ethers";

const _addresses = require('../utils/solidroid-address.json');

export async function setupSigner(signerIndex: number) {

    const network = await context.netwrok();
    console.log(`------- setup signer using network ${network} ---------`);
    const signers:SignerWithAddress[] = await context.signers();
    const routerAddress = _addresses[network].uniswap_v2_router

    const uniswapV2Router = IUniswapV2RouterUtil__factory.connect(routerAddress, signers[signerIndex])
    let token0Addr = _addresses[network].tokens[0].address;
    let mockERC20 = await MockERC20__factory.connect(token0Addr, signers[signerIndex]);

    console.log(`signer[${signerIndex}] ETH balance ${await signers[signerIndex].getBalance()}`);
    await printBalance(mockERC20, signers[signerIndex].address, `signer[${signerIndex}]`)


    weth.deposit{value: msg.value}();

    // let blockNumber = await ethers.getDefaultProvider().getBlockNumber();
    // // console.log(`block number ${blockNumber}`)
    // let blockTimestamp = await (await ethers.getDefaultProvider().getBlock(blockNumber)).timestamp
    // console.log(`blockTimestamp ${blockTimestamp}`)
    let deadline =  BigNumber.from("1636310378");
    // deadline.add(BigNumber.from(10000));
    // console.log(`deadline ${deadline.toString()}`)
    let wethAddress = await uniswapV2Router.WETH();
        console.log(`weth ${wethAddress}`)

    let tx = await uniswapV2Router.swapExactETHForTokens(
        1000, 
        [wethAddress, "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"], 
        signers[signerIndex].address, 
        1636310378 ,
        { value: 10 });

    tx.wait().then(console.log);
    await printBalance(mockERC20, signers[signerIndex].address, `signer[${signerIndex}]`)
}


