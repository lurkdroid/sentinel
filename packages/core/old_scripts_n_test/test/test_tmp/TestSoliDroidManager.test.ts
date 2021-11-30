import { BigNumber } from '@ethersproject/bignumber';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { SoliDroidManager__factory } from '../../typechain/factories/SoliDroidManager__factory';
import { SoliDroidManager } from '../../typechain/SoliDroidManager';

describe("SoliDroidManaget", function () {

    let accounts: SignerWithAddress[];
    let manager: SoliDroidManager;

    beforeEach(async function () {
        accounts = await ethers.getSigners();
        manager = await new SoliDroidManager__factory(accounts[0]).deploy();
    });

    it("Should test BotInstance update", async function () {

        await expect(manager.updateBot(
            "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
            BigNumber.from("100"),
            BigNumber.from("500"),
            true
        )).to.emit(SoliDroidManager, "BotCreated")
    });
});