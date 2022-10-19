export const colors = {
  green: "#6bd464",
  red: "#ff5151",
  blue: "#3A80F6",
  purple: "#a577ff",
  yellow: "#f3bf4b",
  pink: "#e45cff",
  teal: "#1dd4e0",
};
export const BOTTOM_TABBAR_BASE_HEIGHT = 64;

export const CONTRACTS = {
  ZORA: "0xabefbc9fd2f806065b4f3c237d4b59d9a97bcac7",
  RARIBLE_V2: "0x60f80121c31a0d46b5279700f9df786054aa5ee5",
  RARIBLE_1155: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
  KNOWNORIGIN: "0xfbeef911dc5821886e1dda71586d90ed28174b7d",
  KNOWNORIGIN_V2: "0xabb3738f04dc2ec20f4ae4462c3d069d02ae045b",
  FOUNDATION: "0x3b3ee1931dc30c1957379fac9aba94d1c48a5405",
  SUPERRARE_V1: "0x41a322b28d0ff354040e2cbc676f0320d8c8850d",
  SUPERRARE_V2: "0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0",
  ASYNCART_V1: "0x6c424c25e9f1fff9642cb5b7750b0db7312c29ad",
  ASYNCART_V2: "0xb6dae651468e9593e4581705a09c10a76ac1e0c8",
  CRYPTOARTAI: "0x3ad503084f1bd8d15a7f5ebe7a038c064e1e3fa1",
  PORTIONIO: "0xda98f59e1edecb2545d7b07b794e704ed6cf1f7a",
  PORTIONIO_1155: "0x0adf0bc748296bcba9f394d783a5f5e9406d6874",
  MINTABLE: "0x8c5acf6dbd24c66e6fd44d4a4c3d7a2d955aaad2", // Gasless store
  EPHIMERA: "0xfe21b0a8df3308c61cb13df57ae5962c567a668a",
  HICETNUNC: "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton",
  KALAMINT: "KT1EpGgjQs73QfFJs9z7m1Mxm5MTnpC2tqse",
};

export const DEFAULT_PROFILE_PIC =
  "https://cdn.tryshowtime.com/profile_placeholder2.jpg";
export const DISABLE_ALL = false;

// fields to sort by on profile page
export const SORT_FIELDS = {
  LIKE_COUNT: { label: "Popularity", key: "like_count", id: 1, value: 1 },
  NEWEST: {
    label: "Newest",
    key: "newest",
    id: 2,
    value: 2,
  },
  OLDEST: {
    label: "Oldest",
    key: "oldest",
    id: 3,
    value: 3,
  },
  COMMENT_COUNT: { label: "Comments", key: "comment_count", id: 4, value: 4 },
  // CUSTOM: { label: "Custom", key: "custom", id: 5, value: 5 },
};

export const ACTIVITY_TYPES = {
  LIKE: "like",
  COMMENT: "comment",
  SELL: "sell",
  BUY: "buy",
  CREATE: "create",
  FOLLOW: "follow",
  SEND: "send",
  RECEIVE: "receive",
};

export const PROFILE_TABS = [null, "created", "owned", "liked"]; // first  item blank due to tabs being 1-indexed

// TODO: Convert to classes and include it into the MentionsInput component
export const MENTIONS_STYLE = {
  control: {
    fontSize: 14,
    borderRadius: 10,
  },

  "&multiLine": {
    control: {
      minHeight: 63,
    },
    highlighter: {
      padding: 9,
      borderRadius: 10,
    },
    input: {
      padding: 9,
      borderRadius: 8,
    },
  },

  "&singleLine": {
    display: "inline-block",
    width: 180,

    highlighter: {
      padding: 1,
      border: "2px inset transparent",
    },
    input: {
      padding: 1,
      border: "2px inset",
      borderRadius: 10,
    },
  },

  suggestions: {
    background: "transparent",
    list: {
      background: null,
      fontSize: 14,
      borderRadius: 10,
      overflow: "hidden",
    },
    item: {
      padding: "5px 15px",
    },
  },
};

export const MINT_TYPES = [
  "image",
  "video",
  "model" /* 'audio', 'text', 'file' */,
];
export const MINT_FORMATS = {
  image: [".png", ".gif", ".jpg"],
  video: [".mp4", ".mov"],
  model: [".glb", ".gltf"],
  // audio: ['.mp3', '.flac', '.wav'],
  // text: ['.txt', '.md'],
  // file: ['.pdf', '.psd', '.ai'],
};

export const SHOWTIME_CONTRACTS = [process.env.NEXT_PUBLIC_MINTING_CONTRACT];

export const CHAIN_IDENTIFIERS = {
  ethereum: 1,
  tezos: "NetXdQprcVkpaWU",
  polygon: 137,
  mumbai: 80001,
};

// static height can improve tabs list initial rendering
export const TAB_LIST_HEIGHT = 50;

export const BYPASS_EMAIL = "test+success@magic.link";

export const BYPASS_EMAIL_WITH_INSECURE_KEYS =
  "test+success_with_{0x89A3983da27fF0eFCF901F74C4df84e0450A17B7:0x19de850af732e9e5745915162d707d6d8cf013ce7b2862e93081b0c8883bdfae}@magic.link";

export const LIST_CURRENCIES = {
  mumbai: {
    TKN: "0xd404017a401ff7ef65e7689630eca288e23d67a1",
    WETH: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
    DAI: "0x5A01Ea01Ba9A8DC2B066714A65E61a78838B1b9e",
    USDC: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
  },
  polygon: {
    USDC: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    WETH: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  },
  //@ts-ignore
}[process.env.NEXT_PUBLIC_CHAIN_ID];

export const SOL_MAX_INT =
  "115792089237316195423570985008687907853269984665640564039457584007913129639930";

export const CURRENCY_NAMES = {
  mumbai: {
    [LIST_CURRENCIES?.TKN]: "Test Token",
    [LIST_CURRENCIES?.WETH]: "Wrapped Ether",
    [LIST_CURRENCIES?.DAI]: "(PoS) Dai Stablecoin",
    [LIST_CURRENCIES?.USDC]: "Mumbai USD Coin",
  },
  polygon: {
    [LIST_CURRENCIES?.USDC]: "USD Coin (PoS)",
    [LIST_CURRENCIES?.WETH]: "Wrapped Ether",
    [LIST_CURRENCIES?.DAI]: "(PoS) Dai Stablecoin",
  },
  //@ts-ignore
}[process.env.NEXT_PUBLIC_CHAIN_ID];

export const HIDE_LINK_FOOTER_ROUTER_LIST = [
  "/nft/[chainName]/[contractAddress]/[tokenId]",
  "/list",
];
