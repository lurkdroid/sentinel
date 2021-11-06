// SPDX-License-Identifier: MIT
pragma solidity >=0.6.2;

interface IUniswapV2RouterUtil  {
        
    function WETH() external pure returns (address);

     function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);

}
