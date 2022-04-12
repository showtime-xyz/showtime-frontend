import { Fragment } from "react";

import { Magic } from "magic-sdk";

import { isServer } from "app/lib/is-server";

const isMumbai = process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai";
let magic = {};

if (!isServer) {
  // Default to polygon chain
  const customNodeOptions = {
    rpcUrl: "https://rpc-mainnet.maticvigil.com/",
    chainId: 137,
  };

  if (isMumbai) {
    console.log("Magic network is connecting to Mumbai testnet");
    customNodeOptions.rpcUrl =
      "https://polygon-mumbai.g.alchemy.com/v2/kh3WGQQaRugQsUXXLN8LkOBdIQzh86yL";
    customNodeOptions.chainId = 80001;
  }

  magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY, {
    network: customNodeOptions,
  });
}

const Relayer = Fragment;

export { magic, Magic, Relayer };
