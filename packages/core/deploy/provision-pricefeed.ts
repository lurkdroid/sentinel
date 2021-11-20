import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { PriceFeed__factory } from '../typechain/factories/PriceFeed__factory';
import supportedOracles from '../utils/oracle/oracles.json';

export const provisionPriceFeed = async (
    network: string,
    address: string,
    owner: SignerWithAddress
) => {
    const priceFeed = await new PriceFeed__factory(owner).attach(address);

    const oraclePairsDeployed = [];
    for (let i = 0; i < supportedOracles[network].length; i++) {
        const oracle = supportedOracles[network][i];
        console.log("-".repeat(20));
        console.log("adding ", oracle.pair, " with proxy: ", oracle.proxy);
        const tx = await priceFeed.addAggregator(oracle.pair, oracle.proxy);
        if ([5, 10, 15, 20, 25, 30, 35, 40].includes(i)) {
            await tx.wait();
        }
        oraclePairsDeployed.push({ pair: oracle.pair, proxy: oracle.proxy });
    }
    console.log("-".repeat(30));
    console.log(`price feed supported in network ${network}`, oraclePairsDeployed);
    // fs.writeFileSync(
    //     path.resolve(deployedPath, "oraclesSupported.json"),
    //     JSON.stringify(oraclePairsDeployed)
    // );
    console.log("-".repeat(30));
};
