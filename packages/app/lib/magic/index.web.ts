import { Fragment, useEffect, useState } from "react";

import { isServer } from "app/lib/is-server";

import { registerOnMagicLoad } from "./magic-load-listener";

const Relayer = Fragment;

function useMagic() {
  const [magic, setMagic] = useState({});
  const Magic = isServer
    ? null
    : (window as Window & typeof globalThis & { Magic: any })?.Magic;
  const [, setForceUpdate] = useState(false);

  useEffect(() => {
    const remove = registerOnMagicLoad(() => {
      setForceUpdate((p) => !p);
    });
    return remove;
  }, []);

  useEffect(() => {
    const isMumbai = process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai";

    if (!isServer && Magic) {
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
        })
      );
    }
  }, [Magic]);

  return { magic, Magic };
}

export { useMagic, Relayer };
