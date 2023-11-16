import { useState, useMemo, useEffect } from "react";

import type { Bytes } from "@ethersproject/bytes";
import type { Wallet } from "@ethersproject/wallet";

import { getWallet } from "app/lib/random-wallet";
import { delay } from "app/utilities";

import type { UseWalletReturnType } from "./types";

let wallet: Wallet;
async function initialiseRandomWallet() {
  wallet = await getWallet();
}
// Only create wallet if E2E. imp. creating wallet can be a costly operation
if (process.env.E2E) {
  initialiseRandomWallet();
}

let connected = false;
let connectedCallbacks: any = [];

const addOnConnectListener = (cb: any) => {
  connectedCallbacks.push(cb);
  return () => connectedCallbacks.filter((c: any) => c !== cb);
};

const onConnect = () => {
  connected = true;
  connectedCallbacks.forEach((c: any) => c());
};

const onDisconnect = () => {
  connected = false;
  connectedCallbacks.forEach((c: any) => c());
};

export const useRandomWallet = (): UseWalletReturnType => {
  const [forceUpdate, setForceUpdate] = useState(false);
  useEffect(() => {
    const unsubscribe = addOnConnectListener(() => {
      setForceUpdate((p) => !p);
    });
    return unsubscribe;
  }, []);

  const result = useMemo(() => {
    return {
      address: wallet.address,
      connect: async () => {
        await delay(200);
        onConnect();
        return {
          address: wallet.address,
          walletName: "Random Wallet",
        };
      },
      disconnect: async () => {
        await delay(200);
        onDisconnect();
      },
      name: "test wallet",
      connected,
      networkChanged: undefined,
      signMessageAsync: async (args: { message: string | Bytes }) => {
        const signature = await wallet.signMessage(args.message);
        return signature;
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceUpdate]);

  return result;
};
