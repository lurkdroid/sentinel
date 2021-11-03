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
        uint256 amount0,
        uint256 amount1
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
        uint256 amount = balance0 < config.defaultAmount
            ? balance0
            : config.defaultAmount;

        uint256 amountOut = BotInstanceLib.getAmountOut(amount, position.path);
        swap(position.path, amount, amountOut, buyComplete);
    }

    function wakeMe() external view returns (bool) {
        if (position.isInitialize()) {
            uint256 price = BotInstanceLib.getAmountOut(
                position.amount,
                calcSellPath()
            );
            return position.stopLoss > price || position.nextTarget() > price;
        }
        return false;
    }

    function botLoop() external nonReentrant onlyManagerOrBeneficiary {
        if (position.isInitialize()) {
            //TODO hold the sell path in memory
            address[] memory sellPath = calcSellPath();
            position.lastAmountOut = BotInstanceLib.getAmountOut( //this is amount out of token 0 beacase we sell
                position.initialAmountIn,
                sellPath
            );
            if (
                position.underStopLoss =
                    position.stopLoss > position.lastAmountOut
            ) {
                sellSwap(sellPath, position.amount);
                return;
            }
            if (position.nextTarget() < position.lastAmountOut) {
                sellSwap(sellPath, position.nextTargetQuantity());
            }
        }
    }

    function acceptSignal(address _quoteAsset) external view returns (bool) {
        return position.path.length == 0 && config.quoteAsset == _quoteAsset;
    }

    //=================== PRIVATES ======================//
    function sellSwap(address[] memory _path, uint256 _amountSell) private {
        uint256 amountOut = BotInstanceLib.getAmountOut(
            _amountSell,
            position.path
        );
        swap(_path, _amountSell, amountOut, sellComplete);
    }

    function swap(
        address[] memory _path,
        uint256 amountSpend,
        uint256 amountRecive,
        function(uint256, uint256) swapComplete
    ) private {
        uint256 startBalance = BotInstanceLib.tokenBalance(_path[1]);

        uint256 calcOutMin = amountRecive / 10000;
        calcOutMin = (calcOutMin / 10000) * (9500);
        calcOutMin = calcOutMin * 10000;
        BotInstanceLib.swapExactTokensForTokens(_path, amountSpend, calcOutMin);

        swapComplete(amountSpend, startBalance);
    }

    function sellComplete(uint256 amountSpend, uint256 oldQuoteBalance)
        private
    {
        uint256 quoteNewBalance = BotInstanceLib.tokenBalance(position.path[0]);
        uint256 amountIn = quoteNewBalance - oldQuoteBalance;
        emit TradeComplete_(
            Side.Sell,
            position.path[0],
            position.path[1],
            amountIn,
            amountSpend
        );
        if (!position.underStopLoss) {
            position.amount -= amountSpend;
            position.targetsIndex++;
        }
        if (position.isDone()) {
            closePosition();
        }
    }

    function buyComplete(uint256 amountSpend, uint256 oldBaseBalance) private {
        uint256 baseBalance = BotInstanceLib.tokenBalance(position.path[1]);
        uint256 amountIn = baseBalance - oldBaseBalance;

        emit TradeComplete_(
            Side.Buy,
            position.path[0],
            position.path[1],
            amountSpend,
            amountIn
        );
        if (!position.isInitialize()) {
            position.initialize(amountSpend, config.stopLossPercent, amountIn);
        }
        position.amount += amountIn;
        // position.buyTrades.push(_price); //TODO for cost-average
        // position.updatePrice(_price); //// TODO for trailing stoploss
    }

    function closePosition() private {
        if (config.loop) {
            delete position;
            //todo unregister from the loop alert
            //todo register for signal
        } else {
            //TODO return all assets
            //terminate
        }
    }

    function calcSellPath() private view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = position.path[1];
        path[1] = position.path[0];
        return path;
    }
}
