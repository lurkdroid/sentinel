import { expect } from 'chai';
import { ethers } from "hardhat";
import { PriceFeed__factory } from '../typechain';

describe("TEST ORACLES", function () {
    it("should add aggregators and should be able to get them when called ", async () => {
        this.timeout(0)
        const oracles = require('../utils/oracle/oracles.json');

        // const [owner] = await ethers.getSigners()[0];
        // const feed = await new PriceFeed__factory(owner).deploy();
        // console.log(oracles)

        await Promise.all(oracles["matic"].map(async (aggregator:any) => {
            console.log(aggregator.pair,"  ", aggregator.address, aggregator.proxy);
            
            // await feed.addAggregator(aggregator.address, aggregator.proxy);
        }));

        // await Promise.all(kovanOracles.map(oracle => oracle.pair).map(async pair => {
        //     const ag = await feed.getAggregator(pair);
        //     expect(pair).to.equal(oraclesByAggregator[ag].pair)
        // }))


    });
});
