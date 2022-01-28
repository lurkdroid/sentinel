export const botInstance_abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_uniswap_v2_router",
        type: "address",
      },
      {
        internalType: "address",
        name: "_uniswap_v2_factory",
        type: "address",
      },
      {
        internalType: "address",
        name: "_oracle",
        type: "address",
      },
      {
        internalType: "address",
        name: "_beneficiary",
        type: "address",
      },
      {
        internalType: "address",
        name: "_quoteAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_strategy",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_defaultAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_stopLossPercent",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_loop",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum BotInstance.Side",
        name: "side",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token0",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token1",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tTime",
        type: "uint256",
      },
    ],
    name: "TradeComplete_",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_quoteAsset",
        type: "address",
      },
    ],
    name: "acceptSignal",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "botLoop",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token0",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token1",
        type: "address",
      },
    ],
    name: "buySignal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getConfig",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "quoteAsset",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "defaultAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stopLossPercent",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "loop",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "defaultAmountOnly",
            type: "bool",
          },
        ],
        internalType: "struct BotConfig",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPosition",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "baseAsset",
            type: "address",
          },
          {
            internalType: "uint112",
            name: "openReserveA",
            type: "uint112",
          },
          {
            internalType: "uint112",
            name: "openReserveB",
            type: "uint112",
          },
          {
            internalType: "uint32",
            name: "blockTimestamp",
            type: "uint32",
          },
          {
            internalType: "uint112",
            name: "amount",
            type: "uint112",
          },
          {
            internalType: "uint16",
            name: "sells",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "buys",
            type: "uint16",
          },
          {
            internalType: "bool",
            name: "open",
            type: "bool",
          },
        ],
        internalType: "struct Position",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPositionAndAmountOut",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "baseAsset",
            type: "address",
          },
          {
            internalType: "uint112",
            name: "openReserveA",
            type: "uint112",
          },
          {
            internalType: "uint112",
            name: "openReserveB",
            type: "uint112",
          },
          {
            internalType: "uint32",
            name: "blockTimestamp",
            type: "uint32",
          },
          {
            internalType: "uint112",
            name: "amount",
            type: "uint112",
          },
          {
            internalType: "uint16",
            name: "sells",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "buys",
            type: "uint16",
          },
          {
            internalType: "bool",
            name: "open",
            type: "bool",
          },
        ],
        internalType: "struct Position",
        name: "_position",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "_reserveA",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_reserveB",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sellPosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "shouldSellAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_strategy",
        type: "address",
      },
      {
        internalType: "address",
        name: "_quoteAsset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_defaultAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_stopLossPercent",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_loop",
        type: "bool",
      },
    ],
    name: "update",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "wakeMe",
    outputs: [
      {
        internalType: "bool",
        name: "_wakene",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];