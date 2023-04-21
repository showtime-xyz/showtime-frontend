import { Magic } from "@magic-sdk/react-native-expo";

import { OAuthExtension } from "app/lib/magic-oauth-ext";

import { Logger } from "../logger";

const isMumbai = process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai";

// Default to polygon chain
const customNodeOptions = {
  rpcUrl: "https://rpc-mainnet.maticvigil.com/",
  chainId: 137,
};

if (isMumbai) {
  Logger.log("Magic network is connecting to Mumbai testnet");
  customNodeOptions.rpcUrl =
    "https://polygon-mumbai.g.alchemy.com/v2/kh3WGQQaRugQsUXXLN8LkOBdIQzh86yL";
  customNodeOptions.chainId = 80001;
}

// @ts-ignore
const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY, {
  network: customNodeOptions,
  extensions: [new OAuthExtension()],
});

function useMagic() {
  return { magic, Magic };
}

const Relayer = magic.Relayer;

export { useMagic, Relayer };
