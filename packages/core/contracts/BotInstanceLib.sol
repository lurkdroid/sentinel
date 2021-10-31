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
}

library BotInstanceLib {
    address private constant UNISWAP_V2_ROUTER =
        0xf012702a5f0e54015362cBCA26a26fc90AA832a3;
    IUniswapV2Router02 private constant router =
        IUniswapV2Router02(UNISWAP_V2_ROUTER);

    function tokenBalance(address _token) public view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }

    function getPair(address factory, address[] memory _path)
        public
        view
        returns (address)
    {
        return IUniswapV2Factory(factory).getPair(_path[0], _path[1]);
    }

    function withdrawToken(address _token, address _beneficiary) public {
        uint256 balance = tokenBalance(_token);
        IERC20(_token).approve(_beneficiary, balance);
        IERC20(_token).transfer(_beneficiary, balance);
    }

    function swapExactTokensForTokens(
        address[] memory _path,
        uint256 _sellAmount
    ) external {
        IERC20 token0 = IERC20(_path[0]);
        require(
            token0.approve(UNISWAP_V2_ROUTER, _sellAmount),
            "approve failed."
        );
        router.swapExactTokensForTokens(
            _sellAmount,
            0,
            _path,
            address(this),
            block.timestamp
        );
    }

    function sellPrice(uint256 _amountIn, address[] memory _path)
        external
        view
        returns (uint256)
    {
        require(_path.length >= 2, "Lib:sellPrice path length != 2");
        //TODO test to see if this change to path by reference
        address[] memory reverse = new address[](2);
        reverse[0] = _path[1];
        reverse[1] = _path[0];
        return router.getAmountsOut(_amountIn, reverse)[1];
    }
}
