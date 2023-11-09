import { useMemo, useRef } from "react";

import { usePrivy, useWallets, useConnectWallet } from "@privy-io/react-auth";
import { createWalletClient, custom } from "viem";

import { baseChain } from "../creator-token/utils";
import { useLatestValueRef } from "../use-latest-value-ref";
import { useStableCallback } from "../use-stable-callback";
import { ConnectResult, UseWalletReturnType } from "./types";

const useWallet = (): UseWalletReturnType => {
  const walletConnectedPromiseResolveCallback = useRef<any>(null);
  const privy = usePrivy();
  const wallets = useWallets();
  const latestConnectedWallet = useLatestValueRef(wallets.wallets[0]);
  useConnectWallet({
    onSuccess: (wallet) => {
      if (walletConnectedPromiseResolveCallback.current) {
        walletConnectedPromiseResolveCallback.current(wallet);
        walletConnectedPromiseResolveCallback.current = null;
      }
    },
  });

  const connected = !!wallets.wallets[0];

  const disconnect = useStableCallback(() => {
    localStorage.removeItem("walletconnect");
    wallets.wallets.forEach((wallet) => wallet.disconnect());
  });

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
      disconnect,
      signMessageAsync: ({ message }: { message: string }) => {
        return latestConnectedWallet.current.sign(message);
      },
    };
  }, [connected, disconnect, privy, latestConnectedWallet, wallets.wallets]);

  return result;
};

export { useWallet };
