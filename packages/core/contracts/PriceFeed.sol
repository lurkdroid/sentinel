// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PriceFeed is Ownable {
    mapping(string => address) aggregators;

    constructor() {}

    function addAggregator(string calldata _pair, address _aggregator)
        public
        onlyOwner
    {
        // _aggregatorkey as AAA/BBB  AAA=BASE & BBB=QUOTE like AAA/BBB
        aggregators[_pair] = _aggregator;
    }

    function getAggregator(string calldata _pair) public view returns (address) {
        return aggregators[_pair];
    }

    function getAmountOutMin(
        address _quote,
        address _base,
        uint256 _amountToReceive
    ) external view returns (uint256) {
        // improve on ERC20 (create own interface?)
        string memory base = ERC20(_base).symbol();
        string memory quote = ERC20(_quote).symbol();
        string memory _aggregator = string(abi.encodePacked(base,"/",quote));
        address priceFeed = aggregators[_aggregator];

        if (address(0) != priceFeed) {
            // do calculations to get amountout min with the price provided
            // 20 uni & 1 weth == 20uni(base)/weth(quote), i want to receive 22 uni
            // price is 20
            // 22/20 is mini amount out
            (,int256 price,,,) = AggregatorV3Interface(priceFeed).latestRoundData();
            return uint(price);

        }

        uint priceQuoteInDollars = getDollarPrice(quote);
        uint priceBaseInDollars = getDollarPrice(base);

        if ( priceQuoteInDollars != 0 && priceBaseInDollars != 0) {
            // logic to be clarified
            return priceQuoteInDollars / priceBaseInDollars;
        }

        uint256 calcOutMin = _amountToReceive / 10000;
        calcOutMin = (calcOutMin / 10000) * (9500);
        calcOutMin = calcOutMin * 10000;
        return calcOutMin;
    }

    function getDollarPrice(string memory _symbol) internal view returns (uint) {
        string memory _aggregator = string(abi.encodePacked(_symbol, "USD"));
        address priceFeed = aggregators[_aggregator];
        if(priceFeed == address(0)) {
            return 0;
        }
        (,int256 price,,,) = AggregatorV3Interface(priceFeed).latestRoundData();
        return uint(price);
    }
}
