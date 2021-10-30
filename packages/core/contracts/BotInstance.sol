// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PositionLib.sol";
import "./BotInstanceLib.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract BotInstance is ReentrancyGuard {
    //FIXME replace error discription with Errors
    using PositionLib for Position;

    BotConfig private config;
    Position private position;

    //FIXME needs factory address
    // address private immutable uniswapV2Library; //
    //FIXME manager needs to be immutable, but read in update that is called by ctor
    address private manager;
    address private beneficiary;

    modifier onlyBeneficiary() {
        require(
            beneficiary == msg.sender,
            "BotInstance: caller is not the beneficiary"
        );
        _;
    }
    modifier onlyManager() {
        require(
            manager == msg.sender,
            "BotInstance: caller is not the manager"
        );
        _;
    }
    modifier onlyManagerOrBeneficiary() {
        require(
            manager == msg.sender || beneficiary == msg.sender,
            "BotInstance: caller is not the manager or beneficiary"
        );
        _;
    }
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
        // address _uniswapV2Library,
        address _beneficiary,
        address _quoteAsset,
        uint256 _defaultAmount,
        uint256 _stopLossPercent,
        bool _loop
    ) {
        //uniswapV2Library = _uniswapV2Library;
        require(
            //FIXME check its actualy ERC20 addressS
            _beneficiary != address(0),
            "BotInstance: Beneficiary required"
        );
        manager = msg.sender;
        beneficiary = _beneficiary;
        update(_quoteAsset, _defaultAmount, _stopLossPercent, _loop);
    }

    function update(
        address _quoteAsset,
        uint256 _defaultAmount,
        uint256 _stopLossPercent,
        bool _loop
    ) public nonReentrant onlyManagerOrBeneficiary {
        require(_defaultAmount > 0, "BotInstance: value must be > 0");
        require(
            _stopLossPercent > 0 && _stopLossPercent < 10000,
            "BotInstance: stoploss must be between 0 and 10000"
        );
        require(
            //FIXME check its actualy ERC20 addressS
            _quoteAsset != address(0),
            "BotInstance: Quote asset required"
        );
        config.quoteAsset = _quoteAsset;
        config.defaultAmount = _defaultAmount;
        config.stopLossPercent = _stopLossPercent;
        config.loop = _loop;
    }

    function withdraw(address _token) external onlyBeneficiary {
        BotInstanceLib.withdrawToken(_token, beneficiary);
    }

    function getPosition() external view returns (Position memory) {
        return position;
    }

    function getConfig() external view returns (BotConfig memory) {
        return config;
    }

    //================== EXTERNALS ================================//
    function buySignal(address[] memory _path)
        external
        nonReentrant
        onlyManagerOrBeneficiary
    {
        require(
            position.path.length == 0,
            "BotInstance: cannot open second position"
        );
        require(
            config.quoteAsset == _path[0],
            "BotInstance: quote asset not supported"
        );
        // require(
        //     BotInstanceLib.getPair(uniswapV2Library, _path) == address(0),
        //     "BotInstance: path not found"
        // );
        uint256 balance0 = BotInstanceLib.tokenBalance(_path[0]);
        require(balance0 > 0, "BotInstance: insufficient balance");
        if (config.defaultAmountOnly) {
            require(
                balance0 >= config.defaultAmount,
                "BotInstance. balance less that defaul amount"
            );
        }
        position.path = _path;
        uint256 sellAmount = balance0 < config.defaultAmount
            ? balance0
            : config.defaultAmount;

        swap(_path, sellAmount, buyComplete);
    }

    function wakeMe() external view returns (bool) {
        if (position.isInitialize()) {
            uint256 price = BotInstanceLib.sellPrice(
                position.amount,
                position.path
            );
            return position.stopLoss > price || position.nextTarget() > price;
        }
        return false;
    }

    function botLoop() external nonReentrant onlyManagerOrBeneficiary {
        // FIXME for new will use 'if'
        // require(position.isInitialize(), "BotInstance: no open position");
        if (position.isInitialize()) {
            uint256 price = BotInstanceLib.sellPrice(
                position.initialAmount,
                position.path
            );
            // testEntry.value1 = position.initialAmount;
            // testEntry.value2 = price;
            position.lastPrice = price;
            if (position.underStopLoss = position.stopLoss > price) {
                swap(sellPath(), position.amount, sellComplete);
                return;
            }
            if (position.nextTarget() < price) {
                swap(sellPath(), position.nextTargetQuantity(), sellComplete);
                position.targetsIndex++;
            }
        }
    }

    //=================== PRIVATES ======================//
    function sellPath() private view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = position.path[1];
        path[1] = position.path[0];
        return path;
    }

    function swap(
        address[] memory _path,
        uint256 _sellAmount,
        function(uint256, uint256) swapComplete
    ) private {
        uint256 startBalance = BotInstanceLib.tokenBalance(_path[1]);
        BotInstanceLib.swapExactTokensForTokens(_path, _sellAmount);
        swapComplete(_sellAmount, startBalance);
    }

    function sellComplete(uint256 _price, uint256 oldBalance) private {
        uint256 balance = BotInstanceLib.tokenBalance(position.path[1]);

        uint256 amount = oldBalance - balance;
        emit TradeComplete_(
            Side.Sell,
            position.path[0],
            position.path[1],
            _price,
            amount
        );
        if (position.isDone()) {
            if (config.loop) {
                delete position;
                //todo unregister from the loop alert
                //todo register for signal
            } else {
                //TODO return all assets
                //retminate
            }
        } else {
            position.amount -= amount;
        }
    }

    function buyComplete(uint256 _price, uint256 oldBalance) private {
        uint256 balance = BotInstanceLib.tokenBalance(position.path[1]);
        uint256 amount = balance - oldBalance;

        emit TradeComplete_(
            Side.Buy,
            position.path[0],
            position.path[1],
            _price,
            amount
        );
        if (position.initialAmount == 0) {
            position.initialize(_price, config.stopLossPercent, amount);
        }
        position.amount += amount;
        // position.buyTrades.push(_price); //TODO for cost-average
        // position.updatePrice(_price); //// TODO for trailing stoploss
    }

    function acceptSignal(address _quoteAsset) external view returns (bool) {
        return position.path.length == 0 && config.quoteAsset == _quoteAsset;
    }
}
