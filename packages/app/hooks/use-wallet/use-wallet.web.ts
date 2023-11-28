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
  const { wallets: connectedWallets } = useWallets();
  const wallet = connectedWallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  const latestConnectedWallet = useLatestValueRef(wallet);
  useConnectWallet({
    onSuccess: (wallet) => {
      console.log("wallet connect success", wallet);
      if (walletConnectedPromiseResolveCallback.current) {
        walletConnectedPromiseResolveCallback.current(wallet);
        walletConnectedPromiseResolveCallback.current = null;
      }
    },
  });

  const connected = !!wallet;

  const disconnect = useStableCallback(() => {
    localStorage.removeItem("walletconnect");
    connectedWallets.forEach((wallet) => wallet.disconnect());
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
        const ethereumProvider = await wallet?.getEthereumProvider();
        if (ethereumProvider) {
          const walletClient = await createWalletClient({
            account: latestConnectedWallet.current?.address as any,
            chain: baseChain,
            transport: custom(ethereumProvider),
          });
          return walletClient;
        }
      },
      connected,
      address: wallet?.address,
      disconnect,
      walletClientType: wallet?.walletClientType,
      signMessageAsync: ({ message }: { message: string }) => {
        return latestConnectedWallet.current?.sign(message);
      },
    };
  }, [connected, wallet, disconnect, privy, latestConnectedWallet]);

  return result;
};

export { useWallet };
