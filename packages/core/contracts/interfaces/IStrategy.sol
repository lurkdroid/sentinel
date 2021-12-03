


interface IStrategy{

    function shouldBuy(uint112 _reserve0, uint112 _reserve1) external view returns(uint amount);
    function shouldSell(uint112 _reserve0, uint112 _reserve1) external view returns(uint amount);

}