import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { deployManager } from '../../deploy/deploy-manager';
import { SoliDroidManager__factory } from '../../typechain/factories/SoliDroidManager__factory';
import { SoliDroidManager } from '../../typechain/SoliDroidManager';

describe("SoliDroidManager", function () {
  let accounts: SignerWithAddress[];
  let manager: SoliDroidManager;

  this.beforeAll(async function () {
    this.timeout(0);
    accounts = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    console.log("network is:", { network });

    const managerInfo = await deployManager(
      {
        kovan: {
          link: ethers.utils.getAddress(
            "0xa36085F69e2889c224210F603D836748e7dC0088"
          ),
          up_Keep_registry: ethers.utils.getAddress(
            "0x4Cb093f226983713164A62138C3F718A5b595F73"
          ),
          uniswap_v2_router: ethers.utils.getAddress(
            "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
          ),
          manager: {
            address: "",
            owner: "",
            waker: "",
          },
        },
      },
      "kovan"
    );

    manager = SoliDroidManager__factory.getContract(
      managerInfo.address,
      SoliDroidManager__factory.abi,
      accounts[0]
    ) as unknown as SoliDroidManager;
  });

  it("testing bot creation: ", async function () {
    this.timeout(0);
    await expect(
      manager.updateBot(
        "0xd0A1E359811322d97991E03f863a0C30C2cF029C", // weth
        ethers.utils.parseEther("0.1"),
        ethers.utils.parseUnits("5", 2),
        true
      )
    ).to.emit(manager, "BotCreated");
  });

  it("create supporting pairs", async function () {
    this.timeout(0);
    const resp = await manager.connect(accounts[0]).addSupportedPair(
      "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
      "0xff795577d9ac8bd7d90ee22b6c1703490b6512fd" // DAI
    );
  });
});
