import { useMemo, useEffect, useRef } from "react";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom } from "viem";

import { baseChain } from "../creator-token/utils";
import { useLatestValueRef } from "../use-latest-value-ref";
import { ConnectResult, UseWalletReturnType } from "./types";

const useWallet = (): UseWalletReturnType => {
  const walletConnectedPromiseResolveCallback = useRef<any>(null);
  const privy = usePrivy();
  const wallets = useWallets();
  const prevConnectedWalletAddress = useRef<any>(null);
  const latestConnectedWallet = useLatestValueRef(wallets.wallets[0]);

  useEffect(() => {
    if (
      wallets.wallets[0]?.address &&
      walletConnectedPromiseResolveCallback.current &&
      prevConnectedWalletAddress.current !== wallets.wallets[0]?.address
    ) {
      walletConnectedPromiseResolveCallback.current(wallets.wallets[0]);
      walletConnectedPromiseResolveCallback.current = null;
      prevConnectedWalletAddress.current = wallets.wallets[0].address;
    }
  }, [wallets.wallets]);

  const connected = !!wallets.wallets[0];

  const result = useMemo(() => {
    return {
      connect: async () => {
        privy.connectWallet();
        return new Promise<ConnectResult>((resolve) => {
          walletConnectedPromiseResolveCallback.current = resolve;
        });
      },
      getWalletClient: async () => {
        await latestConnectedWallet.current?.switchChain(baseChain.id);
        const ethereumProvider =
          await wallets.wallets[0]?.getEthereumProvider();
        const walletClient = await createWalletClient({
          account: latestConnectedWallet.current?.address as any,
          chain: baseChain,
          transport: custom(ethereumProvider),
        });
        return walletClient;
      },
      connected,
      disconnect: async () => {
        localStorage.removeItem("walletconnect");
        return latestConnectedWallet.current?.disconnect() as any;
      },
      signMessageAsync: ({ message }: { message: string }) => {
        return latestConnectedWallet.current.sign(message);
      },
    };
  }, [connected, privy, latestConnectedWallet, wallets.wallets]);

  return result;
};

export { useWallet };
