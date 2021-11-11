import { expect } from 'chai';
import { ethers } from 'hardhat';

import { PriceFeed__factory } from '../typechain';
import { PriceFeed } from '../typechain/PriceFeed';
import oracles from '../utils/supportedOracles.json';


const kovanOracles = oracles["kovan"].slice(0, 2);
const oraclesByAggregator = kovanOracles.reduce((a, b) => { a[b.proxy] = b; return a; }, {})
let feed: PriceFeed;
let contractAddress = "0x23AD0513716D3B6d2bdb6b0c38F36eC7a0C7F01D";

describe("TEST ORACLES KOVAN", function () {
    it("should add aggregators and should be able to get them when called ", async () => {
        this.timeout(0)
        const [owner] = await ethers.getSigners();
        if (contractAddress) {
            feed = await new PriceFeed__factory(owner).attach(contractAddress);

        } else {
            feed = await new PriceFeed__factory(owner).deploy();
            console.log(kovanOracles)
            console.log("feed address===")
            console.log(feed.address)

            await Promise.all(kovanOracles.map(async (aggregator) => {
                const tx = await feed.addAggregator(aggregator.pair, aggregator.proxy);
                await tx.wait()
            }));

            await Promise.all(kovanOracles.map(oracle => oracle.pair).map(async pair => {
                const ag = await feed.getAggregator(pair);
                expect(pair).to.equal(oraclesByAggregator[ag].pair)
            }))
        }
    });

    it("should give the price", async () => {
        const [owner] = await ethers.getSigners();

        const WETH = "0xd0a1e359811322d97991e03f863a0c30c2cf029c";
        const AMPL = "0xe6e69E7d8057Ef1abA70026f1f42A27F88688B05";

        const price = await feed.getAmountOutMin(AMPL, WETH, "100")

        console.log({ price: price.toString() })


    })


});