export const creatorTokenSwapRouterAbi = [
  {
    inputs: [
      { internalType: "address", name: "_universalRouter", type: "address" },
      { internalType: "address", name: "_wethAddress", type: "address" },
      { internalType: "address", name: "_usdcAddress", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "USDC_ADDRESS",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WETH_ADDRESS",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_creatorToken", type: "address" },
      { internalType: "uint256", name: "_numOfTokens", type: "uint256" },
      { internalType: "uint256", name: "_maxPayment", type: "uint256" },
    ],
    name: "bulkBuyWithEth",
    outputs: [{ internalType: "uint256", name: "_amountOut", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_creatorToken", type: "address" },
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_numOfTokens", type: "uint256" },
      { internalType: "uint256", name: "_maxPayment", type: "uint256" },
    ],
    name: "bulkBuyWithEth",
    outputs: [{ internalType: "uint256", name: "_amountOut", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_creatorToken", type: "address" },
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_maxPayment", type: "uint256" },
    ],
    name: "buyWithEth",
    outputs: [{ internalType: "uint256", name: "_amountOut", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_creatorToken", type: "address" },
      { internalType: "uint256", name: "_maxPayment", type: "uint256" },
    ],
    name: "buyWithEth",
    outputs: [{ internalType: "uint256", name: "_amountOut", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
];
