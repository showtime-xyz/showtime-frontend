import { useMemo, useState, useEffect, useRef } from "react";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useSignMessage,
  useWalletClient,
  useNetwork,
  useDisconnect,
} from "wagmi";

import { Alert } from "@showtime-xyz/universal.alert";

import { useWeb3 } from "app/hooks/use-web3";

import { useLatestValueRef } from "../use-latest-value-ref";
import { ConnectResult, UseWalletReturnType } from "./types";

const useWallet = (): UseWalletReturnType => {
  const walletConnectedPromiseResolveCallback = useRef<any>(null);
  const walletDisconnectedPromiseResolveCallback = useRef<any>(null);
  const wagmiData = useAccount({
    onConnect: ({ connector, ...rest }) => {
      const walletName = connector?.name;
      walletConnectedPromiseResolveCallback.current?.({
        ...rest,
        connector: connector,
        walletName,
      });
      walletConnectedPromiseResolveCallback.current = null;
    },
    onDisconnect: () => {
      walletDisconnectedPromiseResolveCallback.current?.();
      walletDisconnectedPromiseResolveCallback.current = null;
    },
  });
  const { signMessageAsync } = useSignMessage();
  const { data: wagmiSigner } = useWalletClient();
  const { chain } = useNetwork();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const { web3, isMagic, magicWalletAddress } = useWeb3();

  const networkChanged = useMemo(() => !!chain && chain.id !== 137, [chain]);
  const [address, setAddress] = useState<string | undefined>();

  // we use this hook to prevent stale values in closures
  const openConnectModalRef = useLatestValueRef(openConnectModal);

  useEffect(() => {
    (async function fetchUserAddress() {
      if (wagmiData?.address) {
        setAddress(wagmiData?.address);
      } else if (magicWalletAddress) {
        setAddress(magicWalletAddress);
      } else if (web3) {
        const address = web3.account?.address;
        setAddress(address);
      } else {
        setAddress(undefined);
      }
    })();
  }, [web3, wagmiData?.address, magicWalletAddress]);

  const connected =
    (wagmiData.isConnected && !!wagmiSigner?.account.address && !!chain) ||
    isMagic;

  console.log("connected ", wagmiSigner);

  const result = useMemo(() => {
    return {
      address,
      connect: async () => {
        if (openConnectModalRef.current) {
          openConnectModalRef.current();
        } else {
          Alert.alert(
            "Oops, connection to wallet failed. Please refresh the page and try again."
          );
        }
        return new Promise<ConnectResult>((resolve) => {
          walletConnectedPromiseResolveCallback.current = resolve;
        });
      },
      connected,
      disconnect: async () => {
        localStorage.removeItem("walletconnect");
        disconnect();
        return new Promise<any>((resolve) => {
          if (wagmiData.isConnected) {
            walletDisconnectedPromiseResolveCallback.current = resolve;
          } else {
            resolve(true);
          }
        });
      },
      networkChanged,
      signMessageAsync,
    };
  }, [
    address,
    connected,
    networkChanged,
    signMessageAsync,
    openConnectModalRef,
    disconnect,
    wagmiData.isConnected,
  ]);

  return result;
};

export { useWallet };
