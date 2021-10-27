import { expect } from "chai";
import { ethers } from "hardhat";
import { Greeter } from '../typechain/Greeter';
import { ERC20__factory } from '../typechain/factories/ERC20__factory';
import { MyToken__factory } from '../typechain/factories/MyToken__factory';

let greeter: Greeter;

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });


  it("should have eth", async () => {
    const [owner] = await ethers.getSigners();
    const tx = await owner.sendTransaction({
      to: greeter.address,
      value: ethers.utils.parseEther(1 + "")
    });
    const balance = await ethers.provider.getBalance(greeter.address)
    console.log(balance.toString())
    expect(ethers.utils.formatEther(balance)).to.be.equal("1.0")

  })

  it("pay ethers from greeter", async () => {
    const [owner, other] = await ethers.getSigners();
    // link with amount 200 minte
    const mockLink = await new MyToken__factory(other).deploy(ethers.utils.parseEther("55588.0"))
    // chainlink --> botinstance should pay for gas to swap
    const tx = await greeter.connect(owner).pay(mockLink.address);
    await tx.wait()

    expect(await mockLink.balanceOf(owner.address)).to.be.equal("5000");


    const balance = await ethers.provider.getBalance(greeter.address)
    expect(ethers.utils.formatEther(balance)).to.be.lessThan("1.0")

  })
}
);
