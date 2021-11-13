// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PriceFeedAggregatorTest is Ownable {
    // aggregator kovan AMPL/ETH ==> AMPL maybe is FORTH
    address immutable priceFeed = 0x562C092bEb3a6DF77aDf0BB604F52c018E4f2814;

    function getPrice() public view returns (uint256) {

        (,int256 price,,,) = AggregatorV3Interface(priceFeed).latestRoundData();

      return uint(price);
    }

    function getSymbol(address _token) public view returns (string memory){
        return ERC20(_token).symbol();
    }


    function getPair(string memory _one, string memory _two) public view returns (string memory) {
        return string(abi.encodePacked(_one,"/",_two));
    }


}
