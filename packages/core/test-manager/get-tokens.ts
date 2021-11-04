import { Signer } from "@ethersproject/abstract-signer";
import { BotInstanceLib__factory, IUniswapV2Factory__factory, IUniswapV2Router02, Swapper, Swapper__factory } from "../typechain";
import { deploySwapper } from "../scripts/deploy_swapper";
import { context } from "../test/context";

const _addresses = require('../utils/solidroid-address.json');

const overrides = {
    gasLimit: 9999999
}

async function getTokens(signer: Signer, netwrok: string,) {

    const uniswapV2Router: IUniswapV2Router02 = IUniswapV2Factory__factory.connect("0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff", signer)

    let _address = await signer.getAddress();
    uniswapV2Router.swapExactETHForTokens(10, [], _address, 0, { value: 10 });
}


