// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PositionLib.sol";
import "./BotInstanceLib.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract BotInstance is Ownable, ReentrancyGuard {
    using PositionLib for Position;
    // using BotInstanceLib for BotConfig;

    BotConfig private config;
    Position private position;
    address private beneficiary;

    enum Side {
        Buy,
        Sell
    }

    event TradeComplete_(
        Side side,
        address token0,
        address token1,
        uint256 price,
        uint256 amount
    );

    constructor(
        address _beneficiary,
        address _quoteAsset,
        uint256 _defaultAmount,
        uint256 _stopLossPercent,
        bool _loop
    ) {
        // manager = msg.sender;
        beneficiary = _beneficiary;
        update(_quoteAsset, _defaultAmount, _stopLossPercent, _loop);
    }

    function update(
        address _quoteAsset,
        uint256 _defaultAmount,
        uint256 _stopLossPercent,
        bool _loop
    ) public nonReentrant onlyOwner {
        require(_defaultAmount > 0, "BotInstance: value must be > 0");
        require(
            _stopLossPercent > 0 && _stopLossPercent < 10000,
            "BotInstance: stoploss must be between 0 and 10000"
        );
        config.quoteAsset = _quoteAsset;
        config.defaultAmount = _defaultAmount;
        config.stopLossPercent = _stopLossPercent;
        config.loop = _loop;
    }

    receive() external payable {}

    function getPosition() external view returns (Position memory) {
        return position;
    }

    function getConfig() external view returns (BotConfig memory) {
        return config;
    }

    //================== EXTERNALS ================================//
    function buySignal(address[] memory _path) external nonReentrant {
        require(
            //FIXME check if this actualy works
            position.path.length == 0,
            "BotInstance: cannot open second position"
        );
        require(
            config.quoteAsset == _path[0],
            "BotInstance: quote asset not supported"
        );
        uint256 balance0 = BotInstanceLib.tokenBalance(_path[0]);
        require(balance0 > 0, "BotInstance. insufficient balance");
        if (config.defaultAmountOnly) {
            require(
                balance0 >= config.defaultAmount,
                "BotInstance. balance less that defaul amount"
            );
        }
        uint256 sellAmount = balance0 < config.defaultAmount
            ? balance0
            : config.defaultAmount;

        swap(_path, sellAmount, buyComplete);
    }

    function wakeMe() external view returns (bool toTrigger, Side side) {
        uint256 price = BotInstanceLib.sellPrice(
            position.amount,
            position.path
        );

        if (position.stopLoss > price) {
            toTrigger = true;
            side = Side.Sell;
        }
        if (position.nextTarget() > price) {
            toTrigger = true;
            side = Side.Buy;
        } 
    }

    function botLoop() external nonReentrant onlyOwner {
        uint256 price = BotInstanceLib.sellPrice(
            position.amount,
            position.path
        );

        if (position.underStopLoss = position.stopLoss > price) {
            swap(sellPath(), position.amount, sellComplete);
        }
        if (position.nextTarget() > price) {
            swap(sellPath(), position.nextTargetQuantity(), sellComplete);
            position.targetsIndex++;
        }
    }

    //=================== PRIVATES ======================//
    function swap(
        address[] memory _path,
        uint256 _sellAmount,
        function(address[] memory, uint256, uint256) swapComplete
    ) private {
        uint256 totalOut = BotInstanceLib.swapExactTokensForTokens(
            _path,
            _sellAmount
        );

        swapComplete(_path, _sellAmount, totalOut);
    }

    function sellPath() private view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = position.path[1];
        path[1] = position.path[0];
        return path;
    }

    function sellComplete(
        address[] memory _path,
        uint256 _price,
        uint256 _amount
    ) private {
        emit TradeComplete_(Side.Sell, _path[0], _path[1], _price, _amount);
        position.amount -= _amount;
        if (position.isDone()) {
            if (config.loop) {
                delete position;
                //todo unregister from the loop alert
                //todo register for signal
            } else {
                //TODO return all assets
                //retminate
            }
        }
    }

    function buyComplete(
        address[] memory _path,
        uint256 _price,
        uint256 _amount
    ) private {
        emit TradeComplete_(Side.Buy, _path[0], _path[1], _price, _amount);

        if (position.path.length == 0) {
            position.initialize(_path, _price, config.stopLossPercent);
        }
        position.amount += _amount;
        // position.buyTrades.push(_price); //TODO for cost-average
        // position.updatePrice(_price); //// TODO for trailing stoploss
    }
}
