// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

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
}

library BotInstanceLib {
    address private constant UNISWAP_V2_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    IUniswapV2Router02 private constant router =
        IUniswapV2Router02(UNISWAP_V2_ROUTER);

    function tokenBalance(address _token) public view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }

    function swapExactTokensForTokens(
        address[] memory _path,
        uint256 _sellAmount
    ) external returns (uint256) {
        IERC20 token0 = IERC20(_path[0]);
        require(
            token0.approve(UNISWAP_V2_ROUTER, _sellAmount),
            "approve failed."
        );

        uint256 startBalance1 = tokenBalance(_path[1]);

        router.swapExactTokensForTokens(
            _sellAmount,
            0,
            _path,
            address(this),
            block.timestamp
        );
        return tokenBalance(_path[1]) - startBalance1;
    }

    function sellPrice(uint256 _amountIn, address[] memory _path)
        external
        view
        returns (uint256)
    {
        require(_path.length == 2, "Lib:sellPrice path length is not 2");
        //TODO test to see if this change to path by reference
        address tmp = _path[0];
        _path[0] = _path[1];
        _path[1] = tmp;
        return _amountIn / router.getAmountsOut(_amountIn, _path)[0];
    }
}
