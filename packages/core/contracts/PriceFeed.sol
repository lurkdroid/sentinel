// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract PriceFeed is Ownable {

    using SafeMath for uint256;
    mapping(address => address) aggregators;

    function addAggregator(address asset, address _aggregator)
        public
        onlyOwner
    {
        aggregators[asset] = _aggregator;
    }

    function getAggregator(address asset) public view returns (address) {
        return aggregators[asset];
    }

    function getPrice(
        address _base,
        address _quote
    ) external view returns (uint256) {

        address basePriceFeed = aggregators[_base];
        address quotePriceFeed = aggregators[_quote];

        if (address(0) != basePriceFeed && address(0)!= quotePriceFeed) {
            // do calculations to get amountout min with the price provided
            // 20 uni & 1 weth == 20uni(base)/weth(quote), i want to receive 22 uni
            // price is 20
            // 22/20 is mini amount out
            (,int256 _basePrice,,,) = AggregatorV3Interface(basePriceFeed).latestRoundData();
            (,int256 _quotePrice,,,) = AggregatorV3Interface(quotePriceFeed).latestRoundData();

            uint256 basePrice = uint256(_basePrice).mul(10**8);
            uint256 price = basePrice.div(uint256(_quotePrice));

            return price;
        }else{
            return 0;
        }
    }
    
    function getLastByAsset(address asset) external view returns(int256){
        address priceFeed = aggregators[asset];
        (,int256 price,,,) = AggregatorV3Interface(priceFeed).latestRoundData();
        return price;
    }
    
    function getLastRoundDate(address aggregator) external view returns(int256){
        (,int256 price,,,) = AggregatorV3Interface(aggregator).latestRoundData();
        return price;
    }
}
