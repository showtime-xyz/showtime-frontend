import { useState, useEffect, useMemo, useRef } from "react";

import type { Bytes } from "@ethersproject/bytes";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

import { useLatestValueRef } from "app/hooks/use-latest-value-ref";
import { useWalletMobileSDK } from "app/hooks/use-wallet-mobile-sdk";
import { useWeb3 } from "app/hooks/use-web3";

import { ConnectResult, UseWalletReturnType } from "./types";
import { useRandomWallet } from "./use-random-wallet";

const useWallet = (): UseWalletReturnType => {
  const walletConnectedPromiseResolveCallback = useRef<any>(null);
  const connector = useWalletConnect();
  const { web3, isMagic, magicWalletAddress } = useWeb3();
  const mobileSDK = useWalletMobileSDK();
  const [address, setAddress] = useState<string | undefined>();

  // we use this hook to prevent stale values in closures
  const addressRef = useLatestValueRef(address);
  const walletConnectInstanceRef = useLatestValueRef(connector);
  const coinbaseMobileSDKInstanceRef = useLatestValueRef(mobileSDK);

  const walletConnected = connector.connected || mobileSDK.connected;

  useEffect(() => {
    (async function fetchUserAddress() {
      if (connector.session?.accounts?.[0]) {
        const getAddress = (await import("@ethersproject/address")).getAddress;
        setAddress(getAddress(connector.session.accounts[0]));
      } else if (magicWalletAddress) {
        setAddress(magicWalletAddress);
      } else if (mobileSDK.address) {
        setAddress(mobileSDK.address);
      } else if (web3) {
        const address = await web3.getSigner().getAddress();
        setAddress(address);
      } else {
        setAddress(undefined);
      }
    })();
  }, [web3, connector.session, magicWalletAddress, mobileSDK.address]);

  useEffect(() => {
    if (
      walletConnectedPromiseResolveCallback.current &&
      walletConnected &&
      address
    ) {
      walletConnectedPromiseResolveCallback.current({
        address: address,
        walletName: connector.peerMeta?.name,
      });
      walletConnectedPromiseResolveCallback.current = null;
    }
  }, [walletConnected, address, connector.peerMeta?.name]);

  const result = useMemo(() => {
    const wcConnected = connector.connected;
    const mobileSDKConnected = mobileSDK.connected;

    let walletName: string | undefined;
    if (wcConnected) {
      walletName = connector.peerMeta?.name;
    } else if (mobileSDKConnected) {
      walletName = mobileSDK.metadata?.name;
    }

    return {
      address,
      connect: async () => {
        walletConnectInstanceRef.current.connect();
        return new Promise<ConnectResult>((resolve) => {
          walletConnectedPromiseResolveCallback.current = resolve;
        });
      },
      disconnect: async () => {
        if (wcConnected) {
          localStorage.removeItem("walletconnect");
          await walletConnectInstanceRef.current.killSession();
        } else if (mobileSDKConnected) {
          coinbaseMobileSDKInstanceRef.current.disconnect();
        }
      },
      name: walletName,
      connected: walletConnected || isMagic,
      networkChanged: undefined,
      signMessageAsync: async (args: { message: string | Bytes }) => {
        if (walletConnectInstanceRef.current.connected) {
          const signature =
            await walletConnectInstanceRef.current.signPersonalMessage([
              args.message,
              addressRef.current,
            ]);
          return signature;
        } else if (
          coinbaseMobileSDKInstanceRef.current.connected &&
          addressRef.current
        ) {
          const signature =
            await coinbaseMobileSDKInstanceRef.current.personalSign(
              args.message,
              addressRef.current
            );
          return signature;
        }
      },
    };
  }, [
    connector.connected,
    connector.peerMeta?.name,
    mobileSDK.connected,
    mobileSDK.metadata?.name,
    address,
    walletConnected,
    isMagic,
    walletConnectInstanceRef,
    coinbaseMobileSDKInstanceRef,
    addressRef,
  ]);

  if (process.env.E2E) {
    // env variables won't change between renders, so this looks safe

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRandomWallet();
  }

  return result;
};

export { useWallet };
