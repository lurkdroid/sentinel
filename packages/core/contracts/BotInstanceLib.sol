// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";

import "hardhat/console.sol";

struct BotConfig {
    uint256 defaultAmount;
    uint256 stopLossPercent; //percent in basis point. %5 == 500.
    address quoteAsset;
    // uint256 private trailingStoplossPercent; //trailing stop loss to use in basis point
    // bool private useTrailingStoploss;
    // bool private costAverage;
    bool loop; //if loop is true this instance will remain active after position is closed and wait for another signal.
    bool defaultAmountOnly;
    //slippagePercent
    //targetsPricePercent[]
    //targetsAmountPercent[]
    //
}

library BotInstanceLib {

    function tokenBalance(address _token) public view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }

    function withdrawToken(address _token, address _beneficiary) public {
        uint256 balance = tokenBalance(_token);
        IERC20(_token).approve(_beneficiary, balance);
        IERC20(_token).transfer(_beneficiary, balance);
    }

    function swapExactTokensForTokens(
        address UNISWAP_V2_ROUTER,
        address _token0, 
        address _token1,
        uint256 _amountIn,
        uint256 _amountOutMin
    ) external {
        IERC20 token0 = IERC20(_token0);
        require(
            token0.approve(UNISWAP_V2_ROUTER, _amountIn),
            "approve failed."
        );
        address[] memory path;
        path[0] = _token0 ;
        path[1] = _token1 ;
        IUniswapV2Router02(UNISWAP_V2_ROUTER).swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            path,
            address(this),
            block.timestamp
        );
    }

    function getAmountOut(
        address UNISWAP_V2_ROUTER,
        uint256 _amountIn,
        address  _token0,
        address  _token1
    ) external view returns (uint256) {
        address[] memory path;
        path[0] = _token0 ;
        path[1] = _token1 ;
        return
            IUniswapV2Router02(UNISWAP_V2_ROUTER).getAmountsOut(
                _amountIn,
                path
            )[1];
    }
}
