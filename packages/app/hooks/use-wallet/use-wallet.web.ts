import { useMemo, useRef } from "react";

import { usePrivy, useConnectWallet, useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom } from "viem";

import { baseChain } from "../creator-token/utils";
import { useLatestValueRef } from "../use-latest-value-ref";
import { usePrivyWallet } from "../use-privy-wallet";
import { useStableCallback } from "../use-stable-callback";
import { ConnectResult, UseWalletReturnType } from "./types";

const useWallet = (): UseWalletReturnType => {
  const walletConnectedPromiseResolveCallback = useRef<any>(null);
  const privy = usePrivy();
  const privyWallet = usePrivyWallet();
  const latestConnectedWallet = useLatestValueRef(privyWallet);
  const privyWallets = useWallets();
  useConnectWallet({
    onSuccess: (wallet) => {
      if (walletConnectedPromiseResolveCallback.current) {
        walletConnectedPromiseResolveCallback.current(wallet);
        walletConnectedPromiseResolveCallback.current = null;
      }
    },
  });

  const connected = privyWallet;

  const disconnect = useStableCallback(() => {
    localStorage.removeItem("walletconnect");
    privyWallets.wallets.forEach((wallet) => wallet.disconnect());
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
        // @ts-ignore - Privy native embedded wallet types are not compatible with web
        await latestConnectedWallet.current?.switchChain(baseChain.id);
        const ethereumProvider =
          // @ts-ignore - Privy native embedded wallet types are not compatible with web
          await latestConnectedWallet.current?.getEthereumProvider();
        const walletClient = await createWalletClient({
          // @ts-ignore - Privy native embedded wallet types are not compatible with web
          account: latestConnectedWallet.current?.address as any,
          chain: baseChain,
          transport: custom(ethereumProvider),
        });
        return walletClient;
      },
      connected,
      // @ts-ignore - Privy native embedded wallet types are not compatible with web
      address: privyWallet?.address,
      disconnect,
      signMessageAsync: ({ message }: { message: string }) => {
        // @ts-ignore - Privy native embedded wallet types are not compatible with web
        return latestConnectedWallet.current.sign(message);
      },
    };
  }, [connected, disconnect, privy, latestConnectedWallet, privyWallet]);

  // @ts-ignore - Privy native embedded wallet types are not compatible with web
  return result;
};

export { useWallet };
