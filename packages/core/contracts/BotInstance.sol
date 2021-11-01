// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BotInstance is Ownable, ReentrancyGuard {
    // address private manager;

    //TODO all user define configuration will be aggrigate into botConfig struct
    uint256 private defaultAmount;
    uint256 private stopLossPercent; //percent in basis point. %5 == 500.
    address private quoteAsset;
    // uint256 private trailingStoplossPercent;
    // bool private useTrailingStoploss;
    // bool private costAverage;
    bool private loop;

    constructor(
        address _quoteAsset,
        uint256 _defaultAmount,
        uint256 _stopLossPercent,
        bool _loop
    ) payable {
        // manager = msg.sender;
        update(_quoteAsset, _defaultAmount, _stopLossPercent, _loop);
    }

    function update(
        address _quoteAsset,
        uint256 _defaultAmount,
        uint256 _stopLossPercent,
        bool _loop
    ) public payable nonReentrant onlyOwner {
        require(_defaultAmount > 0, "value must greater than 0");
        require(
            _stopLossPercent > 0 && _stopLossPercent < 10000,
            "BotInstance: stoploss must be >0 and <10000"
        );
        quoteAsset = _quoteAsset;
        defaultAmount = _defaultAmount;
        stopLossPercent = _stopLossPercent;
        loop = _loop;
    }

    //================== EXTERNALS ================================//
    function onBuySignal(address[] memory _path) external nonReentrant {}

    function onPriceChange() external nonReentrant {}

    function getProperties()
        external
        view
        returns (
            address,
            uint256,
            uint256,
            bool
        )
    {
        return (quoteAsset, defaultAmount, stopLossPercent, loop);
    }
}
