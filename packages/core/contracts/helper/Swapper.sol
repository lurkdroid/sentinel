// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract Swapper {
    address private constant UNISWAP_V2_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    IUniswapV2Router02 private router = IUniswapV2Router02(UNISWAP_V2_ROUTER);

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

    // function swap(uint256 _amountIn, address _tokenAddr) public {
    //     IERC20 TOKEN = IERC20(_tokenAddr);
    //     require(TOKEN.approve(UNISWAP_V2_ROUTER, _amountIn), "approve failed.");

    //     // amountOutMin must be retrieved from an oracle of some kind
    //     address[] memory path = new address[](2);
    //     path[0] = _tokenAddr;
    //     path[1] = router.WETH();

    //     router.swapExactTokensForETH(
    //         _amountIn,
    //         0,
    //         path,
    //         msg.sender,
    //         block.timestamp
    //     );
    // }

    // function swap(address _tokenAddr) public payable {
    //     // amountOutMin must be retrieved from an oracle of some kind
    //     address[] memory path = new address[](2);
    //     path[0] = router.WETH();
    //     path[1] = _tokenAddr;

    //     router.swapExactETHForTokens{value: msg.value}(
    //         0,
    //         path,
    //         msg.sender,
    //         block.timestamp
    //     );
    // }

    //TODO also need a POC on swapExactTokensForTokens
}
