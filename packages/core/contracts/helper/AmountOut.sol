// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract AmountOut{
    using SafeMath for uint256;

    IUniswapV2Router02 private router = IUniswapV2Router02(0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506);
    
    function getAmountsOut(uint256 _amountIn,  address _quote, address _base )
        public
        view
        returns ( uint256[] memory)
    {
        
        address[] memory path = new address[](2);
        path[0] = _quote;
        path[1] = _base;
        return router.getAmountsOut(_amountIn, path);
    }
    
    function getPrice(uint256 _amountIn,  address _quote, address _base )
        external
        view
        returns ( uint256 )
    {
        
        uint256[] memory amount = getAmountsOut( _amountIn,   _quote,  _base );
        
        uint256 basePrice = uint256(amount[1]).mul(10**8);
        uint256 price = basePrice.div(uint256(amount[0]));

        return price;
    }
}