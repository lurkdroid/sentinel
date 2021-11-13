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
        address _base,
        address _quote,
        uint256 _amountToReceive
    ) external view returns (uint256) {
        (address priceFeed, string memory base, string memory quote) = getAggregator(_base, _quote);

        if (address(0) != priceFeed) {
            // do calculations to get amountout min with the price provided
            // 20 uni & 1 weth == 20uni(base)/weth(quote), i want to receive 22 uni
            // price is 20
            // 22/20 is mini amount out
            (,int256 price,,,) = AggregatorV3Interface(priceFeed).latestRoundData();
            return uint(price);
        }

        uint price = getPriceFeedFromDollar(base, quote);
        if( price !=0 ) {
            return price;
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


    function getSymbol(address _symbol) internal view returns (string memory) {
         string memory symbol = ERC20(_symbol).symbol();
        if(keccak256(bytes(symbol)) == keccak256(bytes("WETH"))){
            symbol = "ETH";
        }
        return symbol;
    }

    function getAggregator(address _base, address _quote) internal view returns (address, string memory, string memory) {
        string memory base = getSymbol(_base);
        string memory quote = getSymbol(_quote);
        string memory _aggregator = string(abi.encodePacked(base,"/",quote));
        return (aggregators[_aggregator], base, quote);
    }

    function getPriceFeedFromDollar(string memory _base, string memory _quote) internal view returns (uint) {
        uint priceBaseInDollars = getDollarPrice(_base);
        uint priceQuoteInDollars = getDollarPrice(_quote);

        if ( priceQuoteInDollars != 0 && priceBaseInDollars != 0) {
            // logic to be clarified
            return priceQuoteInDollars / priceBaseInDollars;
        }
        return 0;
    }
}
