// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PriceFeed is Ownable {
    mapping(string => address) aggregators;

    constructor() {}

    function addAggregator(string memory _aggregatorKey, address _aggregator)
        public
        onlyOwner
    {
        // _aggregatorkey as AAABBB  AAA=BASE & BBB=QUOTE like AAA/BBB
        aggregators[_aggregatorKey] = _aggregator;
    }

    function getAmountOutMin(
        address _quote,
        address _base,
        uint256 _amountToReceive
    ) external view returns (uint256) {
        // improve on ERC20 (create own interface?)
        string memory base = ERC20(_base).symbol();
        string memory quote = ERC20(_quote).symbol();
        string memory _aggregator = string(abi.encodePacked(base, quote));
        address priceFeed = aggregators[_aggregator];

        if (address(0) == priceFeed) {
            uint256 calcOutMin = _amountToReceive / 10000;
            calcOutMin = (calcOutMin / 10000) * (9500);
            calcOutMin = calcOutMin * 10000;
            return calcOutMin;
        }
        (
            uint80 roundID,
            int256 price, // price is integer (could be negative)
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = AggregatorV3Interface(priceFeed).latestRoundData();

        // do calculations to get amountout min with the price provided
        // 20 uni & 1 weth == 20uni(base)/weth(quote), i want to receive 22 uni
        // price is 20
        // 22/20 is mini amount out
        return uint256(price);
    }
}
