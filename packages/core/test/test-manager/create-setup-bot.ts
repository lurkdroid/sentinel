import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chalk from "chalk";
import { utils } from "ethers";
import { strConfig } from "../../utils/BotConfig";
import { context } from "../../utils/context";
import { strPosition } from "../../utils/Position";
import { BotInstance__factory, SoliDroidManager, SoliDroidManager__factory } from "../../typechain";
import { trasferTokens } from "./trasfer-tokens";
import { ethers } from "hardhat";

export async function setupBot(signerIndex: number, _addresses: any, strategy: string) {
    console.log(`\n---------------------------------------------`);
    console.log(`------- setup bot using signer ${signerIndex} ---------`);
    const network = await context.netwrok();
    console.log(`------- setup bot using network ${network} ---------`);

    const signers: SignerWithAddress[] = await context.signers();
    //connect to manager as signer[x]
    let manager = await SoliDroidManager__factory.connect(_addresses[network].manager.address, signers[signerIndex]);
    console.log(`------- setup bot using manager ${manager.address} ---------`);


    await createBot(signers[signerIndex], network, manager, strategy, _addresses);
    let botAddress = _addresses[network].manager.bots[signerIndex].address;
    console.log(`------- signer ${signerIndex} bot created ${chalk.greenBright(botAddress)} ---------`);

    let botInstance = await BotInstance__factory.connect(botAddress, signers[signerIndex]);
    let botConfig = await botInstance.getConfig();
    console.log(`------- signer ${signerIndex} bot config ---------`);
    console.log(chalk.yellowBright(strConfig(botConfig)));

    // //======== trasfer to bot
    console.log(`------- signer ${signerIndex}  transfer token 0 to bot ---------`);
    let token0Addr = _addresses[network].tokens[0].address;
    await trasferTokens(signers[signerIndex], token0Addr, botAddress, botConfig.defaultAmount);
    return botInstance;
}

export async function printPosition(signerIndex: number, network: string, _addresses: any) {

    const signers: SignerWithAddress[] = await context.signers();

    let manager = SoliDroidManager__factory.connect(_addresses[network].manager.address, signers[signerIndex]);
    let botAddress = await manager.getBot();
    let botInstance = BotInstance__factory.connect(botAddress, signers[signerIndex]);
    let position = await botInstance.getPosition();
    console.log(`------- signer ${signerIndex} bot position ---------`);
    console.log(strPosition(position));
}


async function createBot(signer: Signer, network: string, manager: SoliDroidManager, _strategy: string, _addresses: any) {

    let defaults = _addresses[network].bot_config;
    let token0Addr = _addresses[network].tokens[0].address;

    await manager.createBot(
        token0Addr,
        _strategy,
        utils.parseEther(defaults.amount),
        BigNumber.from(defaults.percent),
        true);

    let botAddress = await manager.getBot();
    _addresses[network].manager.bots.push({ "owner": _addresses[network].owner, "address": botAddress });
}

