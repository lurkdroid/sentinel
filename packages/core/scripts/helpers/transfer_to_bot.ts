import { Signer } from "ethers";
import { BotInstance__factory, BotInstance, MockERC20__factory, MockERC20 } from "../../typechain";
import { context } from "../../utils/context";
import chalk from "chalk";

async function main() {

    let network: string;
    let signer: Signer;


    let botInstance: BotInstance;

    console.log(`network: ${chalk.blue(network = await context.netwrok())}`);
    const _addresses = require(`../../utils/solidroid-address-${network}.json`);

    console.log(`signer address: ${chalk.blue(await context.signerAddress())}`);
    signer = (await context.signers())[0];
    let signerAddress = await signer.getAddress();
    let token0Addr = _addresses[network].tokens[0].address;
    let token1Addr = _addresses[network].tokens[3].address;

    botInstance = await BotInstance__factory.connect(_addresses[network].manager.bots[0].address, signer);
    let botAddress = botInstance.address;
    console.log(`bot address: ${chalk.blue(botAddress)}`);

    let mockERC20_0 = await MockERC20__factory.connect(token0Addr, signer);
    let mockERC20_1 = await MockERC20__factory.connect(token1Addr, signer);

    printBalance(mockERC20_0, signerAddress, "signer");
    printBalance(mockERC20_1, signerAddress, "signer");

    printBalance(mockERC20_0, botAddress, "bot");
    printBalance(mockERC20_1, botAddress, "bot");

    let token0balance = await mockERC20_0.balanceOf(signerAddress);
    await mockERC20_0.approve(botInstance.address, token0balance);
    await mockERC20_0.transfer(botInstance.address, token0balance);

    printBalance(mockERC20_0, signerAddress, "signer");
    printBalance(mockERC20_1, signerAddress, "signer");

    printBalance(mockERC20_0, botAddress, "bot");
    printBalance(mockERC20_1, botAddress, "bot");
}

async function printBalance(mockERC20: MockERC20, address: string, who: string) {
    let bot1balance = await mockERC20.balanceOf(address);
    console.log(`${who} ${await mockERC20.symbol()} balance: ${chalk.green(bot1balance)}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
