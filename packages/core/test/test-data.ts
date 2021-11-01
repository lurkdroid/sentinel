

export const testData: any = {
    localhost: { //ganache-cli fork rinkeby with 2 test tokens in uniswap liqidity pool, and some extra in the signer accout 
        token0Addr: "0x6b4A9f9ECBA6c7EaeDa648f1e9aa0CF7Fa4F071e",
        token1Addr: "0xC803789A6D1e80fD859343f2DB5306aF9DD2dD39"
    },
    matic: {
        // token0Addr: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",//DAI
        // token0Addr: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",//USDC
        token0Addr: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",//WMATIC
        token1Addr: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",//WETH
        // manager: "0x42aEA4B1BA24c98413C293520cBBB80462bd8d5F",
        botInstance: "0x55DD96626cc18318a0013827A31049ea1d5B2D5F,",
        // swapperAddr: "",//sushi
        swapperAddr: "0xe250e26F0339533dE93C1981c4bc35b942525Ac7",//quick
        SushiV2Router02: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        // SushiV2Router02: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506"
        quickV2Router02: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
    },
}
