import * as React from "react";
import { createContext, useState, useContext } from "react";

import { OAuthExtension } from "@magic-ext/oauth";
import { Magic } from "magic-sdk";

export const MagicContext = createContext({
  magic: {},
  Magic: null as any,
});

export const MagicProvider = ({ children }: any) => {
  const [magic, setMagic] = useState({});

  React.useEffect(() => {
    const isMumbai = process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai";

    if (Magic) {
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

      setMagic(
        new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY, {
          network: customNodeOptions,
          extensions: [new OAuthExtension()],
        })
      );
    }
  }, []);

  return (
    <MagicContext.Provider
      value={{
        magic,
        Magic,
      }}
    >
      {children}
    </MagicContext.Provider>
  );
};

export const useMagic = () => {
  return useContext(MagicContext);
};
