// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract Swapper {
    address private constant UNISWAP_V2_ROUTER =
        // 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506; //sushi-poly
        // 0x1b02da8cb0d097eb8d57a175b88c7d8b47997506;
        // 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff; //quick-poly
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D; //uniswap

    function usingRouer() public pure returns (string memory) {
        if (UNISWAP_V2_ROUTER == 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff)
            return "quickswap";
        if (UNISWAP_V2_ROUTER == 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506)
            return "sushiswap";
        return "unknown";
    }

    IUniswapV2Router02 private router = IUniswapV2Router02(UNISWAP_V2_ROUTER);

    address private beneficiary;

    constructor() {
        beneficiary = msg.sender;
    }

    function withdraw(address _token) external {
        require(beneficiary == msg.sender, "caller is not the beneficiary");
        uint256 balance = IERC20(_token).balanceOf(address(this));
        IERC20(_token).approve(beneficiary, balance);
        IERC20(_token).transfer(beneficiary, balance);
    }

    function getAmountsOut(uint256 _amountIn, address[] memory _path)
        external
        view
        returns (uint256)
    {
        return router.getAmountsOut(_amountIn, _path)[1];
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

        uint256 amountOut = router.getAmountsOut(_sellAmount, _path)[1];
        uint256 calcMinOut = amountOut / 10000; //divid to avoid overflow
        calcMinOut = (calcMinOut / 10000) * (9500);
        calcMinOut = calcMinOut * 10000;

        router.swapExactTokensForTokens(
            _sellAmount,
            calcMinOut,
            _path,
            address(this),
            block.timestamp
        );
    }

    function swapSlippage(
        uint256 _amountIn,
        uint256 _amountOut,
        address _tokenAddr0,
        address _tokenAddr1
    ) public {
        IERC20 token0 = IERC20(_tokenAddr0);
        require(
            token0.approve(UNISWAP_V2_ROUTER, _amountIn),
            "approve failed."
        );
        address[] memory _path = new address[](2);
        _path[0] = _tokenAddr0;
        _path[1] = _tokenAddr1;

        router.swapExactTokensForTokens(
            _amountIn,
            _amountOut,
            _path,
            address(this),
            block.timestamp
        );
    }

    function swap(
        uint256 _amountIn,
        address _tokenAddr0,
        address _tokenAddr1
    ) public {
        IERC20 token0 = IERC20(_tokenAddr0);
        require(
            token0.approve(UNISWAP_V2_ROUTER, _amountIn),
            "approve failed."
        );
        address[] memory _path = new address[](2);
        _path[0] = _tokenAddr0;
        _path[1] = _tokenAddr1;

        router.swapExactTokensForTokens(
            _amountIn,
            0,
            _path,
            address(this),
            block.timestamp
        );
    }

    function addLiquidity(
        uint256 _amount0In,
        uint256 _amount1In,
        address _tokenAddr0,
        address _tokenAddr1
    ) public {
        router.addLiquidity(
            _tokenAddr0,
            _tokenAddr1,
            _amount0In,
            _amount1In,
            0,
            0,
            msg.sender,
            block.timestamp
        );
    }
}
