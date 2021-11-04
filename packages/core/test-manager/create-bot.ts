import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import chalk from "chalk";
import { utils } from "ethers";
import { SoliDroidManager } from "../typechain";

export async function createBot(signer: Signer, network: string, manager: SoliDroidManager, quoteAsset: string) {

    const _addresses = require('../utils/solidroid-address.json');
    let defaults = _addresses[network].bot_config;

    await manager.updateBot(
        quoteAsset,
        utils.parseEther(defaults.amount),
        BigNumber.from(defaults.percent),
        true);

    let botAddress = await manager.getBot();
    _addresses[network].manager.bots.push({ "owner": _addresses[network].owner, "address": botAddress });
}