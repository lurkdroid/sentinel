import { expect } from 'chai';
import { ethers } from 'hardhat';

import { PriceFeed__factory } from '../typechain';
import oracles from '../utils/supportedOracles.json';


const kovanOracles = oracles["kovan"];
const oraclesByAggregator = kovanOracles.reduce((a, b) => { a[b.proxy] = b; return a; }, {})
describe("TEST ORACLES", function () {
    it("should add aggregators and should be able to get them when called ", async () => {
        this.timeout(0)
        const [owner] = await ethers.getSigners();
        const feed = await new PriceFeed__factory(owner).deploy();
        console.log(oracles)

        await Promise.all(oracles["kovan"].map(async (aggregator) => {
            await feed.addAggregator(aggregator.pair, aggregator.proxy);
        }));

        await Promise.all(kovanOracles.map(oracle => oracle.pair).map(async pair => {
            const ag = await feed.getAggregator(pair);
            expect(pair).to.equal(oraclesByAggregator[ag].pair)
        }))


    });


});
