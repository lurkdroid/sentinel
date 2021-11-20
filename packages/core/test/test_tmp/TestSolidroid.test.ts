import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { deployManager } from '../../deploy/deploy-manager';
import { SoliDroidManager__factory } from '../../typechain/factories/SoliDroidManager__factory';
import { SoliDroidManager } from '../../typechain/SoliDroidManager';

describe("SoliDroidManaget", function () {
    let accounts: SignerWithAddress[];
    let manager: SoliDroidManager;

    beforeEach(async function () {
        accounts = await ethers.getSigners();
        const network = await ethers.provider.getNetwork();
        console.log("network is:", { network })

        const managerInfo = await deployManager(
            {
                unknown: {
                    link: ethers.utils.getAddress("0xa36085F69e2889c224210F603D836748e7dC0088"),
                    up_Keep_registry: ethers.utils.getAddress(
                        '0x4Cb093f226983713164A62138C3F718A5b595F73'
                    ),
                    uniswap_v2_router: ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"),
                    manager: {
                        address: "",
                        owner: "",
                        waker: ""
                    }
                },
            }
            , network.name)

        manager = SoliDroidManager__factory.getContract(managerInfo.address, SoliDroidManager__factory.abi, accounts[0]) as unknown as SoliDroidManager;
    });
    it("testing bot creation: ", async () => {
        await expect(
            manager.updateBot(
                "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
                ethers.BigNumber.from("100"),
                ethers.BigNumber.from("500"),
                true
            )
        ).to.emit(SoliDroidManager, "BotCreated")
    })
});
