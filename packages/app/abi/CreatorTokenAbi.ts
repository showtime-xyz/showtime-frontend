export const creatorTokenAbi = [
  {
    inputs: [
      {
        internalType: "contract IShowtimeVerifier",
        name: "_verifier",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_domainSeparator",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CreatorTokenFactory__DeploymentNotVerified",
    type: "error",
  },
  {
    inputs: [],
    name: "CreatorTokenFactory__InvalidAttestation",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract CreatorToken",
        name: "creatorToken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract CTBondingCurve",
        name: "bondingCurve",
        type: "address",
      },
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "tokenURI",
            type: "string",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "creatorFee",
            type: "uint256",
          },
          {
            internalType: "uint96",
            name: "creatorRoyalty",
            type: "uint96",
          },
          {
            internalType: "address",
            name: "admin",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "adminFee",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "referrer",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "payToken",
            type: "address",
          },
          {
            internalType: "uint128",
            name: "basePrice",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "linearPriceSlope",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "inflectionPrice",
            type: "uint128",
          },
          {
            internalType: "uint32",
            name: "inflectionPoint",
            type: "uint32",
          },
          {
            internalType: "bytes32",
            name: "attestationDigest",
            type: "bytes32",
          },
        ],
        indexed: false,
        internalType: "struct CreatorTokenFactory.DeploymentConfig",
        name: "config",
        type: "tuple",
      },
    ],
    name: "CreatorTokenDeployed",
    type: "event",
  },
  {
    inputs: [],
    name: "DEPLOY_TYPE",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEPLOY_TYPE_HASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "VERIFIER",
    outputs: [
      {
        internalType: "contract IShowtimeVerifier",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "tokenURI",
            type: "string",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "creatorFee",
            type: "uint256",
          },
          {
            internalType: "uint96",
            name: "creatorRoyalty",
            type: "uint96",
          },
          {
            internalType: "address",
            name: "admin",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "adminFee",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "referrer",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "payToken",
            type: "address",
          },
          {
            internalType: "uint128",
            name: "basePrice",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "linearPriceSlope",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "inflectionPrice",
            type: "uint128",
          },
          {
            internalType: "uint32",
            name: "inflectionPoint",
            type: "uint32",
          },
          {
            internalType: "bytes32",
            name: "attestationDigest",
            type: "bytes32",
          },
        ],
        internalType: "struct CreatorTokenFactory.DeploymentConfig",
        name: "_config",
        type: "tuple",
      },
    ],
    name: "createDigest",
    outputs: [
      {
        internalType: "bytes32",
        name: "_digest",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "address",
            name: "context",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "validUntil",
            type: "uint256",
          },
        ],
        internalType: "struct Attestation",
        name: "_attestation",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "tokenURI",
            type: "string",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "creatorFee",
            type: "uint256",
          },
          {
            internalType: "uint96",
            name: "creatorRoyalty",
            type: "uint96",
          },
          {
            internalType: "address",
            name: "admin",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "adminFee",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "referrer",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "payToken",
            type: "address",
          },
          {
            internalType: "uint128",
            name: "basePrice",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "linearPriceSlope",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "inflectionPrice",
            type: "uint128",
          },
          {
            internalType: "uint32",
            name: "inflectionPoint",
            type: "uint32",
          },
          {
            internalType: "bytes32",
            name: "attestationDigest",
            type: "bytes32",
          },
        ],
        internalType: "struct CreatorTokenFactory.DeploymentConfig",
        name: "_config",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "_signature",
        type: "bytes",
      },
    ],
    name: "deploy",
    outputs: [
      {
        internalType: "contract CreatorToken",
        name: "_creatorToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "domainSeparator",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "tokenURI",
            type: "string",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "creatorFee",
            type: "uint256",
          },
          {
            internalType: "uint96",
            name: "creatorRoyalty",
            type: "uint96",
          },
          {
            internalType: "address",
            name: "admin",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "adminFee",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "referrer",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "payToken",
            type: "address",
          },
          {
            internalType: "uint128",
            name: "basePrice",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "linearPriceSlope",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "inflectionPrice",
            type: "uint128",
          },
          {
            internalType: "uint32",
            name: "inflectionPoint",
            type: "uint32",
          },
          {
            internalType: "bytes32",
            name: "attestationDigest",
            type: "bytes32",
          },
        ],
        internalType: "struct CreatorTokenFactory.DeploymentConfig",
        name: "_config",
        type: "tuple",
      },
    ],
    name: "encode",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];
