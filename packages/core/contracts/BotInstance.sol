// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PositionLib.sol";
import "./BotInstanceLib.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";

contract BotInstance is ReentrancyGuard {
    //FIXME replace error discription with Errors
    using PositionLib for Position;
    address immutable UNISWAP_V2_ROUTER;

    BotConfig private config;
    Position private position;

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
            "only manager"
        );
        _;
    }
    modifier onlyManagerOrBeneficiary() {
        require(
            manager == msg.sender || beneficiary == msg.sender,
            "only manager or beneficiary"
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
        address _uniswap_v2_router,
        address _beneficiary,
        address _quoteAsset,
        uint256 _defaultAmount,
        uint256 _stopLossPercent,
        bool _loop
    ) {
        require(
            //FIXME check its actualy ERC20 addressS
            _beneficiary != address(0),
            "BotInstance: Beneficiary required"
        );
        UNISWAP_V2_ROUTER = _uniswap_v2_router;
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
        require(_defaultAmount > 0, "invalid default amount");
        require(
            _stopLossPercent > 0 && _stopLossPercent < 10000,
            "invalid stoploss"
        );
        require(
            //FIXME check its actualy ERC20 addressS
            _quoteAsset != address(0),
            "invalid quote asset"
        );
        require(
            config.quoteAsset == _quoteAsset || position.asset == address(0),
            "invalid quote asset for open position"
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

    function getPositionAndAmountOut()
        external
        view
        returns (Position memory _position, uint256 _amountOut)
    {
        _position = position;
        _amountOut = position.isInitialize()
            ? BotInstanceLib.getAmountOut(
                UNISWAP_V2_ROUTER,
                position.initialAmountIn,
                position.asset,
                config.quoteAsset
            )
            : 0;
    }

    function getConfig() external view returns (BotConfig memory) {
        return config;
    }

    //================== EXTERNALS ================================//
     function buySignal(address _token0, address _token1)
        external
        nonReentrant
        onlyManagerOrBeneficiary
    {
        require(
            position.asset == address(0),
            "position already open"
        );
        require(
            config.quoteAsset == _token0,
            "quote asset invalid"
        );
        uint256 balance0 = BotInstanceLib.tokenBalance(_token0);
        require(balance0 > 0, "insufficient balance");
        if (config.defaultAmountOnly) {
            require(
                balance0 >= config.defaultAmount,
                "insufficient balance"
            );
        }
        position.asset = _token1;
        uint256 amount = balance0 < config.defaultAmount
            ? balance0
            : config.defaultAmount;

        uint256 amountOut = BotInstanceLib.getAmountOut(
            UNISWAP_V2_ROUTER,
            amount,
            _token0,
            _token1
        );
        swap(_token0, _token1, amount, amountOut, buyComplete);
    }

    function wakeMe() external view returns (bool _wakeme) {
        if (position.isInitialize()) {
            uint256 amountOut = BotInstanceLib.getAmountOut(
                UNISWAP_V2_ROUTER,
                position.initialAmountIn,
                position.asset,
                config.quoteAsset
            );
            _wakeme =
                position.stopLoss > amountOut ||
                position.nextTarget() < amountOut;
        }
    }

    function botLoop() external nonReentrant onlyManagerOrBeneficiary {
        console.log("in bot loop");
        //FIXME if a bot try to trade and get an error it will try again next botLoop
        //FIXME we need to add mechanisme to retry just x times and stop in order not to drain all the gas.
        if (position.isInitialize()) {
            //TODO check how much gas is this call, we can return the amaount from wakeMe() to the manager and back to here.
            position.lastAmountOut = BotInstanceLib.getAmountOut(
                UNISWAP_V2_ROUTER,
                position.initialAmountIn,
                position.asset,
                config.quoteAsset
            );
            if (
                position.underStopLoss =
                    position.stopLoss > position.lastAmountOut
            ) {
                sellSwap(position.asset,config.quoteAsset, position.amount);
                return;
            }
            if (position.nextTarget() < position.lastAmountOut) {
                sellSwap(position.asset,config.quoteAsset, position.nextTargetQuantity());
            }
        }
        
        //FIXME buy signal should only update position.path and botLoop will do the actual traid.
        //FIXME this was if the traid fails it will have another chance to go through
        //FIXME and the signal provider don't need to pay gas for the traid.

    }

    function sellPosition() external nonReentrant onlyManagerOrBeneficiary {
        if (position.isInitialize()) {
            position.underStopLoss = true;
            sellSwap( position.asset, config.quoteAsset, position.amount);
        }
    }

    function acceptSignal(address _quoteAsset) external view returns (bool) {
        return position.asset == address(0) && config.quoteAsset == _quoteAsset;
    }

    //=================== PRIVATES ======================//
    function sellSwap(address _token1, address _token0, uint256 _amountSell) private {
        uint256 amountOut = BotInstanceLib.getAmountOut(
            UNISWAP_V2_ROUTER,
            _amountSell,
            //FIXME check if this is correct ? look like it should be the other way
            _token0,
            _token1
            //END FIXME
        );
        swap( _token1,  _token0, _amountSell, amountOut, sellComplete);
    }

    function swap(
        address _token0, 
        address _token1,
        uint256 amountSpend,
        uint256 amountRecive,
        function(uint256, uint256) swapComplete
    ) private {
        uint256 startBalance = BotInstanceLib.tokenBalance(_token1);

        uint256 calcOutMin = amountRecive  / 10000;
        calcOutMin = (calcOutMin / 10000) * (9500);
        calcOutMin = calcOutMin * 10000;
        BotInstanceLib.swapExactTokensForTokens(
            UNISWAP_V2_ROUTER,
            _token0, 
            _token1,
            amountSpend,
            calcOutMin
        );
        swapComplete(amountSpend, startBalance);
    }

    function sellComplete(uint256 amountSpend, uint256 oldQuoteBalance)
        private
    {
        uint256 quoteNewBalance = BotInstanceLib.tokenBalance(config.quoteAsset);
        uint256 amountIn = quoteNewBalance - oldQuoteBalance;
        emit TradeComplete_(
            Side.Sell,
            config.quoteAsset,
            position.asset,
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
        uint256 baseBalance = BotInstanceLib.tokenBalance(position.asset);
        uint256 amountIn = baseBalance - oldBaseBalance;

        emit TradeComplete_(
            Side.Buy,
            config.quoteAsset,
            position.asset,
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
            //TODO do something else here
            delete position;
            //TODO return all assets
            //terminate
        }
    }
}
