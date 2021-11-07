
export const testData: any = {
    localhost: { //ganache-cli fork rinkeby with 2 test tokens in uniswap liqidity pool, and some extra in the signer accout 
        testToken0Addr: "0x6b4A9f9ECBA6c7EaeDa648f1e9aa0CF7Fa4F071e",
        testToken1Addr: "0xC803789A6D1e80fD859343f2DB5306aF9DD2dD39",
        // token0Addr: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",//DAI
        // token0Addr: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",//USDC
        token0Addr: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",//WMATIC
        token1Addr: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",//WETH
        // manager: "",
        botInstance: "0xf23322a9CF188331cC4460d237223ed690C53cad",
        // swapperAddr: "",//sushi
        swapperAddr: "0xe250e26F0339533dE93C1981c4bc35b942525Ac7",//quick
        //uniswapV2Router: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506"//sushi
        // uniswapV2Router: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff" //quckswap 
        uniswapV2Router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"//uniswap rinkeby,mainnet
    },
    matic: {
        // token0Addr: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",//DAI
        // token0Addr: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",//USDC
        token0Addr: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",//WMATIC
        token1Addr: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",//WETH
        // manager: "",
                // botInstance: "0xfbfbCD669bB915cd88586F05BAFea9aEe9b8aeDA",
        botInstance: "0x28FAd5fC20FfBD11f382Fe1dBeCcCb6c16aE10A4",
        // swapperAddr: "",//sushi
        swapperAddr: "0xe250e26F0339533dE93C1981c4bc35b942525Ac7",//quick
        SushiV2Router02: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        // SushiV2Router02: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506"
        quickV2Router02: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
    },
}
