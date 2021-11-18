// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PositionLib.sol";
import "./BotInstanceLib.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";

contract BotInstance is ReentrancyGuard {

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
        Sell,
        Withdraw
    }

    event TradeComplete_(
        Side side,
        address token0,
        address token1,
        uint256 amount0,
        uint256 amount1,
        uint indexed pTime,
        uint tTime
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
            _beneficiary != address(0),
            "invalid beneficiary"
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
        require(_defaultAmount > 0, "invalid amount");
        require(
            _stopLossPercent > 0 && _stopLossPercent < 10000,
            "invalid stoploss"
        );
        require(
            //FIXME check its supported token
            _quoteAsset != address(0),
            "invalid quote asset"
        );
        config.quoteAsset = _quoteAsset;
        config.defaultAmount = _defaultAmount;
        config.stopLossPercent = _stopLossPercent;
        config.loop = _loop;
    }

    function withdraw(address _token) external onlyBeneficiary {
        //FIXME
        //check if it withdrew the position amount
        //if yes close the position and send event
        if (position.isInitialize()&&_token==position.path[1]) {
            emit TradeComplete_(
                Side.Sell,
                position.path[0],
                position.path[1],
                0,
                0,
                position.time,
                block.timestamp
            );
            closePosition();
        }
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
                calcSellPath()
            )
            : 0;
    }

    function getConfig() external view returns (BotConfig memory) {
        return config;
    }

    //================== EXTERNALS ================================//
    //function buySignal(address _t0, address _t1)  //gas 22219
     function buySignal(address[] memory _path)     //gas 23004
        external
        nonReentrant                                //gas 24648 (1644)
        onlyManagerOrBeneficiary                    //ges 27139 (2491)
    {
        require(
            position.path.length == 0,
            "position already open"
        );                                          //gas 27959 (820) - //TODO check, look like modifer cost more !
        require(
            config.quoteAsset == _path[0] &&
            config.quoteAsset != _path[1] &&
            _path[1] != address(0),
            "invalid quote asset"
        );                                         //gas 28873 (914)

        uint256 balance0 = BotInstanceLib.tokenBalance(_path[0]); //gas 33990 (5117) //TODO calling without library is 31897 (2093 less)
        require(balance0 > 0, "insufficient balance");
        if (config.defaultAmountOnly) {                           //gas 34859 (869)
            require(
                balance0 >= config.defaultAmount,
                "insufficient balance"
            );
        }
        position.path = _path;                                    //$$$ gas 97745 (62886) //TODO can keep only base asset on position
        uint256 amount0 = balance0 < config.defaultAmount
            ? balance0
            : config.defaultAmount;                               //gas 99392 (1647)

        uint256 amount1Out = BotInstanceLib.getAmountOut(          //gas 113782 (14390)
            UNISWAP_V2_ROUTER,
            amount0,
            position.path
        );

        uint256 oldAmount1 = BotInstanceLib.tokenBalance(_path[1]);  //gas 8725   (122507)
        swap(position.path, amount0, amount1Out, oldAmount1, buyComplete);     //gas 407539 (293757)
    }

    function wakeMe() external view returns (bool _wakene) {
        if (position.isInitialize()) {
            uint256 amountOut = BotInstanceLib.getAmountOut(
                UNISWAP_V2_ROUTER,
                position.initialAmountIn,
                calcSellPath()
            );
            _wakene =
                position.stopLoss > amountOut ||
                position.nextTarget() < amountOut;
        }
    }

    function botLoop() external nonReentrant onlyManagerOrBeneficiary {
        console.log("in bot loop");
        //FIXME if a bot try to trade and get an error it will try again next botLoop
        //FIXME we need to add mechanisme to retry just x times and stop in order not to drain all the gas.
        if (position.isInitialize()) {
            address[] memory sellPath = calcSellPath();
            //TODO check how much gas is this call, we can return the amaount from wakeMe() to the manager and back to here.
            position.lastAmountOut = BotInstanceLib.getAmountOut(
                UNISWAP_V2_ROUTER,
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
        //FIXME buy signal should only update position.path and botLoop will do the actual traid.
        //FIXME this was if the traid fails it will have another chance to go through
        //FIXME and the signal provider don't need to pay gas for the traid.
    }

    function sellPosition() external nonReentrant onlyManagerOrBeneficiary {
        if (position.isInitialize()) {
            position.underStopLoss = true;
            sellSwap(calcSellPath(), position.amount);
        }
    }

    function acceptSignal(address _quoteAsset) external view returns (bool) {
        return position.path.length == 0 && config.quoteAsset == _quoteAsset;
    }

    //=================== PRIVATES ======================//
    function sellSwap(address[] memory _path, uint256 _amount1) private {
        uint256 amount0Out = BotInstanceLib.getAmountOut(
            UNISWAP_V2_ROUTER,
            _amount1,
            _path
        );
        //take balance of 0 using [1] for sell path
        uint256 oldAmount0 = BotInstanceLib.tokenBalance(_path[1]);  //gas 8725   (122507)
        swap(_path, _amount1, amount0Out, oldAmount0, sellComplete);
    }

    function swap(
        address[] memory _path,
        uint256 amountSpend,
        uint256 amountRecive,
        uint256 oldAmount,
        function(uint256, uint256) swapComplete
    ) private {

        uint256 calcOutMin = amountRecive  / 10000;
        calcOutMin = (calcOutMin / 10000) * (9500);
        calcOutMin = calcOutMin * 10000;                         //gas 324      (122831)
        BotInstanceLib.swapExactTokensForTokens(
            UNISWAP_V2_ROUTER,
            _path,
            amountSpend,
            calcOutMin
        );                                                      //gas 78947        (201778)

        swapComplete(amountSpend, oldAmount);                //gas 205761       (407539)
    }
    // function  buyComplete(uint256 amount0, uint256 oldAmount1) private {
    // function sellComplete(uint256 amount1, uint256 oldAmount0 )

    function sellComplete(uint256 amount1, uint256 oldAmount0 )
        private
    {
        uint256 currentAmount0 = BotInstanceLib.tokenBalance(position.path[0]);
        uint256 amount0 = currentAmount0 - oldAmount0;
        emit TradeComplete_(
            Side.Sell,
            position.path[0],
            position.path[1],
            amount0,
            amount1,
            position.time,
            block.timestamp
        );
        if (!position.underStopLoss) {
            position.amount -= amount1;
            position.targetsIndex++;
        }
        if (position.isDone()) {
            closePosition();
        }
    }

    function buyComplete(uint256 amount0,uint256  oldAmount1) private {
        uint256 currecntAmount1 = BotInstanceLib.tokenBalance(position.path[1]);
        uint256 amount1 = currecntAmount1 - oldAmount1;

        if (!position.isInitialize()) {
            position.initialize(amount0, config.stopLossPercent, amount1);
        }
        emit TradeComplete_(
            Side.Buy,
            position.path[0],
            position.path[1],
            amount0,
            amount1,
            position.time,
            block.timestamp
        );
        position.amount += amount1;
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

    function calcSellPath() private view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = position.path[1];
        path[1] = position.path[0];
        return path;
    }
}
