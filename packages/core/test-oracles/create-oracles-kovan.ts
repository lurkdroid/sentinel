import { expect } from 'chai';
import { ethers } from 'hardhat';

import { PriceFeed__factory } from '../typechain';
import { PriceFeedAggregatorTest__factory } from '../typechain/factories/PriceFeedAggregatorTest__factory';
import { PriceFeed } from '../typechain/PriceFeed';
import { PriceFeedAggregatorTest } from '../typechain/PriceFeedAggregatorTest';
import oracles from '../utils/supportedOracles.json';


const kovanOracles = oracles["kovan"].slice(0, 2);
const oraclesByAggregator = kovanOracles.reduce((a, b) => { a[b.proxy] = b; return a; }, {})
let feed: PriceFeed;
let contractAddress = "0x381272300675c65a354442859a138221eB336a9F";
let testingPF: PriceFeedAggregatorTest;
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
        // AMPL IS FORTH MAYBE
        const WETH = "0xd0a1e359811322d97991e03f863a0c30c2cf029c";
        const AMPL = "0xe6e69E7d8057Ef1abA70026f1f42A27F88688B05";

        const price = await feed.getAmountOutMin(AMPL, WETH, "100")

        console.log({ price: price.toString() })
    })


    it("should give price from testing pricefeed", async () => {
        const [owner] = await ethers.getSigners();
        testingPF = await new PriceFeedAggregatorTest__factory(owner).deploy();
        console.log("address testing price feed:", testingPF.address);
        const price = await testingPF.getPrice();

        console.log("price is", price.toString())
        // 211308144691145
        expect(Number(price.toString())).to.be.greaterThan(0);

    })
    it("should give back the symbol", async () => {

        const WETH = "0xd0a1e359811322d97991e03f863a0c30c2cf029c";
        const AMPL = "0xe6e69E7d8057Ef1abA70026f1f42A27F88688B05";
        const weth = await testingPF.getSymbol(WETH);
        const ampl = await testingPF.getSymbol(AMPL);
        console.log({ weth, ampl })
        expect(weth).to.be.equal("WETH");
        expect(ampl).to.be.equal("FORTH");
    })

    it("should concatenate the values:", async () => {

        const pair = await testingPF.getPair("USD", "CAN")


        console.log({ pair });

        expect(pair).to.be.equal("USD/CAN")
    })





});