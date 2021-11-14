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
        address[] memory _path,
        uint256 _amountIn,
        uint256 _amountOutMin
    ) external {
        IERC20 token0 = IERC20(_path[0]);
        require(
            token0.approve(UNISWAP_V2_ROUTER, _amountIn),
            "approve failed."
        );
        IUniswapV2Router02(UNISWAP_V2_ROUTER).swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            _path,
            address(this),
            block.timestamp
        );
    }

    function getAmountOut(
        address UNISWAP_V2_ROUTER,
        uint256 _amountIn,
        address[] memory _path
    ) external view returns (uint256) {
        require(_path.length == 2, "Lib:getAmountOut path.length != 2");
        return
            IUniswapV2Router02(UNISWAP_V2_ROUTER).getAmountsOut(
                _amountIn,
                _path
            )[1];
    }
}
